using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Area.Services.OAuthService;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Area.Services;
using Area.Services.OAuthService;

namespace Area.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class GoogleController : Controller
    {
        private readonly ActionReactionService _actionReactionService;
        public class mailData
        {
            public string To { get; set; }
            public string Subject { get; set; } = string.Empty;
            public string Body { get; set; } = string.Empty;
        }
        private readonly GoogleService _googleService;

        public GoogleController(GoogleService service, ActionReactionService actionReactionService)
        {
            _googleService = service;
            _actionReactionService = actionReactionService;
        }

        [HttpPost("test")]
        public ActionResult GetNbMail()
        {
            var test = _actionReactionService.GetById("62273fc41b725e8dadd18a57");
            _googleService.SendMail(test);
            return Ok();
        }
    }
}
