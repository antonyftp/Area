using Area.Exceptions;
using Area.Models;
using Area.Services;
using Area.Services.OAuthService;
using Area.Utils;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.WebHooks;
using HttpContextAccessor = Area.Services.HttpContextAccessor;

namespace Area.Controllers;

[ApiController]
[Route("[controller]")]
public class GithubController : Controller
{
    private readonly UserService _userService;
    private readonly ActionReactionService _actionReactionService;
    private readonly GithubService _githubService;
    private readonly ReactionService _reactionService;
    private readonly HttpContextAccessor _httpContextAccessor;
    public GithubController(UserService userService, ActionReactionService actionReactionService, GithubService githubService, HttpContextAccessor httpContextAccessor, ReactionService reaction)
    {
        _userService = userService;
        _actionReactionService = actionReactionService;
        _githubService = githubService;
        _httpContextAccessor = httpContextAccessor;
        _reactionService = reaction;
    }

    [HttpPost("test")]
    public ActionResult Test()
    {
        string? id = _httpContextAccessor.GetUserIdFromJwt();
        if (id == null)
            return BadRequest(Message.NOT_LOGGED);
        Console.WriteLine("testrrrr");
        return Ok();
    }
    
    [HttpPost("push")]
    public async Task<ActionResult> Push()
    {
        using (var reader = new StreamReader(Request.Body))
        {
            var txt = await reader.ReadToEndAsync();
            JObject json = JObject.Parse(txt);
            if (!json.ContainsKey("commits"))
                return Ok();
            var variables = new Dictionary<string, string>() {
                {"Author", (string) json["commits"][0]["author"]["name"]},
                {"Commit", (string) json["commits"][0]["message"]}
            };
            var actionReaction = _actionReactionService.FindGithubActReactFromEvent("push", json["repository"]["owner"]["login"].Value<string>());
            var user = _userService.GetUserById(actionReaction.UserId);
            _reactionService.ReactionFromAction(user, actionReaction, variables);
        }
        return Ok();
    }
    
    [HttpPost("pull_request")]
    public async Task<ActionResult> PullRequest()
    {
        using (var reader = new StreamReader(Request.Body))
        {
            Console.WriteLine("pull_request");
            var txt = await reader.ReadToEndAsync();
            JObject json = JObject.Parse(txt);
            var actionReaction = _actionReactionService.FindGithubActReactFromEvent("pull_request", json["pull_request"]["user"]["login"].Value<string>());
            var user = _userService.GetUserById(actionReaction.UserId);
            _reactionService.ReactionFromAction(user, actionReaction);
        }
        return Ok();
    }
    
    [HttpPost("workflow_run")]
    public async Task<ActionResult> WorkflowRun()
    {
        using (var reader = new StreamReader(Request.Body))
        {
            var txt = await reader.ReadToEndAsync();
            JObject json = JObject.Parse(txt);
            var actionReaction = _actionReactionService.FindGithubActReactFromEvent("workflow_run", json["workflow_run"]["triggering_actor"]["login"].Value<string>());
            var user = _userService.GetUserById(actionReaction.UserId);
            _reactionService.ReactionFromAction(user, actionReaction);
        }
        return Ok();
    }
}