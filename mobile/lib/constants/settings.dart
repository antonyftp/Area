class Settings {
  static const String backendEndpoint = String.fromEnvironment('BASE_URL', defaultValue: 'http://localhost:8080');
  static const String signinRoute = "Authentication/login";
  static const String signupRoute = "Authentication/register";
  static const String aboutRoute = "about.json";
  static const String createAreaRoute = "User/addActionService";
  static const String updateAreaRoute = "User/updateActionService";
  static const String deleteAreaRoute = "User/removeActionService";
  static const String getUserRoute = "User/getUser";
  static const String githubCodeRoute = "OAuth/getGithubAccessToken";
  static const String discordCodeRoute = "OAuth/getDiscordAccessToken";
  static const String gitHubUrlRoute = "OAuth/getGithubAuthorizeUrl";
  static const String githubClientId = "185877dc9c614b0a14b8";
  static const String discordAuthUrl = "OAuth/getDiscordAuthorizeUrl";
  static const String githubCallback = "http://localhost:8081/OAuth/callback/github";
  static const String googleClientIdRoute = "OAuth/getGoogleCredentials";
  static const String googleCallback = "http://localhost:8081/oauth/callback/google";
  static const String signInGoogleRoute = "Authentication/loginWithGoogle";
  static const String googleCodeRoute = "OAuth/storeGoogleAccessToken";
  static const String unlinkGithubRoute = "User/unlinkGithub";
  static const String unlinkDiscordRoute = "User/unlinkDiscord";
  static const String unlinkGoogleRoute = "User/unlinkGoogle";
  static const String getTrelloUrlRoute = "OAuth/getTrelloAuthorizeUrl";
  static const String postTrelloUrlRoute = "OAuth/storeTrelloAccessToken";
  static const String getDaylimotionRoute = "OAuth/getDailymotionAuthorizeUrl";
  static const String postDaylimotonCode= "OAuth/getDailymotionAccessToken";
  static const String trelloCallBack = "http://localhost:8081/oauth/callback/trello";
  static const String daylimotionCallback = "http://localhost:8081/oauth/callback/dailymotion";
}