using Area.Exceptions;
using Area.Models;
using Area.Utils;

namespace Area.Services.OAuthService;

public enum OAuthEnum
{
    GithubOAuth = 0,
    GoogleOAuth,
    DiscordOAuth,
    DailymotionOAuth,
    TrelloOAuth,
}

public class OAuthCredentials
{
    public string clientId { get; set; } = String.Empty;
    public string clientSecret { get; set; } = String.Empty;
}

public class OAuthService
{
    private readonly GithubService _githubService;
    private readonly GoogleService _googleService;
    private readonly DiscordService _discordService;
    private readonly DailymotionService _dailymotionService;
    private readonly UserService _userService;

    public OAuthService(GithubService githubService, UserService userService, GoogleService googleService, DiscordService discordService, DailymotionService dailymotionService)
    {
        _githubService = githubService;
        _googleService = googleService;
        _userService = userService;
        _discordService = discordService;
        _dailymotionService = dailymotionService;
    }

    public void SetupActionReaction(ActionReaction actionReaction)
    {
        User? user = _userService.GetCurrentUser();
        switch (actionReaction.ActionService) {
            case "Github":
                GithubOAuth? githubOAuth = user.GithubOAuth;
                if (githubOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_GITHUB);
                _githubService.AddActionReaction(actionReaction);
                break;
            case "Google":
                GoogleOAuth? googleOAuth = user.GoogleOAuth;
                if (googleOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_GOOGLE);
                break;
            case "Gmail":
                GoogleOAuth? googleOAuth_ = user.GoogleOAuth;
                if (googleOAuth_ == null)
                    throw new Exception(Message.NOT_LOGGED_TO_GOOGLE);
                _googleService.AddActionReaction(actionReaction);
                break;
            case "Discord":
                DiscordOAuth? discordOAuth = user.DiscordOAuth;
                if (discordOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_DISCORD);
                _discordService.AddActionReaction(actionReaction);
                break;
            case "Trello":
                TrelloOAuth? trelloOAuth = user.TrelloOAuth;
                if (trelloOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_TRELLO);
                break;
            case "Dailymotion":
                DailymotionOAuth? dailymotionOAuth = user.DailymotionOAuth;
                if (dailymotionOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_DAILYMOTION);
                _dailymotionService.AddActionReaction(actionReaction);
                break;
            case "Weather": break;
            case "Pornhub": break;
            default:
                throw new BadHttpRequestException(actionReaction.ActionService + " doesn't exist");
        }
    }

    public void RemoveActionReaction(ActionReaction actionReaction)
    {
        User? user = _userService.GetCurrentUser();
        switch (actionReaction.ActionService) {
            case "Github":
                GithubOAuth? githubOAuth = user.GithubOAuth;
                if (githubOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_GITHUB);
                _githubService.RemoveActionReaction(user.GithubOAuth.username, actionReaction);
                break;
            case "Google":
                GoogleOAuth? googleOAuth = user.GoogleOAuth;
                if (googleOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_GOOGLE);
                break;
            case "Discord":
                DiscordOAuth? discordOAuth = user.DiscordOAuth;
                if (discordOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_DISCORD);
                break;
            case "Trello":
                TrelloOAuth? trelloOAuth = user.TrelloOAuth;
                if (trelloOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_DISCORD);
                break;
            case "Dailymotion":
                DailymotionOAuth? dailymotionOAuth = user.DailymotionOAuth;
                if (dailymotionOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_DISCORD);
                break;
            default:
                throw new BadHttpRequestException(actionReaction.ActionService + " doesn't exist");
        }
    }
}