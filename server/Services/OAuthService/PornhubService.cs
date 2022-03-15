using System.Net.Http.Headers;
using Area.Controllers;
using Area.Models;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Newtonsoft.Json;

namespace Area.Services.OAuthService;

public class PornhubService
{
    private readonly UserService _userService;
    private readonly ActionReactionService _arService;
    private static HttpClient Client;


    private class StarData
    {
        public string star_name { get; set; }
        public string videos_count_all { get; set; }
    }
    private class Star
    {
        public StarData star { get; set; }
    }

    private class StarList
    {
        public Star[] stars { get; set; }
    }

    public PornhubService(UserService userService, ActionReactionService ar)
    {
        _userService = userService;
        _arService = ar;
        Client = new HttpClient();
        Client.BaseAddress = new Uri("https://www.pornhub.com");
        Client.DefaultRequestHeaders.Clear();
        Client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<bool> GetPornstar(ActionReaction i)
    {
        try
        {
            HttpResponseMessage response = await Client.GetAsync("webmasters/stars_detailed");
            Console.WriteLine(response);
            var result = response.Content.ReadAsAsync<StarList>().Result;
            string Name = i.ParamsAction.GetValueOrDefault("Name");
            var Value = i.Data.GetValueOrDefault("Value");
            UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
            temp.ActionReactionId = i.Id;
            temp.Name = i.Name;
            temp.ParamsAction = i.ParamsAction;
            temp.ParamsReaction = i.ParamsReaction;
            temp.Data = i.Data;
            foreach (var y in result.stars)
            {
                if (y.star.star_name == Name)
                {
                    if (Value == null)
                    {
                        temp.Data.Add("Value", y.star.videos_count_all);
                        _arService.Update(temp, i.UserId);
                        return false;
                    }
                    else
                    {
                        if (Int32.Parse(Value) < Int32.Parse(y.star.videos_count_all))
                        {
                            temp.Data.Remove("Value");
                            temp.Data.Add("Value", y.star.videos_count_all);
                            _arService.Update(temp, i.UserId);
                            return true;
                        }
                    }
                }
            }

        }
        catch (Exception e)
        {
            Console.WriteLine("Something went wrong!" + e);
        }

        return false;
    }
}