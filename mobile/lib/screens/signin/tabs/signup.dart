import 'package:area/controllers/backend.dart';
import 'package:area/screens/home/home.dart';
import 'package:area/utils/AreaDialog.dart';
import 'package:area/widgets/area_input_field.dart';
import 'package:area/widgets/area_raised_button.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SignUpTab extends StatefulWidget {
  const SignUpTab({Key? key}) : super(key: key);

  @override
  _SignUpTabState createState() => _SignUpTabState();
}

class _SignUpTabState extends State<SignUpTab> {

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _passwordConfirmController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();

  _signUp() async {
    final res = await BackendController.signUp(email: _emailController.text, username: _usernameController.text, password: _passwordController.text, confirmPassword: _passwordController.text);
    if (res != null) {
      AreaDialog.show(
        title: 'Error',
        message: res,
      );
      return;
    }
    Get.off(() => const Home(), transition: Transition.upToDown);
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isLogged', true);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
            padding: const EdgeInsets.fromLTRB(40.0, 20.0, 40.0, 0.0),
            child: AreaInputText(
              disableAutocorrect: true,
              labelText: "Username",
              hintText: "Enter your username",
              controller: _usernameController,
            )
        ),
        Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40.0, vertical: 20.0),
            child: AreaInputText(
              disableAutocorrect: true,
              keyboardType: TextInputType.emailAddress,
              labelText: "Email",
              hintText: "Enter your email address ...",
              controller: _emailController,
              autofillHints: const [AutofillHints.email]
            )
        ),
        Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40.0),
            child: AreaInputText(
              disableAutocorrect: true,
              labelText: "Password",
              hintText: "Enter your password ...",
              controller: _passwordController,
              obscureText: true,
              autofillHints: const [AutofillHints.newPassword]
            )
        ),
        Padding(
            padding: const EdgeInsets.fromLTRB(40.0, 20.0, 40.0, 0.0),
            child: AreaInputText(
              disableAutocorrect: true,
              labelText: "Confirm password",
              hintText: "Confirm your password ...",
              controller: _passwordConfirmController,
              obscureText: true,
              autofillHints: const [AutofillHints.newPassword]
            )
        ),
        Padding(
            padding: const EdgeInsets.only(top: 20.0),
            child: AreaRaisedButton(
              onPressed: () => AreaDialog.showChoice(
                  title: "Conditions",
                  message: "By clicking on the 'OK' I accept that Area use my information to identify me and create actions/reactions. I also certify that I am at least 18 years old.",
                  leftButtonText: "Back",
                  rightButtonText: "OK",
                  leftButtonOnPressed: () => Get.back(),
                  rightButtonOnPressed: _signUp
              ),
              text: "Sing Up",
              height: 60,
              width: 260,
            )
        ),
      ],
    );
  }
}