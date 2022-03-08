import 'dart:convert';

import 'package:area/constants/area_theme.dart';
import 'package:area/controllers/backend.dart';
import 'package:area/screens/signin/tabs/signin.dart';
import 'package:area/screens/signin/tabs/signup.dart';
import 'package:area/utils/AreaDialog.dart';
import 'package:area/widgets/area_input_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginRegister extends StatefulWidget {
  const LoginRegister({Key? key}) : super(key: key);

  @override
  _LoginRegisterState createState() => _LoginRegisterState();
}

class _LoginRegisterState extends State<LoginRegister> with SingleTickerProviderStateMixin {

  int _currentIndex = 0;
  late TabController _tabController;

  _updateCurrentIndex() {
    setState(() {
      _currentIndex = _tabController.index;
    });
  }

  @override
  void initState() {
    super.initState();
    _tabController = TabController(vsync: this, length: 2)
    ..addListener(_updateCurrentIndex);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  final TextEditingController _apiEndpointController = TextEditingController();

  _changeEndpoint() async {
    final _prefs = await SharedPreferences.getInstance();
    AreaDialog.showComplex(
        title: "New EndPoint",
        rightButtonText: "Change",
        rightButtonOnPressed: () {
          _prefs.setString(
              "endpoint", _apiEndpointController.text.trim());
          Get.back();
        },
        leftButtonText: "Cancel",
        leftButtonOnPressed: () => Get.back(),
        height: 250,
        children: [
          AreaInputText(hintText: "Enter the new endpoint", labelText: "New Endpoint", controller: _apiEndpointController)
        ]
    );
  }

  @override
  Widget build(BuildContext context) {
    Widget _buildTabBar() {
      return TabBar(
        indicatorSize: TabBarIndicatorSize.label,
        controller: _tabController,
        indicatorColor: _currentIndex == 0 ? AreaTheme.frenchSkyBlue : AreaTheme.uranianBlue,
        tabs: [
          Tab(
            child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Text("Sign In",
                    style :TextStyle(color: _currentIndex == 0 ? AreaTheme.frenchSkyBlue : AreaTheme.gray))
            ),
          ),
          Tab(
              child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Text("Sign Up",
                      style :TextStyle(color: _currentIndex == 1 ? AreaTheme.uranianBlue : AreaTheme.gray))
              )
          ),
        ],
      );
    }

    return Scaffold(
      backgroundColor: AreaTheme.richBlackLight,
      body: WillPopScope(
        onWillPop: () async { return false; },
        child: ListView(
            children: [
              Padding(
                padding: const EdgeInsets.all(8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    IconButton(onPressed: _changeEndpoint, icon: const Icon(Icons.settings, color: AreaTheme.white))
                  ],
                )
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 150.0, vertical: 20.0),
                child: Image.asset('assets/images/area-logo.png'),
              ),
              _buildTabBar(),
              SizedBox(
                height: 390,
                child: TabBarView(
                  controller: _tabController,
                  children: const [
                    SignInTab(),
                    SignUpTab(),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
