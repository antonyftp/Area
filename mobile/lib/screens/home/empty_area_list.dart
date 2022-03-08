import 'package:area/constants/area_theme.dart';
import 'package:flutter/material.dart';

class EmptyAreaList extends StatelessWidget {
  const EmptyAreaList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text('No areas yet', style: AreaTheme.bodyText1,),
        const SizedBox(width: double.infinity,height: 16),
        Text('Add an area to get started', style: AreaTheme.bodyText1,),
        const SizedBox(width: double.infinity,height: 30),
        Image.asset('assets/images/arrow.png',height: 180,),
      ],
    );
  }
}
