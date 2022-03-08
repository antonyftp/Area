using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Area.Exceptions;
using Area.Models;
using Area.Services;
using Area.Services.OAuthService;
using Area.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HttpContextAccessor = Area.Services.HttpContextAccessor;

namespace Area.Controllers;

public class AddActionReactionBody
{
    public string Name { get; set; } = String.Empty;
    public string ActionService { get; set; } = String.Empty;
    public string Action { get; set; } = String.Empty;
    public string ReactionService { get; set; } = String.Empty;
    public string Reaction { get; set; } = String.Empty;
    
    public Dictionary<string, string>? ParamsAction { get; set; } = null;
    
    public Dictionary<string, string>? ParamsReaction { get; set; } = null;
}

public class RemoveActionReactionToUserBody
{
    [Required]
    public string actionReactionId { get; set; }
}

public class UpdateActionReactionToUserBody
{
    public string ActionReactionId { get; set; }
    
    public string Name { get; set; }

    public Dictionary<string, string>? ParamsAction { get; set; } = null;

    public Dictionary<string, string>? ParamsReaction { get; set; } = null;
    public Dictionary<string, string>? Data { get; set; } = null;
}

[Authorize]
[ApiController]
[Route("[controller]")]
public class UserController : Controller
{
    private readonly UserService _userService;
    private readonly ActionReactionService _actionReactionService;
    private readonly OAuthService _oauthService;
    private readonly HttpContextAccessor _httpContextAccessor;

    public UserController(UserService userService, ActionReactionService actionReactionService, OAuthService oauthService, HttpContextAccessor httpContextAccessor)
    {
        _userService = userService;
        _actionReactionService = actionReactionService;
        _oauthService = oauthService;
        _httpContextAccessor = httpContextAccessor;
    }

    [HttpGet("getUsers")]
    public ActionResult<List<User>> GetUsers() {
        return Ok(_userService.GetUsers());
    }

    [HttpGet("getUser")]
    public ActionResult<User> GetUser()
    {
        string? id = _httpContextAccessor.GetUserIdFromJwt();
        if (id == null)
            return BadRequest(Message.NOT_LOGGED);
        var user = _userService.GetUserById(id);
        Debug.WriteClass(user);
        user.ActionsReactions = _actionReactionService.GetUserActionReaction(id);
        return Ok(user);
    }
    
    
    [HttpPost("addActionService")]
    public ActionResult<ActionReaction> AddActionReactionToUser([FromBody] AddActionReactionBody req) {
        try {
            string? id = _httpContextAccessor.GetUserIdFromJwt();
            if (id == null)
                return BadRequest(Message.NOT_LOGGED);
            List<ActionReaction> actionsReaction = _actionReactionService.GetUserActionReaction(id);
            bool alreadyExist = actionsReaction.Find(e => e.Name == req.Name) != null;
            if (alreadyExist)
                return BadRequest("A service with this name already exist");
            var actionReaction = new ActionReaction() {
                Action = req.Action,
                Name = req.Name,
                ParamsAction = req.ParamsAction,
                ParamsReaction = req.ParamsReaction,
                Reaction = req.Reaction,
                ActionService = req.ActionService,
                ReactionService = req.ReactionService,
                UserId = id
            };
            _oauthService.SetupActionReaction(actionReaction);
            ActionReaction res = _actionReactionService.Add(actionReaction);
            return Ok(res);
        } catch (Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("removeActionService")]
    public ActionResult RemoveActionReactionToUser([FromBody] RemoveActionReactionToUserBody req)
    {
        try {
            string? id = _httpContextAccessor.GetUserIdFromJwt();
            if (id == null)
                return BadRequest(Message.NOT_LOGGED);
            ActionReaction actionReaction = _actionReactionService.Get(req.actionReactionId);
            _oauthService.RemoveActionReaction(actionReaction);
            _actionReactionService.Remove(req.actionReactionId);
            return Ok();
        } catch (Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest(e.Message);
        }
    }

    [HttpPost("updateActionService")]
    public ActionResult UpdateActionReactionToUser([FromBody] UpdateActionReactionToUserBody req)
    {
        try {
            string? id = _httpContextAccessor.GetUserIdFromJwt();
            if (id == null)
                return BadRequest(Message.NOT_LOGGED);
            _actionReactionService.Update(req, id);
            return Ok();
        } catch (Exception e) {
            Console.WriteLine(e.Message);
            return BadRequest(e.Message);
        }
    }
}