using System.Net.Http.Headers;
using Area.Controllers;
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
    private readonly ActionReactionService _actionReactionService;
    
    public TrelloService(IOptionsMonitor<OAuthSettings> oauthSettings, UserService userService, IOptions<WebhooksSettings> webhooksSettings, ActionReactionService actionReactionService)
    {
        _trelloCredentials = oauthSettings.Get(OAuthSettings.Trello);
        _userService = userService;
        _webhooksSettings = webhooksSettings.Value;
        _actionReactionService = actionReactionService;
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
    
    public async Task CreateWebhooks(string callbackUrl, string modelId, string description, ActionReaction actionReaction)
    {
        try {
            User user = _userService.GetCurrentUser()!;
            HttpResponseMessage response = await _httpClient.PostAsJsonAsync($"tokens/{user.TrelloOAuth.accessToken}/webhooks/?key={_trelloCredentials.ClientId}", new {
                    callbackURL = _webhooksSettings.ServerBaseUrl + callbackUrl,
                    idModel = modelId,
                    description = description
                });
            Debug.WriteJson(response);
        } catch (Exception e) {
            Console.WriteLine(e.Message);
            throw new Exception("Failed to create webhooks");
        }
    }

    public async void CreateNewBoard(Dictionary<string, string> parameters, User user)
    {
        string name = parameters["Name"];
        var res = await _httpClient.PostAsJsonAsync($"/1/boards?name={name}&key={_trelloCredentials.ClientId}&token={user.TrelloOAuth.accessToken}", new {
        });
    }

    public async void CreateNewList(Dictionary<string, string> parameters, User user)
    {
        string boardId = parameters["BoardId"];
        string name = parameters["Name"];
        var res = await _httpClient.PostAsJsonAsync($"/1/lists?idBoard={boardId}&name={name}&key={_trelloCredentials.ClientId}&token={user.TrelloOAuth.accessToken}", new {
        });
    }

    public async void CreateNewCard(Dictionary<string, string> parameters, User user)
    {
        string boardId = parameters["ListId"];
        string name = parameters["Name"];
        string desc = parameters["Description"];
        var res = await _httpClient.PostAsJsonAsync($"/1/cards?idList={boardId}&name={name}&desc={desc}&key={_trelloCredentials.ClientId}&token={user.TrelloOAuth.accessToken}", new {
        });
    }
    
    public void AddActionReaction(ActionReaction actionReaction)
    {
        if (actionReaction.ParamsAction == null)
            throw new BadHttpRequestException("invalid parameters");
        switch (actionReaction.Action) { }
    }
    
    public void RemoveActionReaction(ActionReaction actionReaction)
    {
        
    }

    public class Card
    {
        public string id { get; set; }
        public bool closed { get; set; }
        public string name { get; set; }
    }

    public async Task<int> OnCardCreated(ActionReaction actionReaction, User user)
    {
        string listId = actionReaction.ParamsAction["ListId"];
        var res = await _httpClient.GetAsync($"/1/lists/{listId}/cards/?key={_trelloCredentials.ClientId}&token={user.TrelloOAuth.accessToken}&fields=all");
        List<Card> response = res.Content.ReadAsAsync<List<Card>>().Result;
        var data = actionReaction.Data ?? new Dictionary<string, string>();
        var cards  = System.Text.Json.JsonSerializer.Serialize(response);
        List<Card> currentCards = actionReaction.Data.ContainsKey("cards") ? System.Text.Json.JsonSerializer.Deserialize<List<Card>>(actionReaction.Data["cards"]) : new List<Card>();
        int diff = response.Count != currentCards.Count ? response.Count - currentCards.Count : 0;
        data.Remove("cards");
        data.Add("cards", cards);
        _actionReactionService.Update(new UpdateActionReactionToUserBody() {
            Data = data,
            Name = actionReaction.Name,
            ParamsAction = actionReaction.ParamsAction,
            ParamsReaction = actionReaction.ParamsReaction,
            ActionReactionId = actionReaction.Id
        }, user.Id);
        return diff;
    }
}
