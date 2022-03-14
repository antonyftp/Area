using System.Net.Http.Headers;
using System.Security.Claims;
using Area.Exceptions;
using Area.Services;
using Area.Services.OAuthService;
using Area.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HttpContextAccessor = Area.Services.HttpContextAccessor;

namespace Area.Controllers;

public class GetAccessTokenBody
{
    public string code { get; set; }
}

public class GetStoreGoogleAccessTokenBody
{
    public string access_token { get; set; }
}

[Authorize]
[ApiController]
[Route("[controller]")]
public class OAuthController : Controller
{
    private readonly GithubService _githubService;
    private readonly GoogleService _googleService;
    private readonly UserService _userService;
    private readonly DiscordService _discordService;
    private readonly DailymotionService _dailymotionService;
    private readonly TrelloService _trelloService;
    private readonly HttpContextAccessor _httpContextAccessor;

    public OAuthController(GithubService githubService, UserService userService, GoogleService googleService, HttpContextAccessor httpContextAccessor, DiscordService discordService, DailymotionService dailymotionService, TrelloService trelloService)
    {
        _githubService = githubService;
        _googleService = googleService;
        _userService = userService;
        _discordService = discordService;
        _httpContextAccessor = httpContextAccessor;
        _dailymotionService = dailymotionService;
        _trelloService = trelloService;
    }
    
    [HttpGet("getGithubAuthorizeUrl")]
    public ActionResult GetGithubAuthorizeCode()
    {
        return Ok(_githubService.GetAuthorizeCodeUrl());
    }

    [HttpPost("getGithubAccessToken")]
    public async Task<ActionResult> GetGithubAccessToken([FromBody] GetAccessTokenBody body) {
        try {
            string? id = _httpContextAccessor.GetUserIdFromJwt();
            if (id == null)
                return BadRequest(Message.NOT_LOGGED);
            GithubService.GetAccessTokenRes res = await _githubService.GetAccessToken(body.code);
            _userService.AddOAuth(id, OAuthEnum.GithubOAuth, res.access_token);
            _githubService.SetClientCredentials(id);
            _githubService.updateDbProfileData();            
            return Ok();
        } catch (Exception e) {
            return BadRequest(Message.FAILED_TO_LOGIN);
        }
    }
    
    [HttpPost("signOutFromGithub")]
    public ActionResult SignOutFromGithub()
    {
        string? id = _httpContextAccessor.GetUserIdFromJwt();
        if (id == null)
            return BadRequest(Message.NOT_LOGGED);
        _userService.RemoveOAuth(id, OAuthEnum.GithubOAuth);
        return Ok();
    }

    [HttpGet("getDiscordAuthorizeUrl")]
    public ActionResult GetDiscordAuthorizeCode()
    {
        return Ok(_discordService.GetAuthorizeCodeUrl());
    }

    [HttpPost("getDiscordAccessToken")]
    public async Task<ActionResult> GetDiscordAccessToken([FromBody] GetAccessTokenBody body) {
        try {
            string? id = _httpContextAccessor.GetUserIdFromJwt();
            if (id == null)
                return BadRequest(Message.NOT_LOGGED);
            DiscordService.GetAccessTokenRes res = await _discordService.GetAccessToken(body.code);
            _userService.AddOAuth(id, OAuthEnum.DiscordOAuth, res.access_token);
            return Ok();
        } catch (Exception e) {
            return BadRequest(Message.FAILED_TO_LOGIN);
        }
    }

    [HttpPost("signOutFromDiscord")]
    public ActionResult SignOutFromDiscord()
    {
        string? id = _httpContextAccessor.GetUserIdFromJwt();
        if (id == null)
            return BadRequest(Message.NOT_LOGGED);
        _userService.RemoveOAuth(id, OAuthEnum.DiscordOAuth);
        return Ok();
    }

    /*[AllowAnonymous]
    [HttpGet("getGoogleAuthorizeUrl")]
    public ActionResult<string> GetGoogleConnectionUrl()
    {
        return Ok(_googleService.GetAuthorizeCodeUrl());
    }*/
    
    [AllowAnonymous]
    [HttpGet("getGoogleCredentials")]
    public ActionResult<OAuthCredentials> GetGoogleCredentials()
    {
        return Ok(_googleService.GetCredentials());
    }
    
    [HttpPost("storeGoogleAccessToken")]
    public ActionResult GetStoreGoogleAccessToken([FromBody] GetStoreGoogleAccessTokenBody req)
    {
        string? id = _httpContextAccessor.GetUserIdFromJwt();
        if (id == null)
            return BadRequest(Message.NOT_LOGGED);
        _userService.AddOAuth(id, OAuthEnum.GoogleOAuth, req.access_token);
        return Ok();
    }

    [HttpPost("signOutFromGoogle")]
    public ActionResult SignOutFromGoogle()
    {
        string? id = _httpContextAccessor.GetUserIdFromJwt();
        if (id == null)
            return BadRequest(Message.NOT_LOGGED);
        _userService.RemoveOAuth(id, OAuthEnum.GoogleOAuth);
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("getDailymotionAuthorizeUrl")]
    public ActionResult<string> GetDailymotionConnectionUrl()
    {
        return Ok(_dailymotionService.GetAuthorizeCodeUrl());
    }
    

    [HttpPost("getDailymotionAccessToken")]
    public async Task<ActionResult> GetDailymotionAccessToken([FromBody] GetAccessTokenBody body) {
        try {
            string? id = _httpContextAccessor.GetUserIdFromJwt();
            if (id == null)
                return BadRequest(Message.NOT_LOGGED);
            DailymotionService.GetAccessTokenRes res = await _dailymotionService.GetAccessToken(body.code);
            _userService.AddOAuth(id, OAuthEnum.DailymotionOAuth, res.access_token);
            _dailymotionService.SetDailymotionCredentials();
            _dailymotionService.updateDbProfileData();
            return Ok();
        } catch (Exception e) {
            return BadRequest(Message.FAILED_TO_LOGIN);
        }
    }

    [HttpPost("signOutFromDailymotion")]
    public ActionResult SignOutFromDailymotion()
    {
        string? id = _httpContextAccessor.GetUserIdFromJwt();
        if (id == null)
            return BadRequest(Message.NOT_LOGGED);
        _userService.RemoveOAuth(id, OAuthEnum.DailymotionOAuth);
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("getTrelloAuthorizeUrl")]
    public ActionResult<string> GetTrelloConnectionUrl()
    {
        return Ok(_trelloService.GetAuthorizeCodeUrl());
    }
    
    [HttpPost("storeTrelloAccessToken")]
    public ActionResult GetStoreTrelloAccessToken([FromBody] GetAccessTokenBody req)
    {
        string? id = _httpContextAccessor.GetUserIdFromJwt();
        if (id == null)
            return BadRequest(Message.NOT_LOGGED);
        _userService.AddOAuth(id, OAuthEnum.TrelloOAuth, req.code);
        return Ok();
    }
    
    [HttpPost("signOutFromTrello")]
    public ActionResult SignOutFromTrello()
    {
        string? id = _httpContextAccessor.GetUserIdFromJwt();
        if (id == null)
            return BadRequest(Message.NOT_LOGGED);
        _userService.RemoveOAuth(id, OAuthEnum.TrelloOAuth);
        return Ok();
    }
}