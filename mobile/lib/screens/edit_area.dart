import 'dart:convert';
import 'package:area/constants/area_theme.dart';
import 'package:area/controllers/backend.dart';
import 'package:area/screens/home/home.dart';
import 'package:area/utils/AreaDialog.dart';
import 'package:area/widgets/area_input_field.dart';
import 'package:area/widgets/area_raised_button.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class EditArea extends StatefulWidget {
  const EditArea({Key? key}) : super(key: key);

  @override
  _EditAreaState createState() => _EditAreaState();
}

class _EditAreaState extends State<EditArea> {

  final _services = Get.arguments['services'];
  String _name = Get.arguments['name'];
  late final int _actionService;
  late final int _reactionService;
  late final int _action;
  late final int _reaction;
  final bool _isEditing = Get.arguments['isEditing'];
  List<TextEditingController> _reactionParams = [];
  List<TextEditingController> _actionParams = [];
  final TextEditingController _nameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _nameController.text = _name;
    for (int i = 0; i < _services["services"].length; i++) {
      if (_services["services"][i]['name'] == Get.arguments['actionService']) {
        _actionService = i;
        break;
      }
    }
    for (int i = 0; i < _services["services"][_actionService]['actions'].length; i++) {
      if (_services["services"][_actionService]['actions'][i]['name'] == Get.arguments['action']) {
        _action = i;
        break;
      }
    }
    for (int i = 0; i < _services["services"].length; i++) {
      if (_services["services"][i]['name'] == Get.arguments['reactionService']) {
        _reactionService = i;
        break;
      }
    }
    for (int i = 0; i < _services["services"][_reactionService]['reactions'].length; i++) {
      if (_services["services"][_reactionService]['reactions'][i]['name'] == Get.arguments['reaction']) {
        _reaction = i;
        break;
      }
    }
  }

  _delete() async {
    final res = await BackendController.deleteArea(actionReactionId: Get.arguments['id']);
    if (res != null) {
      AreaDialog.show(
          title: "Error",
          message: res
      );
      return;
    }
    Get.arguments["refresh"]();
    Get.to(() => const Home(), transition: Transition.leftToRight);
  }

  _save() async {
    Map<String, dynamic> reactionParams = {};
    Map<String, dynamic> actionParams = {};
    for (int i = 0; i < _reactionParams.length; i++) {
      reactionParams[_services["services"][_reactionService]["reactions"][_reaction]["params"][i]["name"]] = _reactionParams[i].text;
    }
    for (int i = 0; i < _actionParams.length; i++) {
      actionParams[_services["services"][_actionService]["actions"][_action]["params"][i]["name"]] = _actionParams[i].text;
    }
    final res = await BackendController.createArea(
        name: _name,
        actionService: _services["services"][_actionService]["name"],
        action: _services["services"][_actionService]["actions"][_action]["name"],
        reactionService: _services["services"][_reactionService]["name"],
        reaction: _services["services"][_reactionService]["reactions"][_reaction]["name"],
        actionParams: actionParams,
        reactionParams: reactionParams
    );
    if (res != null) {
      AreaDialog.show(
          title: "Error",
          message: res
      );
      return;
    }
    Get.arguments["refresh"]();
    Get.to(() => const Home(), transition: Transition.leftToRight);
  }

  _update() async {
    Map<String, dynamic> reactionParams = {};
    Map<String, dynamic> actionParams = {};
    for (int i = 0; i < _reactionParams.length; i++) {
      reactionParams[_services["services"][_reactionService]["reactions"][_reaction]["params"][i]["name"]] = _reactionParams[i].text;
    }
    for (int i = 0; i < _actionParams.length; i++) {
      actionParams[_services["services"][_actionService]["actions"][_action]["params"][i]["name"]] = _actionParams[i].text;
    }
    final res = await BackendController.updateArea(
        name: _name,
        actionReactionId: Get.arguments['id'],
        actionParams: actionParams,
        reactionParams: reactionParams
    );
    if (res != null) {
      AreaDialog.show(
          title: "Error",
          message: res
      );
      return;
    }
    Get.arguments["refresh"]();
    Get.to(() => const Home(), transition: Transition.leftToRight);
  }

  @override
  Widget build(BuildContext context) {
    if (_reactionParams.isEmpty && _services != null && _services["services"][_reactionService]['reactions'][_reaction]['params'] != null) {
      _reactionParams = _services["services"][_reactionService]['reactions'][_reaction]['params']
          .map<TextEditingController>((variable) => TextEditingController())
          .toList();
      if (_isEditing) {
        for (int i = 0; i < _reactionParams.length; i++) {
          _reactionParams[i].text = Get.arguments['reactionParams'][_services["services"][_reactionService]['reactions'][_reaction]['params'][i]['name']];
        }
      }
    }
    if (_actionParams.isEmpty && _services != null && _services["services"][_actionService]['actions'][_action]['params'] != null) {
      _actionParams = _services["services"][_actionService]['actions'][_action]['params']
          .map<TextEditingController>((variable) => TextEditingController())
          .toList();
      Get.printInfo(info: _services["services"][_actionService]['actions'][_action]['params'].toString());
      if (_isEditing) {
        for (int i = 0; i < _actionParams.length; i++) {
          _actionParams[i].text = Get.arguments['actionParams'][_services["services"][_actionService]['actions'][_action]['params'][i]['name']];
        }
      }
    }
    return WillPopScope(
      onWillPop: () async { return false; },
      child: Scaffold(
        backgroundColor: AreaTheme.richBlackLight,
        appBar: AppBar(
          title: Text(_name),
          backgroundColor: AreaTheme.richBlack,
          automaticallyImplyLeading: false,
          actions: [
            if (_isEditing) IconButton(onPressed: () => Get.dialog(
              Dialog(
                backgroundColor: Colors.transparent,
                child: Stack(
                  clipBehavior: Clip.none, children: [
                  Container(
                    height: 220,
                    width: 320,
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
                            Text("New Area Name", style: AreaTheme.titleText1),
                            AreaInputText(hintText: "Enter the new name of your area", labelText: "New Area name", controller: _nameController),
                            AreaRaisedButton(onPressed: () {
                              setState(() {
                                _name = _nameController.text;
                              });
                              Get.back();
                            }, text: "OK")
                          ]
                      ),
                    ),
                  ),
                  Positioned(
                    top: -50,
                    left: 110,
                    child: Center(child: Image.asset('assets/images/area-logo.png', width: 100, height: 100,)),
                  )
                ],
                ),
              ),
            ),
                icon: const Icon(Icons.edit))
          ],
        ),
        body: Center(
          child: SafeArea(
            child: Column(
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: ListView(
                      children: [
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(top: 20),
                              child: Text("If",
                                  style: AreaTheme.titleText1
                              ),
                            ),
                            if (_services != null) Padding(
                              padding: const EdgeInsets.only(top: 20),
                              child: Text("(${_services["services"][_actionService]['name']})",
                                style: AreaTheme.bodyText2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            if (_services != null) Padding(
                              padding: const EdgeInsets.only(top: 5),
                              child: Text("${_services["services"][_actionService]['actions'][_action]['description']}",
                                style: AreaTheme.bodyText1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.only(top: 20),
                              child: Text("then",
                                  style: AreaTheme.titleText1
                              ),
                            ),
                            if (_services != null) Padding(
                              padding: const EdgeInsets.only(top: 20),
                              child: Text("(${_services["services"][_reactionService]['name']})",
                                style: AreaTheme.bodyText2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            if (_services != null) Padding(
                              padding: const EdgeInsets.only(top: 5),
                              child: Text("${_services["services"][_reactionService]['reactions'][_reaction]['description']}",
                                style: AreaTheme.bodyText1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        if (_services["services"][_actionService]['actions'][_action]['params'] != null && _services["services"][_actionService]['actions'][_action]['params'].length != 0) Padding(
                          padding: const EdgeInsets.only(top: 10.0),
                          child: Text("Action Params", style: AreaTheme.titleText1),
                        ),
                        if (_services != null)
                          for (int i = 0; i < _actionParams.length; i++)
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
                              child: AreaInputText(
                                labelText: _services["services"][_actionService]['actions'][_action]['params'][i]['name'],
                                hintText: _services["services"][_actionService]['actions'][_action]['params'][i]['description'],
                                controller: _actionParams[i],
                              ),
                            ),
                        if (_services["services"][_actionService]['actions'][_action]['variables'] != null && _services["services"][_actionService]['actions'][_action]['variables'].length != 0) Padding(
                          padding: const EdgeInsets.only(top: 10.0),
                          child: Text("Action Variables", style: AreaTheme.titleText1),
                        ),
                        if (_services != null && _services["services"][_actionService]['actions'][_action]['variables'] != null)
                          for (var variable in _services["services"][_actionService]['actions'][_action]['variables'])
                            Padding(
                              padding: const EdgeInsets.only(top: 16, left: 8),
                              child: Row(
                                children: [
                                  Text("\$${variable['name']}:",
                                    style: AreaTheme.bodyText1,
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.only(left: 8),
                                    child: Text("${variable['description']}",
                                      style: AreaTheme.bodyText1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                        if (_services["services"][_reactionService]['reactions'][_reaction]['params'] != null && _services["services"][_reactionService]['reactions'][_reaction]['params'].length != 0) Padding(
                          padding: const EdgeInsets.only(top: 30.0),
                          child: Text("Reaction Params", style: AreaTheme.titleText1),
                        ),
                        if (_services != null)
                          for (int i = 0; i < _reactionParams.length; i++)
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
                              child: AreaInputText(
                                labelText: _services["services"][_reactionService]['reactions'][_reaction]['params'][i]['name'],
                                hintText: _services["services"][_reactionService]['reactions'][_reaction]['params'][i]['description'],
                                controller: _reactionParams[i],
                              ),
                            )
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      AreaRaisedButton(
                        color: AreaTheme.red,
                        onPressed: _isEditing ? () => _delete() : () => Get.back(),
                        text: _isEditing ? 'Delete' : 'Cancel',
                        height: 60,
                        width: 150,
                      ),
                      AreaRaisedButton(
                        onPressed: _isEditing ? () => _update() : () => _save(),
                        text: _isEditing ? 'Update' : 'Confirm',
                        height: 60,
                        width: 150,
                      ),
                    ]
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
