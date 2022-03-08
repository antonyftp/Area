using Microsoft.AspNetCore.Mvc.TagHelpers;
using Newtonsoft.Json;

namespace Area.Services.OAuthService;

public class PornhubService
{
    private readonly UserService _userService;
    private static HttpClient Client = new HttpClient();


    private class star
    {
        public string star_name { get; set; }
        public string videos_count_all { get; set; }
    }

    private class StarData
    {
        public star[] stars { get; set; } 
    }
    
    public PornhubService(UserService userService)
    {
        _userService = userService;
    }

    public async Task<string?> GetPornstar(string name, string nb_video)
    {
        var response = new HttpResponseMessage();
        using (
            var request = new HttpRequestMessage(HttpMethod.Get, "http://api.weatherapi.com/v1/current.json"))
        {
            response = await Client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();
                var json = JsonConvert.DeserializeObject<StarData>(responseBody);
                foreach (var star in json.stars)
                {
                    if (star.star_name == name)
                    {
                        if (star.videos_count_all == nb_video)
                        {
                            return star.videos_count_all;
                        }
                    }
                }
            }

            return null;
        }
    }
}