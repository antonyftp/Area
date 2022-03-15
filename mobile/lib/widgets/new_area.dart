import 'dart:convert';
import 'package:area/constants/area_theme.dart';
import 'package:area/screens/edit_area.dart';
import 'package:area/utils/area_dialog.dart';
import 'package:area/widgets/area_dropdown_button.dart';
import 'package:area/widgets/area_input_field.dart';
import 'package:area/widgets/area_raised_button.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

//ignore: must_be_immutable
class NewARea extends StatefulWidget {
  NewARea({Key? key, required this.refresh}) : super(key: key);
  void Function() refresh;

  @override
  _NewAReaState createState() => _NewAReaState();
}

class _NewAReaState extends State<NewARea> {

  final TextEditingController _nameController = TextEditingController();
  String _selectedActionService = "-1";
  String _selectedAction = "-1";
  String _selectedReactionService = "-1";
  String _selectedReaction = "-1";
  dynamic _services;
  final List<String> _linkedServices = [];

  @override
  void initState() {
    super.initState();
    SharedPreferences.getInstance().then((prefs) {
      var about = prefs.getString('about');
      if (about != null) {
        setState(() {
          var tmp = json.decode(about);
          Get.printInfo(info: tmp.toString());
          _services = tmp["server"];
        });
      }
      var user = prefs.getString('user');
      if (user != null) {
        setState(() {
          var tmp = json.decode(user);
          if (tmp["githubOAuth"] != null) {
            _linkedServices.add("Github");
          }
          if (tmp["googleOAuth"] != null) {
            _linkedServices.add("Gmail");
            _linkedServices.add("Youtube");
          }
          if (tmp["discordOAuth"] != null) {
            _linkedServices.add("Discord");
          }
          if (tmp["trelloOAuth"] != null) {
            _linkedServices.add("Trello");
          }
          if (tmp["dailymotionOAuth"] != null) {
            _linkedServices.add("Dailymotion");
          }
        });
      }
      Get.printInfo(info: "[_NewAReaState - initState] _linkedServices: $_linkedServices");
    });
  }

  _getServices(bool isReaction) {
    final List<DropdownMenuItem<String>> list = [];
    list.add(DropdownMenuItem(
        child: SizedBox(
            width: MediaQuery.of(context).size.width - 70,
            child: const Text("Select Service")
        ),
        value: "-1"
    ));
    for (int i = 0; i < _services["services"].length; i++) {
      if (_linkedServices.contains(_services["services"][i]["name"]) || (!isReaction && _services["services"][i]["name"] == "Weather") || (!isReaction && _services["services"][i]["name"] == "Pornhub")) {
        list.add(DropdownMenuItem(
            child: SizedBox(
                width: MediaQuery.of(context).size.width - 70,
                child: Text(_services["services"][i]["name"])
            ),
            value: "$i"
        ));
      }
    }
    return list;
  }

  _getActions() {
    final List<DropdownMenuItem<String>> list = [];
    list.add(DropdownMenuItem(
        child: SizedBox(
            width: MediaQuery.of(context).size.width - 50,
            child: const Text("Select Action")
        ),
        value: "-1"
    ));
    for (int i = 0; i < _services["services"][int.parse(_selectedActionService)]["actions"].length; i++) {
      list.add(DropdownMenuItem(
        child: SizedBox(
            width: MediaQuery.of(context).size.width - 50,
            child: Text(_services["services"][int.parse(_selectedActionService)]["actions"][i]["description"], overflow: TextOverflow.ellipsis,)
        ),
        value: "$i"
      ));
    }
    return list;
  }

  _getReaction() {
    final List<DropdownMenuItem<String>> list = [];
    list.add(DropdownMenuItem(
        child: SizedBox(
            width: MediaQuery.of(context).size.width - 50,
            child: const Text("Select Reaction")
        ),
        value: "-1"
    ));
    for (int i = 0; i < _services["services"][int.parse(_selectedReactionService)]["reactions"].length; i++) {
      list.add(DropdownMenuItem(
        child: SizedBox(
            width: MediaQuery.of(context).size.width - 50,
            child: Text(_services["services"][int.parse(_selectedReactionService)]["reactions"][i]["description"], overflow: TextOverflow.ellipsis,)
        ),
        value: "$i"
      ));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    Get.printInfo(info: _linkedServices.toString());
    return Container(
      decoration: const BoxDecoration(
        color: AreaTheme.richBlackLight,
        borderRadius: BorderRadius.only(topLeft: Radius.circular(30), topRight: Radius.circular(30)),
      ),
      child: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          ListView(
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 20),
                child: Center(
                  child: Text('New Area',
                    style: AreaTheme.titleText1,
                  )
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 20, left: 20, right: 20),
                child: AreaInputText(
                  controller: _nameController,
                  hintText: "Entre the name of the ARea",
                  labelText: "ARea Name",
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 15, left: 26),
                child: Text("Action Service", style: AreaTheme.titleText2),
              ),
              if (_services != null) Padding(
                padding: const EdgeInsets.only(top: 5, left: 20, right: 20),
                child: AreaDropdownButton(
                    value: _selectedActionService,
                    items: _getServices(false),
                    onChanged: (value) => setState(() => _selectedActionService = value.toString())
                )
              ),
              if (_selectedActionService != "-1") Padding(
                padding: const EdgeInsets.only(top: 15, left: 26),
                child: Text("Action", style: AreaTheme.titleText2),
              ),
              if (_services != null && _selectedActionService != "-1") Padding(
                padding: const EdgeInsets.only(top: 5, left: 20, right: 20),
                child: AreaDropdownButton(
                    value: _selectedAction,
                    items: _getActions(),
                    onChanged: (value) => setState(() => _selectedAction = value.toString())
                )
              ),
              if (_selectedAction != "-1") Padding(
                padding: const EdgeInsets.only(top: 15, left: 26),
                child: Text("Reaction Service", style: AreaTheme.titleText2),
              ),
              if (_services != null && _selectedAction != "-1") Padding(
                padding: const EdgeInsets.only(top: 5, left: 20, right: 20),
                child: AreaDropdownButton(
                    value: _selectedReactionService,
                    items: _getServices(true),
                    onChanged: (value) => setState(() => _selectedReactionService = value.toString())
                )
              ),
              if (_selectedReactionService != "-1") Padding(
                padding: const EdgeInsets.only(top: 15, left: 26),
                child: Text("Reaction", style: AreaTheme.titleText2),
              ),
              if (_services != null && _selectedReactionService != "-1") Padding(
                padding: const EdgeInsets.only(top: 5, left: 20, right: 20),
                child: AreaDropdownButton(
                    value: _selectedReaction,
                    items: _getReaction(),
                    onChanged: (value) => setState(() => _selectedReaction = value.toString())
                )
              ),
              const SizedBox(height: 100),
            ],
          ),
          Container(
            decoration: const BoxDecoration(
              color: AreaTheme.richBlackLight,
              borderRadius: BorderRadius.only(bottomLeft: Radius.circular(30), bottomRight: Radius.circular(30)),
            ),
            child: Padding(
              padding: const EdgeInsets.only(bottom: 30, top: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  AreaRaisedButton(
                      onPressed: () {
                          Get.printInfo(info: "Undo");
                          Get.back();
                        },
                      text: "Undo",
                      color: AreaTheme.richBlack,
                      width: 150,
                      height: 50,
                  ),
                  AreaRaisedButton(
                      onPressed: () {
                        Get.printInfo(info: "Add");
                        if (_selectedReactionService == "-1" || _selectedReaction == "-1" || _selectedActionService == "-1" || _selectedAction == "-1") {
                          AreaDialog.show(title: "Error", message: "Please select all fields");
                          return;
                        }
                        Get.back();
                        Get.to(() => const EditArea(), arguments: {
                          "refresh": widget.refresh,
                          "name": _nameController.text == "" ? "Unnamed" : _nameController.text,
                          "actionService": _services["services"][int.parse(_selectedActionService)]["name"],
                          "action": _services["services"][int.parse(_selectedActionService)]["actions"][int.parse(_selectedAction)]["name"],
                          "reactionService": _services["services"][int.parse(_selectedReactionService)]["name"],
                          "reaction": _services["services"][int.parse(_selectedReactionService)]["reactions"][int.parse(_selectedReaction)]["name"],
                          "isEditing": false,
                          "services": _services
                        });
                      },
                      text: "Add",
                      width: 150,
                      height: 50,
                  )
                ],
              ),
            ),
          )
        ]
      ),
    );
  }
}
