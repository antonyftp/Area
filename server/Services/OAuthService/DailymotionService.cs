using System.Net.Http.Headers;
using Area.Database;
using Area.Models;
using Area.Utils;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Octokit;
using User = Area.Models.User;

namespace Area.Services.OAuthService;

public class DailymotionService
{
    private readonly OAuthSettings _dailymotionCredentials;
    private readonly UserService _userService;
    private readonly WebhooksSettings _webhooksSettings;
    private readonly HttpClient _httpClient;
    
    public void SetDailymotionCredentials() 
    {
        User? user = _userService.GetCurrentUser(true);
        if (user != null) {
            OAuth? oauth = user.DailymotionOAuth;
            if (oauth != null) {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauth.accessToken);            }
        }
    }
    
    public DailymotionService(IOptionsMonitor<OAuthSettings> oauthSettings, UserService userService, IOptions<WebhooksSettings> webhooksSettings)
    {
        _dailymotionCredentials = oauthSettings.Get(OAuthSettings.Dailymotion);
        _userService = userService;
        _webhooksSettings = webhooksSettings.Value;
        _httpClient = new HttpClient();
        _httpClient.BaseAddress = new Uri($"https://api.dailymotion.com/");
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        SetDailymotionCredentials();
    }

    public string GetAuthorizeCodeUrl()
    {
        string redirectUrl = "http://localhost:8081/oauth/callback/dailymotion";
        string scopes = "userinfo+manage_videos";
        return $"https://www.dailymotion.com/oauth/authorize?response_type=code&client_id={_dailymotionCredentials.ClientId}&scope={scopes}&redirect_uri={redirectUrl}&prompt=consent";
    }

    public class GetAccessTokenRes
    {
        public string access_token { get; set; }
        public string expires_in { get; set; }
        public string refresh_token { get; set; }
    }
    
    public async Task<GetAccessTokenRes> GetAccessToken(string code)
    {
        HttpClient httpClient = new HttpClient();
        httpClient.BaseAddress = new Uri("https://api.dailymotion.com/");
        httpClient.DefaultRequestHeaders.Accept.Clear();
        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));
        var data = new[]
        {
            new KeyValuePair<string, string>("client_id", _dailymotionCredentials.ClientId),
            new KeyValuePair<string, string>("client_secret", _dailymotionCredentials.ClientSecret),
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
            new KeyValuePair<string, string>("redirect_uri", "http://localhost:8081/oauth/callback/dailymotion"),
            new KeyValuePair<string, string>("code", code),
        };
        HttpResponseMessage response = await httpClient.PostAsync("oauth/token", new FormUrlEncodedContent(data));
        return await response.Content.ReadAsAsync<GetAccessTokenRes>();
    }
    
    public async void updateDbProfileData()
    {
        var res = await _httpClient.GetAsync("auth");
        var jsonString = await res.Content.ReadAsStringAsync();
        JObject user = JObject.Parse(jsonString);
        _userService.SetDailymotionOAuthData((string)user["id"]);
    }
    
    private async Task CreateWebhooks(string event_, ActionReaction actionReaction)
    {
        try {
            User user = _userService.GetCurrentUser()!;
            Console.WriteLine(user.DailymotionOAuth.id);
            actionReaction.Data.Add("owner_id", user.DailymotionOAuth.id);
            actionReaction.Data.Add("event", event_);
            Console.WriteLine($"{_webhooksSettings.ServerBaseUrl}Dailymotion/{event_}");
            var res = await _httpClient.PostAsJsonAsync("/me", new {
                webhook_url = $"{_webhooksSettings.ServerBaseUrl}Dailymotion/{event_}",
                webhook_events = event_,
                fields = "id,screenname,webhook_url,webhook_events"
            });
            Debug.WriteJson(res);
        } catch (Octokit.ApiValidationException e) {
            throw new Exception("Failed to create webhooks");
        }        
    }
    
    public void AddActionReaction(ActionReaction actionReaction)
    {
        if (false)
            throw new BadHttpRequestException("invalid parameters");
        switch (actionReaction.Action) {
            case "VideoPublished": CreateWebhooks("video.published", actionReaction).Wait(); break;
            case "VideoCreated": CreateWebhooks("video.created", actionReaction).Wait(); break;
            case "VideoDeleted": CreateWebhooks("video.deleted", actionReaction).Wait(); break;
            case "VideoReady": CreateWebhooks("video.format.ready", actionReaction).Wait(); break;
        }
    }

    public void RemoveActionReaction(ActionReaction actionReaction)
    {
    }
}
