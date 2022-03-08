using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Area.Exceptions;
using Area.Models;
using Area.Services;
using Area.Services.OAuthService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Area.Controllers;

public class BodyLogin
{
    [Required] 
    public string email { get; set; } = string.Empty;

    [Required]
    public string password { get; set; } = string.Empty;
}

public class LoginWithGoogleBody
{
    public string name { get; set; } = String.Empty;
    public string email { get; set; } = String.Empty;
    public string access_token { get; set; } = String.Empty;
}

[ApiController]
[Route("[controller]")]
public class AuthenticationController : Controller
{
    private readonly UserService _userService;
    private readonly ActionReactionService _actionReactionService;
    private readonly GoogleService _googleService;
    private readonly string _jwtKey;

    public AuthenticationController(IConfiguration configuration, UserService userService, ActionReactionService actionReactionService, GoogleService googleService)
    {
        _userService = userService;
        _jwtKey = configuration.GetValue<string>("JwtKey");
        _actionReactionService = actionReactionService;
        _googleService = googleService;
    }
    
    private JwtSecurityToken GetToken(string userId)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var authClaims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
        };
        var token = new JwtSecurityToken(
            expires: DateTime.Now.AddMonths(1),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha512Signature)
        );
        return token;
    }
    
    [HttpPost]
    [Route("login")]
    public ActionResult<User> Login([FromBody] BodyLogin req)
    {
        User? user = _userService.FindUserFromEmail(req.email);
        if (user == null)
            return BadRequest(Message.INVALID_EMAIL_OR_PASSWORD);
        bool isValidPassword = BCrypt.Net.BCrypt.Verify(req.password, user.Password);
        if (!isValidPassword)
            return BadRequest(Message.INVALID_EMAIL_OR_PASSWORD);
        var token = GetToken(user.Id);
        user.ActionsReactions = _actionReactionService.GetUserActionReaction(user.Id);
        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), expiration = token.ValidTo, user });
    }
    
    [HttpPost]
    [Route("register")]
    public ActionResult<User> Register([FromBody] User req)
    {
        if (!new EmailAddressAttribute().IsValid(req.Email) || req.Password.Length < 8)
            return BadRequest(Message.INVALID_EMAIL_OR_PASSWORD);
        req.Password = BCrypt.Net.BCrypt.HashPassword(req.Password);
        req.LoginType = LoginTypeEnum.Email;
        User? created = _userService.Create(req);
        if (created == null)
            return BadRequest(Message.ALREADY_REGISTER);
        return Ok();
    }
    
    [AllowAnonymous]
    [HttpPost]
    [Route("loginWithGoogle")]
    public ActionResult<User> loginWithGoogle([FromBody] LoginWithGoogleBody req)
    {
        if (!new EmailAddressAttribute().IsValid(req.email))
            return BadRequest("Invalid email or password");
        User? user = _userService.FindUserFromEmail(req.email);
        if (user == null) {
            User newUser = new User() {
                Email = req.email,
                Name = req.name,
                LoginType = LoginTypeEnum.Google,
            };
            user = _userService.Create(newUser);
        }
        _userService.AddOAuth(user.Id, OAuthEnum.GoogleOAuth, req.access_token);
        var token = GetToken(user.Id);
        user.ActionsReactions = _actionReactionService.GetUserActionReaction(user.Id);
        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), expiration = token.ValidTo, user });
    }

}