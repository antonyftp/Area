using Area.Models;
using Area.Services;
using Area.Services.OAuthService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Action = Area.Models.Action;

namespace Area.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WorkerController : Controller
    {
        private readonly UserService _userService;
        private readonly ActionReactionService _arService;
        private readonly WeatherService _weatherService;
        private readonly GoogleService _googleService;
        private readonly GithubService _githubService;
        private readonly TrelloService _trelloService;
        private readonly PornhubService _pornhubService;
        //private ActionReactionService _actionReactionService;
        private readonly ReactionService _reactionService;
        
        public WorkerController(UserService userService, ActionReactionService arService, WeatherService weather,
            GoogleService google, GithubService github, TrelloService trello, PornhubService pornhub, ActionReactionService actionReactionService, ReactionService reaction)
        {
            _userService = userService;
            _arService = arService;
            _weatherService = weather;
            _googleService = google;
            _githubService = github;
            _trelloService = trello;
            _pornhubService = pornhub;
            _reactionService = reaction;
            //_actionReactionService = actionReactionService;
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult DoWork()
        {
            Console.WriteLine("-----------------DoWork-------------------");
            var users = _userService.GetUsers();
            foreach (var user in users) {
                List<ActionReaction> my = _arService.GetUserActionReaction(user.Id);
                foreach (var i in my) {
                    switch (i.ActionService) {
                        case "Weather":
                            Dictionary<string, string>? parameters = i.ParamsAction;
                            if (parameters == null)
                                break;
                            WeatherService.WeatherDataGet data = new WeatherService.WeatherDataGet();
                            data.q = parameters.GetValueOrDefault("City");
                            data.value = parameters.GetValueOrDefault("Value");
                            switch (i.Action) {
                                case "TemperatureBelowValue":
                                    var used = i.Data?.GetValueOrDefault("last");
                                    if (_weatherService.GetTemp(data, i))
                                        _reactionService.ReactionFromAction(user, i);
                                    break;
                                case "AirQualityBelowValue":
                                    if (_weatherService.GetO2(data, i))
                                        _reactionService.ReactionFromAction(user, i);
                                    break;
                                case "CloudCoverBelowValue":
                                    if (_weatherService.GetCloud(data, i))
                                        _reactionService.ReactionFromAction(user, i);
                                    break;
                                case "WindSpeedBelowValue":
                                    if (_weatherService.GetWind(data, i))
                                        _reactionService.ReactionFromAction(user, i);
                                    break;
                                case "RainPercentageBelowValue":
                                    if (_weatherService.GetPrecip(data, i))
                                        _reactionService.ReactionFromAction(user, i);
                                    break;
                                case "WeatherRainy":
                                    if (_weatherService.GetCondition(data, i))
                                    {
                                        _reactionService.ReactionFromAction(user, i);
                                    }

                                    break;
                            }

                            break;
                        case "Gmail":
                            _googleService.SetClientCredentials(user);
                            switch (i.Action) {
                                case "OnEmail":
                                    if (_googleService.GetMailList(i).Result)
                                    {
                                        _reactionService.ReactionFromAction(user, i);
                                    }
                                    break;
                            }
                            break;
                        case "Pornhub":
                            switch (i.Action) {
                                default:
                                    if (_pornhubService
                                        .GetPornstar(i)
                                        .Result)
                                    {
                                        _reactionService.ReactionFromAction(user, i);
                                    }
                                    break;
                            }
                            break;
                    }
                }
            }

            return Ok();
        }

    }
}