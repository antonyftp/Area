using System.Text.RegularExpressions;
using Area.Exceptions;
using Area.Models;

namespace Area.Services.OAuthService;

public class ReactionService
{
    private readonly ServiceService _serviceService;
    private readonly GoogleService _googleService;
    private readonly TrelloService _trelloService;
    private readonly GithubService _githubService;

    public ReactionService(ServiceService serv, GoogleService google, TrelloService trello, GithubService github)
    {
        _serviceService = serv;
        _googleService = google;
        _trelloService = trello;
        _githubService = github;
    }
    
    public void ReactionFromAction(User user, ActionReaction actionReaction, Dictionary<string, string>? variables = null)
    {
        var action = _serviceService.GetAction(actionReaction.ActionService, actionReaction.Action);
        if (variables != null && action.Variables != null) {
            var list = new Dictionary<string, string>();
            foreach (var paramsReaction in actionReaction.ParamsReaction) {
                string newVal = paramsReaction.Value;
                foreach (var variable in action.Variables) {
                    var regex = new Regex("{" + variable.Name + "}");
                    newVal = regex.Replace(newVal, variables[variable.Name]);
                }
                list[paramsReaction.Key] = newVal;
            }
            actionReaction.ParamsReaction = list;
        }
        switch (actionReaction.ReactionService) {
            case "Gmail":
                if (user.GoogleOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_GOOGLE);
                _googleService.SetClientCredentials(user);
                if (actionReaction.Reaction == "SendEmail")
                    _googleService.SendMail(actionReaction, user);
                break;
            case "Trello":
                if (user.TrelloOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_TRELLO);
                if (actionReaction.Reaction == "CreateBoard")
                    _trelloService.CreateNewBoard(actionReaction.ParamsReaction, user);
                if (actionReaction.Reaction == "CreateList")
                    _trelloService.CreateNewList(actionReaction.ParamsReaction, user);
                if (actionReaction.Reaction == "CreateCard")
                    _trelloService.CreateNewCard(actionReaction.ParamsReaction, user);
                break;
            case "Github":
                if (user.GithubOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_GITHUB);
                _githubService.SetClientCredentials(user);
                if (actionReaction.Reaction == "CreateIssue")
                    _githubService.CreateIssue(actionReaction.ParamsReaction, user);
                if (actionReaction.Reaction == "CreateIPullRequest")
                    _githubService.CreatePullRequest(actionReaction.ParamsReaction, user);
                break;
        }
    }
}