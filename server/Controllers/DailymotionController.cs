using Area.Services;
using Area.Services.OAuthService;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Area.Controllers;

[ApiController]
[Route("[controller]")]
public class DailymotionController : Controller
{
    private readonly DailymotionService _dailymotionService;
    private readonly ActionReactionService _actionReactionService;
    private readonly ReactionService _reactionService;
    private readonly UserService _userService;

    public DailymotionController(DailymotionService dailymotionService, ActionReactionService actionReactionService, UserService userService, ReactionService reaction)
    {
        _dailymotionService = dailymotionService;
        _actionReactionService = actionReactionService;
        _userService = userService;
        _reactionService = reaction;
    }

    [HttpPost("video.published")]
    public async Task<ActionResult> VideoPublished()
    {
        Console.WriteLine("video.published");
        using (var reader = new StreamReader(Request.Body))
        {
            var txt = await reader.ReadToEndAsync();
            JObject json = JObject.Parse(txt);
            var actionReaction = _actionReactionService.FindDailymotionActReact("video.published", (string)json["data"]["owner_id"]);
            var user = _userService.GetUserById(actionReaction.UserId);
            _reactionService.ReactionFromAction(user, actionReaction);
        }
        return Ok();
    }
    
    [HttpPost("video.created")]
    public async Task<ActionResult> VideoCreated()
    {
        Console.WriteLine("video.created");
        using (var reader = new StreamReader(Request.Body))
        {
            var txt = await reader.ReadToEndAsync();
            JObject json = JObject.Parse(txt);
            var actionReaction = _actionReactionService.FindDailymotionActReact("video.created", (string)json["data"]["owner_id"]);
            var user = _userService.GetUserById(actionReaction.UserId);
            _reactionService.ReactionFromAction(user, actionReaction);
        }
        return Ok();
    }

    [HttpPost("video.deleted")]
    public async Task<ActionResult> VideoDeleted()
    {
        Console.WriteLine("video.deleted");
        using (var reader = new StreamReader(Request.Body))
        {
            var txt = await reader.ReadToEndAsync();
            JObject json = JObject.Parse(txt);
            var actionReaction = _actionReactionService.FindDailymotionActReact("video.deleted", (string)json["data"]["owner_id"]);
            var user = _userService.GetUserById(actionReaction.UserId);
            _reactionService.ReactionFromAction(user, actionReaction);
        }
        return Ok();
    }

    [HttpPost("video.format.ready")]
    public async Task<ActionResult> VideoFormatReady()
    {
        Console.WriteLine("video.format.ready");
        using (var reader = new StreamReader(Request.Body))
        {
            var txt = await reader.ReadToEndAsync();
            JObject json = JObject.Parse(txt);
            var actionReaction = _actionReactionService.FindDailymotionActReact("video.format.ready", (string)json["data"]["owner_id"]);
            var user = _userService.GetUserById(actionReaction.UserId);
            _reactionService.ReactionFromAction(user, actionReaction);
        }
        return Ok();
    }
}