import 'dart:convert';

import 'package:area/constants/settings.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class BackendController {

  static Future<String?> signInWithOauth({required String code, required String name, required String email}) async {
    final prefs = await SharedPreferences.getInstance();
    final sendGoogleCodeUrl = Uri.parse("${prefs.getString("endpoint") ?? prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.signInGoogleRoute}");
    return await http.post(sendGoogleCodeUrl,
        headers: {
          "Authorization": "Bearer ${prefs.getString("jwt")}",
          "Content-Type": "application/json"
        },
        body: jsonEncode({
          "email": email,
          "name": name,
          "access_token": code
        }))
        .then((r) async {
      final body = jsonDecode(r.body);
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - signInWithOauth] Post code 200 (success)\nBody: " + r.body.toString());
        final prefs = await SharedPreferences.getInstance();
        prefs.setString("jwt", body["token"]);
        prefs.setString("username", body["user"]["name"]);
        prefs.setString("email", body["user"]["email"]);
        prefs.setString("userId", body["user"]["id"]);
        await prefs.setBool('isLogged', true);
        return null;
      } else {
        Get.printInfo(info: "[BackendController - signInWithOauth] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return jsonDecode(r.body)["errors"].toString();
      }
    })
        .catchError((e) {
      Get.printInfo(info: "[BackendController - signInWithOauth] catchError\nError: " + e.toString());
      return e.toString();
    });
  }

  static Future<String?> signIn({required String email, required String password}) async {
    final prefs = await SharedPreferences.getInstance();
    final signInUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.signinRoute}");
    Get.printInfo(info: "[BackendController - signIn] Posting to $signInUrl");
    if (email == "") {
      return "Email is empty";
    }
    if (password == "") {
      return "Password is empty";
    }
    return await http.post(signInUrl,
        headers: {
          "Content-Type": "application/json"
        },
        body: jsonEncode({
      "email": email,
      "password": password
    })).then((r) async {
      final body = jsonDecode(r.body);
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - signIn] Post code 200 (success)\nBody: " + r.body.toString());
        final prefs = await SharedPreferences.getInstance();
        prefs.setString("jwt", body["token"]);
        prefs.setString("username", body["user"]["name"]);
        prefs.setString("email", body["user"]["email"]);
        prefs.setString("userId", body["user"]["id"]);
        await prefs.setBool('isLogged', true);
        return null;
      } else {
        Get.printInfo(info: "[BackendController - signIn] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return body["errors"].toString();
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - signIn] catchError\nError: " + e.toString());
      return "Oops ! Something went wrong ! Retry";
    });
  }

  static Future<String?> signUp({required String email, required String username, required String password, required String confirmPassword}) async {
    final prefs = await SharedPreferences.getInstance();
    final signUpUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.signupRoute}");
    if (email == "") {
      return "Email is empty";
    }
    if (username.length < 3) {
      return "Username  is too short (min 3 characters)";
    }
    if (password.length < 6) {
      return "Password is too short (min 6 characters)";
    }
    if (password != confirmPassword) {
      return "Passwords don't match";
    }
    return await http.post(signUpUrl,
        headers: {
      "Content-Type": "application/json"
        },
        body: jsonEncode({
      "name": username,
      "email": email,
      "password": password
    }))
        .then((r) async {
          if (r.statusCode == 200) {
            Get.printInfo(info: "[BackendController - signUp] Post code 200 (success)\nBody: " + r.body.toString());
            return await signIn(email: email, password: password);
          } else {
            Get.printInfo(info: "[BackendController - signUp] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
            return jsonDecode(r.body)["errors"].toString();
          }
    })
    .catchError((e) {
      Get.printInfo(info: "[BackendController - signUp] catchError\nError: " + e.toString());
      return e.toString();
    });
  }

  static Future<String?> signOut() async {
    Get.printInfo(info: "[BackendController - signOut] Sign Out");
    return null;
  }

  static Future<String?> updateArea({required String actionReactionId, required String name, required Object? actionParams, required Object? reactionParams}) async {
    final prefs = await SharedPreferences.getInstance();
    final updateAreaUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.updateAreaRoute}");
    return await http.post(updateAreaUrl,
      headers: {
        "Authorization": "Bearer ${prefs.getString("jwt")}",
        "Content-Type": "application/json"
      },
      body: jsonEncode({
        "actionReactionId": actionReactionId,
        "name": name,
        "paramsAction": actionParams,
        "paramsReaction": reactionParams
    }))
        .then((r) async {
          if (r.statusCode == 200) {
            Get.printInfo(info: "[BackendController - updateArea] Post code 200 (success)\nBody: " + r.body.toString());
            return null;
          } else {
            Get.printInfo(info: "[BackendController - updateArea] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
            return jsonDecode(r.body)["errors"].toString();
          }
    })
        .catchError((e) {
      Get.printInfo(info: "[BackendController - updateArea] catchError\nError: " + e.toString());
          return e.toString();
        });
  }

  static Future<String?> createArea({required String name, required String actionService, required String action, required String reactionService, required String reaction, Object? actionParams, Object? reactionParams}) async {
    final prefs = await SharedPreferences.getInstance();
    final createAreaUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.createAreaRoute}");
    Get.printInfo(info: "Post to: $createAreaUrl");
    Get.printInfo(info: jsonEncode({
      "name": name,
      "actionService": actionService,
      "action": action,
      "reactionService": reactionService,
      "reaction": reaction,
      "paramsAction": actionParams,
      "paramsReaction": reactionParams
    }));
    return await http.post(createAreaUrl,
      headers: {
        "Authorization": "Bearer ${prefs.getString("jwt")}",
        "Content-Type": "application/json"
      }, body: jsonEncode({
          "name": name,
          "actionService": actionService,
          "action": action,
          "reactionService": reactionService,
          "reaction": reaction,
          "paramsAction": actionParams,
          "paramsReaction": reactionParams
      })).then((r) async {
        if (r.statusCode == 200) {
          Get.printInfo(info: "[BackendController - createArea] Post code 200 (success)\nBody: " + r.body.toString());
          return null;
        } else {
          Get.printInfo(info: "[BackendController - createArea] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
          return jsonDecode(r.body)["errors"].toString();
        }}).catchError((e) {
          Get.printInfo(info: "[BackendController - createArea] catchError\nError: " + e.toString());
          return e.toString();
        });
  }

  static Future<dynamic> about() async {
    final prefs = await SharedPreferences.getInstance();
    final aboutUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.aboutRoute}");
    return await http.get(aboutUrl).then((r) {
      return jsonDecode(r.body);
    }).catchError((e) {
      return e.toString();
    });
  }

  static Future<String?> deleteArea({required String actionReactionId}) async {
    final prefs = await SharedPreferences.getInstance();
    final deleteAreaUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.deleteAreaRoute}");
    Get.printInfo(info: "id: $actionReactionId");
    return await http.post(deleteAreaUrl,
        headers: {
          "Authorization": "Bearer ${prefs.getString("jwt")}",
          "Content-Type": "application/json"
        },
        body: jsonEncode({
          "actionReactionId": actionReactionId
        }))
        .then((r) async {
          if (r.statusCode == 200) {
            Get.printInfo(info: "[BackendController - deleteArea] Post code 200 (success)\nBody: " + r.body.toString());
            return null;
          } else {
            Get.printInfo(info: "[BackendController - deleteArea] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
            return jsonDecode(r.body)["errors"].toString();
          }
    })
        .catchError((e) {
      Get.printInfo(info: "[BackendController - deleteArea] catchError\nError: " + e.toString());
          return e.toString();
        });
  }

  static Future<Object?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final getUserUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.getUserRoute}");
    return await http.get(getUserUrl,
        headers: {
          "Authorization": "Bearer ${prefs.getString("jwt")}",
          "Content-Type": "application/json"
        }).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - getUser] Get code 200 (success)\nBody: " + r.body.toString());
        return jsonDecode(r.body);
      } else {
        Get.printInfo(info: "[BackendController - getUser] Get code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return null;
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - getUser] catchError\nError: " + e.toString());
      return null;
    });
  }

  static Future<String?> sendGithubCode(String code) async {
    final prefs = await SharedPreferences.getInstance();
    final sendGithubCodeUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.githubCodeRoute}");
    return await http.post(sendGithubCodeUrl,
        headers: {
          "Authorization": "Bearer ${prefs.getString("jwt")}",
          "Content-Type": "application/json"
        },
        body: jsonEncode({
          "code": code
        }))
        .then((r) async {
          if (r.statusCode == 200) {
            Get.printInfo(info: "[BackendController - sendGithubCode] Post code 200 (success)\nBody: " + r.body.toString());
            return null;
          } else {
            Get.printInfo(info: "[BackendController - sendGithubCode] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
            return jsonDecode(r.body)["errors"].toString();
          }
    })
        .catchError((e) {
      Get.printInfo(info: "[BackendController - sendGithubCode] catchError\nError: " + e.toString());
          return e.toString();
        });
  }

  static Future<String?> getGithubOAuthLink() async {
    final prefs = await SharedPreferences.getInstance();
    final getGithubClientIdUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.gitHubUrlRoute}");
    return await http.get(getGithubClientIdUrl,
        headers: {
          "Authorization": "Bearer ${await SharedPreferences.getInstance().then((prefs) => prefs.getString("jwt"))}",
          "Content-Type": "application/json"
        }).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - getGithubOAuthLink] Get code 200 (success)\nBody: " + r.body.toString());
        return r.body;
      } else {
        Get.printInfo(info: "[BackendController - getGithubOAuthLink] Get code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return null;
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - getGithubOAuthLink] catchError\nError: " + e.toString());
      return null;
    });
  }

  static Future<String?> getGoogleClientId() async {
    final prefs = await SharedPreferences.getInstance();
    final getGoogleClientIdUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.googleClientIdRoute}");
    return await http.get(getGoogleClientIdUrl,
        headers: {
          "Content-Type": "application/json"
        },).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - getGoogleClientId] Post code 200 (success)\nBody: " + r.body.toString());
        return jsonDecode(r.body)["clientId"];
      } else {
        Get.printInfo(info: "[BackendController - getGoogleClientId] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return null;
      }
    }
    ).catchError((e) {
      Get.printInfo(info: "[BackendController - getGoogleClientId] catchError\nError: " + e.toString());
      return null;
    });
  }

  static Future<String?> storeGoogleCode(String code) async {
    final prefs = await SharedPreferences.getInstance();
    final storeGoogleCodeUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.googleCodeRoute}");
    return await http.post(storeGoogleCodeUrl,
        headers: {
          "Authorization": "Bearer ${await SharedPreferences.getInstance().then((prefs) => prefs.getString("jwt"))}",
          "Content-Type": "application/json"
        },
        body: jsonEncode({
          "access_token": code
        }))
        .then((r) async {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - storeGoogleCode] Post code 200 (success)\nBody: " + r.body.toString());
        return null;
      } else {
        Get.printInfo(info: "[BackendController - storeGoogleCode] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return jsonDecode(r.body)["errors"].toString();
      }
    })
        .catchError((e) {
      Get.printInfo(info: "[BackendController - storeGoogleCode] catchError\nError: " + e.toString());
      return e.toString();
    });
  }

  static Future<String?> unlinkGithub() async {
    final prefs = await SharedPreferences.getInstance();
    final unlinkGithubUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.unlinkGithubRoute}");
    return await http.post(unlinkGithubUrl,
        headers: {
          "Authorization": "Bearer ${await SharedPreferences.getInstance().then((prefs) => prefs.getString("jwt"))}",
          "Content-Type": "application/json"
        },).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - unlinkGithub] Post code 200 (success)\nBody: " + r.body.toString());
        return null;
      } else {
        Get.printInfo(info: "[BackendController - unlinkGithub] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return jsonDecode(r.body)["errors"].toString();
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - unlinkGithub] catchError\nError: " + e.toString());
      return e.toString();
    });
  }

  static Future<String?> unlinkGoogle() async {
    final prefs = await SharedPreferences.getInstance();
    final unlinkGoogleUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.unlinkGoogleRoute}");
    return await http.post(unlinkGoogleUrl,
        headers: {
          "Authorization": "Bearer ${await SharedPreferences.getInstance().then((prefs) => prefs.getString("jwt"))}",
          "Content-Type": "application/json"
        },).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - unlinkGoogle] Post code 200 (success)\nBody: " + r.body.toString());
        return null;
      } else {
        Get.printInfo(info: "[BackendController - unlinkGoogle] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return jsonDecode(r.body)["errors"].toString();
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - unlinkGoogle] catchError\nError: " + e.toString());
      return e.toString();
    });
  }

  static Future<String?> getTrelloUrl() async {
    final prefs = await SharedPreferences.getInstance();
    final getTrelloUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.getTrelloUrlRoute}");
    return await http.get(getTrelloUrl,
        headers: {
          "Authorization": "Bearer ${await SharedPreferences.getInstance().then((prefs) => prefs.getString("jwt"))}",
          "Content-Type": "application/json"
        },).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - getTrelloUrl] Get code 200 (success)\nBody: " + r.body.toString());
        return r.body;
      } else {
        Get.printInfo(info: "[BackendController - getTrelloUrl] Get code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return null;
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - getTrelloUrl] catchError\nError: " + e.toString());
      return null;
    });
  }

  static Future<String?> postTrelloUrl(String code) async {
    final prefs = await SharedPreferences.getInstance();
    final postTrelloUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.postTrelloUrlRoute}");
    return await http.post(postTrelloUrl,
        headers: {
          "Authorization": "Bearer ${await SharedPreferences.getInstance().then((prefs) => prefs.getString("jwt"))}",
          "Content-Type": "application/json"
        }, body: jsonEncode({
          "code": code
        })).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - postTrelloUrl] Post code 200 (success)\nBody: " + r.body.toString());
        return null;
      } else {
        Get.printInfo(info: "[BackendController - postTrelloUrl] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return jsonDecode(r.body)["errors"].toString();
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - postTrelloUrl] catchError\nError: " + e.toString());
      return e.toString();
    });
  }

  static Future<String?> getDaylimotionUrl() async {
    final prefs = await SharedPreferences.getInstance();
    final getDaylimotionUrl = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.getDailymotionRoute}");
    return http.get(getDaylimotionUrl,
        headers: {
          "Authorization": "Bearer ${prefs.getString("jwt")}",
          "Content-Type": "application/json"
        },).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - getDaylimotionUrl] Get code 200 (success)\nBody: " + r.body.toString());
        return r.body;
      } else {
        Get.printInfo(info: "[BackendController - getDaylimotionUrl] Get code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return null;
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - getDaylimotionUrl] catchError\nError: " + e.toString());
      return null;
    });
  }

  static Future<String?> postDaylimotionCode(String code) async {
    final prefs = await SharedPreferences.getInstance();
    final postDaylimotionCode = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.postDailymotionCode}");
    return http.post(postDaylimotionCode,
        headers: {
          "Authorization": "Bearer ${prefs.getString("jwt")}",
          "Content-Type": "application/json"
        }, body: jsonEncode({
          "code": code
        })).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - postDaylimotionCode] Post code 200 (success)\nBody: " + r.body.toString());
        return null;
      } else {
        Get.printInfo(info: "[BackendController - postDaylimotionCode] Post code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return jsonDecode(r.body)["errors"].toString();
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - postDaylimotionCode] catchError\nError: " + e.toString());
      return e.toString();
    });
  }

  static Future<String?> unlinkDailymotion() async {
    final prefs = await SharedPreferences.getInstance();
    final unlinkDailymotion = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.unlinkDailymotionRoute}");
    return http.delete(unlinkDailymotion,
        headers: {
          "Authorization": "Bearer ${prefs.getString("jwt")}",
          "Content-Type": "application/json"
        },).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - unlinkDailymotion] Delete code 200 (success)\nBody: " + r.body.toString());
        return null;
      } else {
        Get.printInfo(info: "[BackendController - unlinkDailymotion] Delete code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return jsonDecode(r.body)["errors"].toString();
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - unlinkDailymotion] catchError\nError: " + e.toString());
      return e.toString();
    });
  }

  static Future<String?> unlinkTrello() async {
    final prefs = await SharedPreferences.getInstance();
    final unlinkTrello = Uri.parse("${prefs.getString("endpoint") ?? Settings.backendEndpoint}/${Settings.unlinkTrelloRoute}");
    return http.delete(unlinkTrello,
        headers: {
          "Authorization": "Bearer ${prefs.getString("jwt")}",
          "Content-Type": "application/json"
        },).then((r) {
      if (r.statusCode == 200) {
        Get.printInfo(info: "[BackendController - unlinkTrello] Delete code 200 (success)\nBody: " + r.body.toString());
        return null;
      } else {
        Get.printInfo(info: "[BackendController - unlinkTrello] Delete code ${r.statusCode} (failure)\nBody: " + r.body.toString());
        return jsonDecode(r.body)["errors"].toString();
      }
    }).catchError((e) {
      Get.printInfo(info: "[BackendController - unlinkTrello] catchError\nError: " + e.toString());
      return e.toString();
    });
  }
}