import 'dart:io';
import 'package:area/utils/area_dialog.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:webview_flutter/webview_flutter.dart';

class OAuthLink extends StatefulWidget {
  const OAuthLink({Key? key}) : super(key: key);

  @override
  State<OAuthLink> createState() => _OAuthLinkState();
}

class _OAuthLinkState extends State<OAuthLink> {

  final String _serviceName = Get.arguments["serviceName"];
  final String _serviceUrl = Get.arguments["serviceUrl"];
  final Color _serviceColor = Get.arguments["serviceColor"];
  final String _serviceCallbackUrl = Get.arguments["serviceCallbackUrl"];

  @override
  void initState() {
    super.initState();
    if (Platform.isAndroid) {
      WebView.platform = SurfaceAndroidWebView();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('$_serviceName Link'),
        backgroundColor: _serviceColor,
      ),
      body: WebView(
        initialUrl: _serviceUrl,
        javascriptMode: JavascriptMode.unrestricted,
        navigationDelegate: (NavigationRequest request) async {
          if (request.url.startsWith(_serviceCallbackUrl)) {
            final Uri uri = Uri.parse(request.url);
            Get.printInfo(info: uri.toString());
            late final String code;
            if (_serviceName == "Trello") {
              code = uri.toString().split("token=")[1];
            } else {
              code = uri.queryParameters['code'] ?? "";
            }
            Get.printInfo(info: "Callback: ${request.url}");
            Get.printInfo(info: "$_serviceName code: $code");
            final res = await Get.arguments["backendFunction"](code);
            Get.arguments["updateServices"]();
            Get.back();
            if (res != null) {
              AreaDialog.show(title: "Error", message: "Oops ! Something went wrong when getting $_serviceName token. Please try again.");
            } else {
              AreaDialog.show(title: "Success", message: "Successfully linked $_serviceName account.");
            }
            return NavigationDecision.prevent;
          }
          return NavigationDecision.navigate;
        },
      )
    );
  }
}
