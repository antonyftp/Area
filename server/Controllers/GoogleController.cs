using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Area.Services.OAuthService;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Area.Services;
using Area.Services.OAuthService;
using Area.Utils;

namespace Area.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class GoogleController : Controller
    {
        private readonly ActionReactionService _actionReactionService;
        private readonly UserService _userService;
        private readonly GoogleService _googleService;
        
        public GoogleController(GoogleService service, ActionReactionService actionReactionService, UserService userService)
        {
            _userService = userService;
            _googleService = service;
            _actionReactionService = actionReactionService;
        }

        [HttpPost("test")]
        public ActionResult GetNbMail()
        {
            var test = _actionReactionService.GetById("622d0e3a731e9cf70dacc340");
            _googleService.SetClientCredentials(test.UserId);
            var user = _userService.GetUserById(test.UserId);
            _googleService.SendMail(test, user);
            //var value = test.ParamsAction?.GetValueOrDefault("Value");
            //string? result = _googleService.GetMailList(user, value).Result;
            //Console.WriteLine(result ?? "null");
            return Ok();
        }
    }
}
