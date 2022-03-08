import 'package:area/constants/area_theme.dart';
import 'package:flutter/material.dart';

class AreaIconButton extends StatelessWidget {

  final VoidCallback onPressed;
  final Widget child;
  final double? height;
  final double? width;
  final Color color;

  const AreaIconButton({
    Key? key,
    required this.onPressed,
    required this.child,
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
        child: child,
        style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            primary: color,
            fixedSize: _width != null && _height != null ? Size(_width, _height):null
        )
    );
  }
}