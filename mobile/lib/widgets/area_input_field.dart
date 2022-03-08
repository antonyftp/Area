import 'package:area/constants/area_theme.dart';
import 'package:flutter/material.dart';

class AreaInputText extends StatelessWidget {
  const AreaInputText({Key? key, required this.hintText, required this.labelText, required this.controller, this.autofillHints, this.obscureText = false, this.autoFocus = false, this.keyboardType = TextInputType.text, this.disableAutocorrect = false}) : super(key: key);

  final String hintText;
  final String labelText;
  final TextEditingController controller;
  final Iterable<String>? autofillHints;
  final bool obscureText;
  final bool autoFocus;
  final TextInputType keyboardType;
  final bool disableAutocorrect;

  @override
  Widget build(BuildContext context) {
    if (autofillHints == null) {
      return (TextField(
        autocorrect: !disableAutocorrect,
        keyboardType: keyboardType,
        autofocus: autoFocus,
        controller: controller,
        obscureText: obscureText,
        style: AreaTheme.bodyText1,
        decoration: InputDecoration(
          hintText: hintText,
          filled: true,
          fillColor: AreaTheme.richBlack,
          hintStyle: AreaTheme.bodyText1,
          labelText: labelText,
          labelStyle: AreaTheme.bodyText1,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ));
    } else {
      return (TextField(
        autocorrect: !disableAutocorrect,
        keyboardType: keyboardType,
        autofocus: autoFocus,
        controller: controller,
        obscureText: obscureText,
        autofillHints: autofillHints,
        style: AreaTheme.bodyText1,
        decoration: InputDecoration(
          hintText: hintText,
          labelText: labelText,
          filled: true,
          fillColor: AreaTheme.richBlack,
          hintStyle: AreaTheme.bodyText1.copyWith(color: AreaTheme.white.withOpacity(0.5)),
          labelStyle: AreaTheme.bodyText1,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ));
    }
  }
}