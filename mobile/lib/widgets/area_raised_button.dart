import 'package:area/constants/area_theme.dart';
import 'package:flutter/material.dart';

class AreaRaisedButton extends StatelessWidget {

  final VoidCallback onPressed;
  final String text;
  final Color textColor;
  final double? height;
  final double? width;
  final Color color;

  const AreaRaisedButton({
    Key? key,
    required this.onPressed,
    required this.text,
    this.textColor = AreaTheme.white,
    this.height,
    this.width,
    this.color = AreaTheme.frenchSkyBlue
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double? _height = height;
    double? _width = width;
    return ElevatedButton(
        onPressed: onPressed,
        child: Text(
          text,
          style: AreaTheme.bodyText1.override(
            fontFamily: AreaTheme.primaryFontFamily,
            color: textColor,
          ),
        ),
        style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            primary: color,
            fixedSize: _width != null && _height != null ? Size(_width, _height):null
        )
    );
  }
}