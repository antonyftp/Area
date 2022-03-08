import 'dart:convert';

import 'package:area/constants/area_theme.dart';
import 'package:area/controllers/backend.dart';
import 'package:area/screens/account.dart';
import 'package:area/screens/edit_area.dart';
import 'package:area/screens/home/empty_area_list.dart';
import 'package:area/screens/signin/signin_signup.dart';
import 'package:area/widgets/new_area.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Home extends StatefulWidget {
  const Home({Key? key}) : super(key: key);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {

  bool? isLogged;
  dynamic user;
  late List<dynamic> actionsReactions;

  refreshUser() async {
    BackendController.getUser().then((value) {
      if (value != null) {
        SharedPreferences.getInstance().then((pref) {
          pref.setString("user", jsonEncode(value));
        });
        setState(() {
          user = value;
          actionsReactions = List.from(user!['actionsReactions']);
        });
      }
    });
  }

  @override
  void initState() {
    super.initState();
    BackendController.about().then((value) {
      SharedPreferences.getInstance().then((pref) {
        pref.setString("about", jsonEncode(value));
      });
    });
    SharedPreferences.getInstance().then((value) {
      setState(() {
        isLogged = value.getBool('isLogged') ?? false;
      });
    });
    refreshUser();
  }

  @override
  Widget build(BuildContext context) {
    if (isLogged == false) {
      Future.delayed(const Duration(milliseconds: 100), () {
        Get.to(() => const LoginRegister(), transition: Transition.downToUp);
      });
    }
    Get.printInfo(info: "[_HomeState - build] isLogged: $isLogged");
    return WillPopScope(
      onWillPop: () async => false,
      child: Scaffold(
        backgroundColor: AreaTheme.richBlackLight,
        appBar: AppBar(
          title: const Text('Area'),
          backgroundColor: AreaTheme.richBlack,
          automaticallyImplyLeading: false,
          actions: [
            IconButton(
              icon: const Icon(Icons.account_circle),
              onPressed: () => Get.to(() => const Account()),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton(
          backgroundColor: AreaTheme.frenchSkyBlue,
          onPressed: () => Get.bottomSheet(NewARea(refresh: refreshUser,)),
          child: const Icon(Icons.add),
        ),
        body: RefreshIndicator(
            onRefresh: () async {
              await refreshUser();
            },
            child: user == null ? const SizedBox.shrink() : (actionsReactions.isEmpty ? const EmptyAreaList() : GridView.count(
              crossAxisCount: 2,
              children: user!['actionsReactions'].map<Widget>((action) {
                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: InkWell(
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: AreaTheme.richBlack,
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            action['name'],
                            style: AreaTheme.titleText1,
                            textAlign: TextAlign.center,
                            overflow: TextOverflow.ellipsis,
                            maxLines: 4,
                          ),
                          Text(
                            "${action['actionService']} / ${action['reactionService']}",
                            style: AreaTheme.titleText2
                          ),
                        ],
                      ),
                    ),
                    onTap: () async => Get.to(() => const EditArea(), arguments: {
                      "id": action['id'],
                      "actionParams": action["paramsAction"],
                      "reactionParams": action["paramsReaction"],
                      "refresh": refreshUser,
                      "name": action['name'],
                      "actionService": action['actionService'],
                      "action": action['action'],
                      "reactionService": action['reactionService'],
                      "reaction": action['reaction'],
                      "isEditing": true,
                      "services": await SharedPreferences.getInstance().then((value) {
                        var res = value.getString('about') ?? "";
                        var tmp = jsonDecode(res);
                        return tmp["server"];
                      })
                    }),
                  ),
                );
              }).toList() as List<Widget>,
            )),
        )
      ),
    );
  }
}
