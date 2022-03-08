using System.Net.Http.Headers;
using Area.Database;
using Area.Models;
using Area.Utils;
using Microsoft.Extensions.Options;
using User = Area.Models.User;

namespace Area.Services.OAuthService;

public class TrelloService
{
    private readonly OAuthSettings _trelloCredentials;
    private readonly UserService _userService;
    private readonly WebhooksSettings _webhooksSettings;
    private readonly HttpClient _httpClient;
    
    public TrelloService(IOptionsMonitor<OAuthSettings> oauthSettings, UserService userService, IOptions<WebhooksSettings> webhooksSettings)
    {
        _trelloCredentials = oauthSettings.Get(OAuthSettings.Trello);
        _userService = userService;
        _webhooksSettings = webhooksSettings.Value;
        _httpClient = new HttpClient();
        _httpClient.BaseAddress = new Uri($"https://api.trello.com/1/");
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public string GetAuthorizeCodeUrl()
    {
        string redirectUrl = "http://localhost:8081/oauth/callback/trello";
        string callbackMethod = "fragment";
        string scopes = "read,write,account";
        string expiration = "30days";
        string name = "AreaEpitech";
        return $"https://trello.com/1/authorize?expiration={expiration}&name={name}&scope={scopes}&response_type=token&key={_trelloCredentials.ClientId}&return_url={redirectUrl}&callback_method={callbackMethod}";
    }
    
    private async void CreateWebhooks(string callbackUrl, string modelId, string description, ActionReaction actionReaction)
    {
        User user = _userService.GetCurrentUser()!;
        HttpResponseMessage response = await _httpClient.PostAsJsonAsync($"tokens/{user.TrelloOAuth.accessToken}/webhooks/?key{_trelloCredentials.ClientId}", new {
            callbackURL = _webhooksSettings.ServerBaseUrl + callbackUrl,
            idModel = modelId,
            description = description
        });
        // actionReaction.Data.Add("hookId", res.Id.ToString());
    }

    public async void CreateNewBoard(Dictionary<string, string> parameters, string id)
    {
        string name = parameters["Name"];
        User? user = _userService.GetUserById(id);
        var res = await _httpClient.PostAsJsonAsync($"/1/boards?name={name}&key={_trelloCredentials.ClientId}&token={user.TrelloOAuth.accessToken}", new {
        });
    }

    public async void CreateNewList(Dictionary<string, string> parameters, string id)
    {
        string boardId = parameters["BoardId"];
        string name = parameters["Name"];
        Console.WriteLine(boardId, name);
        User? user = _userService.GetUserById(id);
        var res = await _httpClient.PostAsJsonAsync($"/1/lists?idBoard={boardId}&name={name}&key={_trelloCredentials.ClientId}&token={user.TrelloOAuth.accessToken}", new {
        });
    }

    public async void CreateNewCard(Dictionary<string, string> parameters, string id)
    {
        string boardId = parameters["ListId"];
        string name = parameters["Name"];
        string desc = parameters["Description"];
        Console.WriteLine("ttttttttttttt");
        User? user = _userService.GetUserById(id);
        var res = await _httpClient.PostAsJsonAsync($"/1/cards?idList={boardId}&name={name}&desc={desc}&key={_trelloCredentials.ClientId}&token={user.TrelloOAuth.accessToken}", new {
        });
    }
    
    public void AddActionReaction(ActionReaction actionReaction)
    {
        if (actionReaction.ParamsAction == null)
            throw new BadHttpRequestException("invalid parameters");
        switch (actionReaction.Action) {
            // case "OnBoardUpdate": CreateWebhooks("/Trello/OnBoardUpdate", actionReaction.ParamsAction["boardId"], actionReaction.ParamsAction["description"], actionReaction); break;
            // case "OnCardUpdate": CreateWebhooks("/Trello/OnCardUpdate", actionReaction.ParamsAction["boardId"], actionReaction.ParamsAction["description"], actionReaction); break;
        }
    }
    
    public void RemoveActionReaction(ActionReaction actionReaction)
    {
        
    }
}
