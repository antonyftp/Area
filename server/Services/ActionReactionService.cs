using System.Text.RegularExpressions;
using Area.Controllers;
using Area.Database;
using Area.Exceptions;
using Area.Models;
using Area.Services.OAuthService;
using Area.Utils;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Area.Services;

public class ActionReactionService
{
    private readonly IMongoCollection<ActionReaction> _actionReactionC;
    private readonly TrelloService _trelloService;
    private readonly ServiceService _serviceService;
    private readonly GithubService _githubService;
    private readonly GoogleService _googleService;
    public ActionReactionService(DatabaseContext databaseContext, TrelloService trelloService, ServiceService serviceService, GithubService githubService, GoogleService googleService)
    {
        _actionReactionC = databaseContext.Database.GetCollection<ActionReaction>("ActionsReactions");
        _trelloService = trelloService;
        _serviceService = serviceService;
        _githubService = githubService;
        _googleService = googleService;
    }

    public List<ActionReaction> GetAll() => _actionReactionC.Find(_ => true).ToList();

    public List<ActionReaction> GetUserActionReaction(string userId) =>
        _actionReactionC.Find(e => e.UserId == userId).ToList();

    public ActionReaction Get(string id) => _actionReactionC.Find(e => e.Id == id).FirstOrDefault();

    public ActionReaction Add(ActionReaction actionReaction)
    {
        if ((actionReaction.ActionService == "Weather" && actionReaction.Action == "WeatherRainy") ||
            (actionReaction.ActionService == "Gmail" && actionReaction.Action == "OnEmail"))
        {
            actionReaction.Data.Add("Value", null);
        }
        _actionReactionC.InsertOne(actionReaction);
        return actionReaction;
    }

    public ActionReaction GetById(string id)
    {
        return _actionReactionC.Find(e =>  e.Id == id).FirstOrDefault();
    }
    
    public ActionReaction FindGithubActReactFromEvent(string event_, string username)
    {
        return _actionReactionC.Find(e =>  e.ActionService == "Github" && e.Data["username"] == username && e.Data["event"] == event_).FirstOrDefault();
    }

    public ActionReaction FindDailymotionActReact(string id, string event_)
    {
        return _actionReactionC.Find(e =>  e.ActionService == "Dailymotion" && e.Data["owner_id"] == id && e.Data["event"] == event_).FirstOrDefault();
    }

    public void Remove(string id)
    {
        _actionReactionC.DeleteOne(e => e.Id == id);
    }
    
    public void Update(UpdateActionReactionToUserBody val, string userId)
    {
        var filter = Builders<ActionReaction>.Filter.Where(e => e.UserId == userId && e.Id == val.ActionReactionId);
        var update = Builders<ActionReaction>.Update.Set(nameof(ActionReaction.Name), val.Name).Set(nameof(ActionReaction.ParamsAction), val.ParamsAction).Set(nameof(ActionReaction.ParamsReaction), val.ParamsReaction).Set(nameof(ActionReaction.Data), val.Data);
        _actionReactionC.UpdateOne(filter, update);
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
                if (actionReaction.Reaction == "SendEmail")
                    _googleService.SendMail(actionReaction);
                break;
            case "Trello":
                if (user.TrelloOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_TRELLO);
                if (actionReaction.Reaction == "CreateBoard")
                    _trelloService.CreateNewBoard(actionReaction.ParamsReaction, user.Id);
                if (actionReaction.Reaction == "CreateList")
                    _trelloService.CreateNewList(actionReaction.ParamsReaction, user.Id);
                if (actionReaction.Reaction == "CreateCard")
                    _trelloService.CreateNewCard(actionReaction.ParamsReaction, user.Id);
                break;
            case "Github":
                if (user.GithubOAuth == null)
                    throw new Exception(Message.NOT_LOGGED_TO_GITHUB);
                if (actionReaction.Reaction == "CreateIssue")
                    _githubService.CreateIssue(actionReaction.ParamsReaction, user.Id);
                if (actionReaction.Reaction == "CreateIPullRequest")
                    _githubService.CreatePullRequest(actionReaction.ParamsReaction, user.Id);
                break;
        }
    }
}