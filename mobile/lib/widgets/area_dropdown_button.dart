import 'package:area/constants/area_theme.dart';
import 'package:flutter/material.dart';

class AreaDropdownButton extends StatelessWidget {
  const AreaDropdownButton({
    Key? key,
    required this.items,
    required this.onChanged,
    required this.value
  }) : super(key: key);

  final List<DropdownMenuItem<dynamic>> items;
  final void Function(dynamic) onChanged;
  final String value;

  @override
  Widget build(BuildContext context) {
    return DropdownButton(
      isExpanded: true,
      style: AreaTheme.bodyText1,
      dropdownColor: AreaTheme.richBlack,
      items: items,
      onChanged: onChanged,
      value: value,
    );
  }
}
