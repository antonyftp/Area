import 'dart:convert';

import 'package:area/constants/area_theme.dart';
import 'package:area/constants/settings.dart';
import 'package:area/controllers/backend.dart';
import 'package:area/screens/oauth_link.dart';
import 'package:area/screens/home/home.dart';
import 'package:area/utils/AreaDialog.dart';
import 'package:area/widgets/area_icon_button.dart';
import 'package:area/widgets/area_input_field.dart';
import 'package:area/widgets/area_raised_button.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Account extends StatefulWidget {
  const Account({Key? key}) : super(key: key);

  @override
  _AccountState createState() => _AccountState();
}

class _AccountState extends State<Account> {

  late final SharedPreferences _prefs;
  String? _username;
  String? _email;
  List<String> _accounts = ["Google", "Discord", "Github"];
  final TextEditingController _apiEndpointController = TextEditingController();

  _changeEndpoint() {
    AreaDialog.showComplex(
        title: "New EndPoint",
        rightButtonText: "Change",
        rightButtonOnPressed: () {
          _prefs.setString(
              "endpoint", _apiEndpointController.text.trim());
          BackendController.about().then((value) {
            SharedPreferences.getInstance().then((pref) {
              pref.setString("about", jsonEncode(value));
            });
          });
          BackendController.getUser().then((value) {
            if (value != null) {
              SharedPreferences.getInstance().then((pref) {
                pref.setString("user", jsonEncode(value));
              });
            }
          });
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

  _updateServices() {
    BackendController.getUser().then((dynamic value) {
      _accounts.clear();
      if (value != null) {
        if (value["githubOAuth"] != null) {
          _accounts.add("Github");
        }
        if (value["googleOAuth"] != null) {
          _accounts.add("Google");
        }
        if (value["discordOAuth"] != null) {
          _accounts.add("Discord");
        }
        if (value["trelloOAuth"] != null) {
          _accounts.add("Trello");
        }
        if (value["dailymotionOAuth"] != null) {
          _accounts.add("Dailymotion");
        }
      }
      setState(() {});
    });
  }

  @override
  void initState() {
    super.initState();
    SharedPreferences.getInstance().then((value) {
      _prefs = value;
      setState(() {
        _username = _prefs.getString('username') ?? '';
        _email = _prefs.getString('email') ?? '';
      });
      _updateServices();
    });
  }

  _signOut() async {
    final res = await BackendController.signOut();
    if (res != null) {
      AreaDialog.show(
          title: "Error",
          message: res
      );
      return;
    }
    _prefs.setBool("isLogged", false);
    Get.to(() => const Home(), transition: Transition.rightToLeft);
  }

  _linkGoogleAccount() async {
    if (_accounts.contains("Google")) {
      final res = await BackendController.unlinkGoogle();
      if (res != null) {
        AreaDialog.show(message: "Something went wrong while unlinking Google account", title: "Error");
        return;
      }
      return;
    }
    GoogleSignIn _googleSignIn = GoogleSignIn();
    try {
      final user = await _googleSignIn.signIn();
      user!.authentication.then((value) async {
        final res = await BackendController.storeGoogleCode(value.accessToken!);
        if (res != null) {
          AreaDialog.show(
              title: "Error",
              message: res
          );
          return;
        }
        AreaDialog.show(
            title: "Success",
            message: "Successfully linked Google account"
        );
        _updateServices();
      });
    } catch (e) {
      Get.printInfo(info : "[Account - _linkGoogleAccount ] Catch error $e");
      AreaDialog.show(
          title: "Error",
          message: e.toString()
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    Get.printInfo(info: "[_AccountState - build] _accounts : $_accounts");
    return Scaffold(
      backgroundColor: AreaTheme.richBlackLight,
      appBar: AppBar(
        title: Text("${_username ?? ''}'s Account"),
        backgroundColor: AreaTheme.richBlack,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Get.off(() => const Home(), transition: Transition.leftToRight),
        ),
      ),
      body: SafeArea(
        child: WillPopScope(
          onWillPop: () async => false,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Center(
                  child: Text("Email: ${_email ?? ''}", style: AreaTheme.bodyText1),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: AreaIconButton(
                  color: AreaTheme.black,
                    onPressed: () async {
                      if (_accounts.contains("Github")) {
                        final res = await BackendController.unlinkGithub();
                        if (res != null) {
                          AreaDialog.show(message: "Something went wrong while unlinking Github account", title: "Error");
                          return;
                        }
                        return;
                      }
                      final githubLink = await BackendController.getGithubOAuthLink();
                      if (githubLink == null) {
                        AreaDialog.show(message: "Something went wrong when getting Github Infos", title: "Error");
                        return;
                      }
                      Get.to(() => const OAuthLink(), arguments: {
                        "serviceName": "GitHub",
                        "serviceUrl": githubLink,
                        "serviceColor": AreaTheme.black,
                        "serviceCallbackUrl": Settings.githubCallback,
                        "backendFunction": BackendController.sendGithubCode,
                      });
                    },
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 10.0),
                          child: Image.asset('assets/images/github-logo.png'),
                        ),
                        Text((_accounts.contains("Github") ? "Unlink" : "Link") + " Github acccount",
                            style: AreaTheme.bodyText1
                        )
                      ],
                    ),
                  height: 60,
                  width: double.infinity,
                ),
              ),

              Padding(
                padding: const EdgeInsets.all(8.0),
                child: AreaIconButton(
                  color: AreaTheme.white,
                  onPressed: _linkGoogleAccount,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 10.0),
                        child: Image.asset('assets/images/google-logo.png'),
                      ),
                      Text((_accounts.contains("Google") ? "Unlink" :  "Link") + " Google account",
                          style: AreaTheme.bodyText1.copyWith(color: AreaTheme.black)
                      )
                    ],
                  ),
                  height: 60,
                  width: double.infinity,
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: AreaIconButton(
                  color: AreaTheme.trelloBlue,
                  onPressed: () async {
                    if (_accounts.contains("Trello")) {
                      final res = await BackendController.unlinkGithub();
                      if (res != null) {
                        AreaDialog.show(message: "Something went wrong while unlinking Trello account", title: "Error");
                        return;
                      }
                      return;
                    }
                    final trelloLink = await BackendController.getTrelloUrl();
                    if (trelloLink == null) {
                      AreaDialog.show(message: "Something went wrong when getting Trello Infos", title: "Error");
                      return;
                    }
                    Get.to(() => const OAuthLink(), arguments: {
                      "serviceName": "Trello",
                      "serviceUrl": trelloLink,
                      "serviceColor": AreaTheme.trelloBlue,
                      "serviceCallbackUrl": Settings.trelloCallBack,
                      "backendFunction": BackendController.postTrelloUrl,
                    });
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 10.0),
                        child: Image.asset('assets/images/trello-logo.png'),
                      ),
                      Text((_accounts.contains("Trello") ? "Unlink" : "Link") + " Trello acccount",
                          style: AreaTheme.bodyText1
                      )
                    ],
                  ),
                  height: 60,
                  width: double.infinity,
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: AreaIconButton(
                  color: AreaTheme.black,
                  onPressed: () async {
                    if (_accounts.contains("Daylimotion")) {
                      final res = await BackendController.unlinkGithub();
                      if (res != null) {
                        AreaDialog.show(message: "Something went wrong while unlinking Daylimontion account", title: "Error");
                        return;
                      }
                      return;
                    }
                    final daylimontionLink = await BackendController.getDaylimotionUrl();
                    if (daylimontionLink == null) {
                      AreaDialog.show(message: "Something went wrong when getting Daylimontion Infos", title: "Error");
                      return;
                    }
                    Get.to(() => const OAuthLink(), arguments: {
                      "serviceName": "Daylimontion",
                      "serviceUrl": daylimontionLink,
                      "serviceColor": AreaTheme.black,
                      "serviceCallbackUrl": Settings.daylimotionCallback,
                      "backendFunction": BackendController.postDaylimotionCode,
                    });
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 10.0),
                        child: Image.asset('assets/images/daylimotion-logo.png'),
                      ),
                      Text((_accounts.contains("Dailymotion") ? "Unlink" : "Link") + " Daylimotion acccount",
                          style: AreaTheme.bodyText1
                      )
                    ],
                  ),
                  height: 60,
                  width: double.infinity,
                ),
              ),
              const Spacer(),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: AreaRaisedButton(
                  height: 60,
                  width: 260,
                  onPressed: _changeEndpoint,
                  text: "Change API Endpoint",
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: AreaRaisedButton(
                  height: 60,
                  width: 260,
                  color: AreaTheme.red,
                  onPressed: _signOut,
                  text: "Sign Out",
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
