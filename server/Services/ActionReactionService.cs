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
    public ActionReactionService(DatabaseContext databaseContext)
    {
        _actionReactionC = databaseContext.Database.GetCollection<ActionReaction>("ActionsReactions");
    }

    public List<ActionReaction> GetAll() => _actionReactionC.Find(_ => true).ToList();

    public List<ActionReaction> GetUserActionReaction(string userId) =>
        _actionReactionC.Find(e => e.UserId == userId).ToList();

    public ActionReaction Get(string id) => _actionReactionC.Find(e => e.Id == id).FirstOrDefault();

    public ActionReaction Add(ActionReaction actionReaction)
    {
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
}