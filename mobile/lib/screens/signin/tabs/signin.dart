import 'package:area/constants/area_theme.dart';
import 'package:area/controllers/backend.dart';
import 'package:area/screens/home/home.dart';
import 'package:area/utils/area_dialog.dart';
import 'package:area/widgets/area_icon_button.dart';
import 'package:area/widgets/area_input_field.dart';
import 'package:area/widgets/area_raised_button.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_sign_in/google_sign_in.dart';

class SignInTab extends StatefulWidget {
  const SignInTab({Key? key}) : super(key: key);

  @override
  _SignInTabState createState() => _SignInTabState();
}

class _SignInTabState extends State<SignInTab> {

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  _signIn() async {
    final res = await BackendController.signIn(email: _emailController.text, password: _passwordController.text);
    if (res != null) {
      AreaDialog.show(
          title: "Error",
          message: res
      );
      return;
    }
    Get.off(() => const Home(), transition: Transition.upToDown);
  }

  _signInWithGoogle() async {
    Get.back();
    GoogleSignIn _googleSignIn = GoogleSignIn(
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://mail.google.com/',
      ],
    );
    try {
      final user =  await _googleSignIn.signIn();
      Get.printInfo(info: user!.displayName!.toString());
      final code = await user.authentication.then((value) => value.accessToken);
      Get.printInfo(info: code.toString());
      final res = await BackendController.signInWithOauth(code: code!, name: user.displayName ?? user.email.split("@").first, email: user.email);
      if (res != null) {
        AreaDialog.show(
            title: "Error",
            message: res
        );
        return;
      }
      Get.off(() => const Home(), transition: Transition.upToDown);
    } catch (error) {
      AreaDialog.show(
          title: "Error",
          message: "Something went wrong, please try again later"
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
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
            autofillHints: const [AutofillHints.password]
          )
        ),
        Padding(
          padding: const EdgeInsets.only(top: 20.0),
          child: AreaRaisedButton(
            onPressed: _signIn,
            text: "Sign in",
            height: 60,
            width: 260,
          )
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                color: AreaTheme.white,
                height: 1,
                width: 70,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Text("OR", style: AreaTheme.bodyText1),
              ),
              Container(
                color: AreaTheme.white,
                height: 1,
                width: 70,
              ),
            ]
          ),
        ),
        AreaIconButton(
          color: AreaTheme.white,
          onPressed: () => AreaDialog.showChoice(
              title: "Conditions",
              message: "By clicking on the 'OK' I accept that Area use my information to identify me and create actions/reactions. I also certify that I am at least 18 years old.",
              leftButtonText: "Back",
              rightButtonText: "OK",
              leftButtonOnPressed: () => Get.back(),
              rightButtonOnPressed: _signInWithGoogle
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 10.0),
                child: Image.asset('assets/images/google-logo.png'),
              ),
              Text("Sign In with Google",
                  style: AreaTheme.bodyText1.copyWith(color: AreaTheme.black)
              )
            ],
          ),
          height: 60,
          width: 260,
        )
      ],
    );
  }
}