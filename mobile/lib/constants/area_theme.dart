import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AreaTheme {
  static const Color richBlack = Color(0xFF11151c);
  static const Color richBlackLight = Color(0xff2c2c31);
  static const Color uranianBlue = Color(0xffADD7F6);
  static const Color frenchSkyBlue = Color(0xFF87BFFF);
  static const Color white = Colors.white;
  static const Color gray = Color(0xFFD3D3D3);
  static const Color darkGray = Color(0xFF828282);
  static const Color red = Color(0xFFD26763);
  static const Color black = Colors.black;
  static const Color discordPurple = Color(0xFF7289DA);
  static const Color trelloBlue = Color(0xFF1E88E5);
  static const String primaryFontFamily = 'Montserrat';
  static TextStyle get bodyText1 => GoogleFonts.getFont(
    primaryFontFamily,
    color: white,
    fontWeight: FontWeight.normal,
    fontSize: 14,
  );
  static TextStyle get bodyText2 => GoogleFonts.getFont(
    primaryFontFamily,
    color: white,
    fontWeight: FontWeight.normal,
    fontSize: 12,
  );
  static TextStyle get titleText1 => GoogleFonts.getFont(
    primaryFontFamily,
    color: white,
    fontWeight: FontWeight.bold,
    fontSize: 18,
  );
  static TextStyle get titleText2 => GoogleFonts.getFont(
    primaryFontFamily,
    color: white,
    fontWeight: FontWeight.normal,
    fontSize: 18,
  );
}

extension TextStyleHelper on TextStyle {
  TextStyle override(
      {required String fontFamily,
        Color? color,
        double? fontSize,
        FontWeight? fontWeight,
        FontStyle? fontStyle}) =>

      GoogleFonts.getFont(
        fontFamily,
        color: color ?? this.color,
        fontSize: fontSize ?? this.fontSize,
        fontWeight: fontWeight ?? this.fontWeight,
        fontStyle: fontStyle ?? this.fontStyle,
      );
}
