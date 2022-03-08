using System.Net.Http.Headers;
using Area.Database;
using Area.Models;
using Microsoft.Extensions.Options;
using Octokit;
using User = Area.Models.User;

namespace Area.Services.OAuthService;

public class DiscordService
{
    private readonly OAuthSettings _discordCredentials;
    private readonly UserService _userService;
    private readonly WebhooksSettings _webhooksSettings;

    public DiscordService(IOptionsMonitor<OAuthSettings> oauthSettings, UserService userService, IOptions<WebhooksSettings> webhooksSettings)
    {
        _discordCredentials = oauthSettings.Get(OAuthSettings.Discord);
        _userService = userService;
        _webhooksSettings = webhooksSettings.Value;
    }

    public string GetAuthorizeCodeUrl()
    {
        string redirectUrl = "http://localhost:8081/OAuth/callback/discord";
        string scopes = "messages.read%20webhook.incoming%20email%20identify";
        string state = "15773059ghq9183habn";
        return $"https://discord.com/api/oauth2/authorize?response_type=code&client_id={_discordCredentials.ClientId}&scope={scopes}&state={state}&redirect_uri={redirectUrl}&prompt=consent";
    }

    public class GetAccessTokenRes
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public string scope { get; set; }
    }

    public async Task<GetAccessTokenRes> GetAccessToken(string code)
    {
        HttpClient httpClient = new HttpClient();
        httpClient.BaseAddress = new Uri("https://discord.com/api/v8");
        httpClient.DefaultRequestHeaders.Accept.Clear();
        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        HttpResponseMessage response = await httpClient.PostAsJsonAsync("/oauth2/token", new {
            client_id = _discordCredentials.ClientId,
            client_secret = _discordCredentials.ClientSecret,
            grant_type = "authorization_code",
            code = code
        });
        return await response.Content.ReadAsAsync<GetAccessTokenRes>();
    }
    
    private void CreateWebhooks(ActionReaction actionReaction)
    {
        
    }
    
    public void AddActionReaction(ActionReaction actionReaction)
    {
        if (actionReaction.ParamsAction == null)
            throw new BadHttpRequestException("invalid parameters");
        switch (actionReaction.Action) {
            // case "OnPush": CreateWebhooks(repository, "push", actionReaction); break;
        }
    }

    public void RemoveActionReaction(ActionReaction actionReaction)
    {
    }
}
