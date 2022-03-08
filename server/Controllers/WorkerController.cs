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
        private ActionReactionService _actionReactionService;
        
        public WorkerController(UserService userService, ActionReactionService arService, WeatherService weather,
            GoogleService google, GithubService github, TrelloService trello, PornhubService pornhub, ActionReactionService actionReactionService)
        {
            _userService = userService;
            _arService = arService;
            _weatherService = weather;
            _googleService = google;
            _githubService = github;
            _trelloService = trello;
            _pornhubService = pornhub;
            _actionReactionService = actionReactionService;
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
                            Dictionary<string, string> map = new Dictionary<string, string>(i.ParamsAction);
                            WeatherService.WeatherDataGet data = new WeatherService.WeatherDataGet();
                            data.q = map.GetValueOrDefault("City");
                            data.value = map.GetValueOrDefault("Value");
                            switch (i.Action)
                            {
                                case "TemperatureBelowValue":
                                    if (_weatherService.getTemp(data) == true)
                                        _actionReactionService.ReactionFromAction(user, i);
                                    break;
                                case "AirQualityBelowValue":
                                    if (_weatherService.geto2(data) == true)
                                        _actionReactionService.ReactionFromAction(user, i);
                                    break;
                                case "UVIndexBelowValue":
                                    if (_weatherService.getUV(data) == true)
                                        _actionReactionService.ReactionFromAction(user, i);
                                    break;
                                case "CloudCoverBelowValue":
                                    if (_weatherService.getCloud(data) == true)
                                        _actionReactionService.ReactionFromAction(user, i);
                                    break;
                                case "WindSpeedBelowValue":
                                    if (_weatherService.getWind(data) == true)
                                        _actionReactionService.ReactionFromAction(user, i);
                                    break;
                                case "RainPercentageBelowValue":
                                    if (_weatherService.getPrecip(data) == true)
                                        _actionReactionService.ReactionFromAction(user, i);
                                        break;
                                case "WeatherRainy":
                                    string? str = i.Data?.GetValueOrDefault("Value");
                                    if ((str = _weatherService.getcondition(data, str)) != null)
                                    {
                                        UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
                                        temp.ActionReactionId = i.Id;
                                        temp.Name = i.Name;
                                        temp.ParamsAction = i.ParamsAction;
                                        temp.ParamsReaction = i.ParamsReaction;
                                        temp.Data = i.Data;
                                        temp.Data?.Remove("Value");
                                        temp.Data?.Add("Value", str);
                                        _arService.Update(temp, user.Id);
                                        _actionReactionService.ReactionFromAction(user, i);
                                    }

                                    break;
                                default:
                                    break;
                            }

                            break;
                        case "Gmail":
                            switch (i.Action)
                            {
                                case "OnEmail":
                                    string? str = i.Data?.GetValueOrDefault("Value");
                                    string? access = user?.GoogleOAuth?.accessToken;
                                    if ((str = _googleService.GetMailList(access, str).Result) != null)
                                    {
                                        UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
                                        temp.ActionReactionId = i.Id;
                                        temp.Name = i.Name;
                                        temp.ParamsAction = i.ParamsAction;
                                        temp.ParamsReaction = i.ParamsReaction;
                                        temp.Data = i.Data;
                                        temp.Data?.Remove("Value");
                                        temp.Data?.Add("Value", str);
                                        _arService.Update(temp, user.Id);
                                        _actionReactionService.ReactionFromAction(user, i);
                                    }

                                    break;
                            }

                            break;
                        case "Pornhub":
                            switch (i.Action) {
                                default:
                                    string? mystr = i.Data?.GetValueOrDefault("Value");
                                    var str = _pornhubService
                                        .GetPornstar(mystr, i.ParamsAction.GetValueOrDefault("Name"))
                                        .Result;
                                    if (str != null)
                                    {
                                        UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
                                        temp.ActionReactionId = i.Id;
                                        temp.Name = i.Name;
                                        temp.ParamsAction = i.ParamsAction;
                                        temp.ParamsReaction = i.ParamsReaction;
                                        temp.Data = i.Data;
                                        temp.Data?.Remove("Value");
                                        temp.Data?.Add("Value", str);
                                        _arService.Update(temp, user.Id);
                                        _actionReactionService.ReactionFromAction(user, i);
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