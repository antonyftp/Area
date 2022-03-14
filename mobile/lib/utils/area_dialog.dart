import 'package:area/constants/area_theme.dart';
import 'package:area/widgets/area_raised_button.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AreaDialog {
  static show({
    required String title,
    required String message,
    }) => Get.dialog(
    Dialog(
      backgroundColor: Colors.transparent,
      child: Stack(
        clipBehavior: Clip.none, children: [
          Container(
            height: 250,
            width: MediaQuery.of(Get.context!).size.width * 0.8,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AreaTheme.richBlackLight,
              borderRadius: BorderRadius.circular(30),
            ),
            child: Padding(
              padding: const EdgeInsets.only(top: 40.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 5.0),
                    child: Text(title, style: AreaTheme.titleText1),
                  ),
                  SizedBox(
                      height: 90,
                      child: ListView(children: [Text(message, style: AreaTheme.bodyText1)])
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 5.0),
                    child: AreaRaisedButton(onPressed: () => Get.back(), text: "OK"),
                  )
                ]
              ),
            ),
          ),
          Positioned(
            top: -50,
            left: MediaQuery.of(Get.context!).size.width * 0.26,
            child: Center(child: Image.asset('assets/images/area-logo.png', width: 100, height: 100,)),
          )
        ],
      ),
    ),
  );

  static showChoice({
    required String title,
    required String message,
    required String leftButtonText,
    required String rightButtonText,
    required VoidCallback leftButtonOnPressed,
    required VoidCallback rightButtonOnPressed,
  }) => Get.dialog(
    Dialog(
      backgroundColor: Colors.transparent,
      child: Stack(
        clipBehavior: Clip.none, children: [
        Container(
          height: 250,
          width: MediaQuery.of(Get.context!).size.width * 0.8,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AreaTheme.richBlackLight,
            borderRadius: BorderRadius.circular(30),
          ),
          child: Padding(
            padding: const EdgeInsets.only(top: 40.0),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 5.0),
                    child: Text(title, style: AreaTheme.titleText1),
                  ),
                  SizedBox(
                    height: 90,
                    child: ListView(children: [Text(message, style: AreaTheme.bodyText1)])
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 5.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        AreaRaisedButton(onPressed: leftButtonOnPressed, text: leftButtonText),
                        AreaRaisedButton(onPressed: rightButtonOnPressed, text: rightButtonText)
                      ],
                    ),
                  )
                ]
            ),
          ),
        ),
        Positioned(
          top: -50,
          left: MediaQuery.of(Get.context!).size.width * 0.26,
          child: Center(child: Image.asset('assets/images/area-logo.png', width: 100, height: 100,)),
        )
      ],
      ),
    ),
  );

  static showComplex({
    required String title,
    String? leftButtonText,
    required String rightButtonText,
    VoidCallback? leftButtonOnPressed,
    required VoidCallback rightButtonOnPressed,
    required double height,
    required List<Widget> children
  }) => Get.dialog(
    Dialog(
      backgroundColor: Colors.transparent,
      child: Stack(
        clipBehavior: Clip.none, children: [
        Container(
          height: height,
          width: MediaQuery.of(Get.context!).size.width * 0.8,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AreaTheme.richBlackLight,
            borderRadius: BorderRadius.circular(30),
          ),
          child: Padding(
            padding: const EdgeInsets.only(top: 40.0),
            child: ListView(
                children:
                  <Widget>[ Text(title, style: AreaTheme.titleText1)] +
                  children +
                  <Widget>[Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    if (leftButtonOnPressed != null && leftButtonText != null) AreaRaisedButton(onPressed: leftButtonOnPressed, text: leftButtonText),
                    AreaRaisedButton(onPressed: rightButtonOnPressed, text: rightButtonText)
                  ],
                )]
            ),
          ),
        ),
        Positioned(
          top: -50,
          left: MediaQuery.of(Get.context!).size.width * 0.26,
          child: Center(child: Image.asset('assets/images/area-logo.png', width: 100, height: 100,)),
        )
      ],
      ),
    ),
  );
}