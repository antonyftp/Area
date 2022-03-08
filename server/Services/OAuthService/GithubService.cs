using System.Net.Http.Headers;
using Area.Database;
using Area.Models;
using Area.Utils;
using Microsoft.Extensions.Options;
using Octokit;
using User = Area.Models.User;

namespace Area.Services.OAuthService;

public class GithubService
{
    private readonly OAuthSettings _githubCredentials;
    private readonly UserService _userService;
    private RepositoryHooksClient _gitHubHooksClient;
    private GitHubClient _gitHubClient;
    private readonly WebhooksSettings _webhooksSettings;

    public void SetGithubClientCredentials(string id = "") 
    {
        User? user = id != "" ? _userService.GetUserById(id) : _userService.GetCurrentUser(true);
        if (user != null) {
            OAuth? oauth = user.GithubOAuth;
            if (oauth != null) {
                var credentials = new Credentials(oauth.accessToken);
                var connection = new Connection(new Octokit.ProductHeaderValue("AreaServerGithubClient")) {
                    Credentials = credentials
                };
                var apiConnection = new ApiConnection(connection);
                _gitHubHooksClient = new RepositoryHooksClient(apiConnection);
                _gitHubClient = new GitHubClient(new Octokit.ProductHeaderValue("AreaApp"));
                _gitHubClient.Credentials = credentials;
            }
        }
    }
    
    public GithubService(IOptionsMonitor<OAuthSettings> oauthSettings, UserService userService, IOptions<WebhooksSettings> webhooksSettings)
    {
        _githubCredentials = oauthSettings.Get(OAuthSettings.Github);
        _userService = userService;
        SetGithubClientCredentials();
        _webhooksSettings = webhooksSettings.Value;
    }

    public class GetAccessTokenRes
    {
        public string access_token { get; set; }
        public string scope { get; set; }
        public string token_type { get; set; }
    }

    public string GetAuthorizeCodeUrl()
    {
        string scope = "repo,user,notifications,";
        return $"https://github.com/login/oauth/authorize?client_id={_githubCredentials.ClientId}&scope={scope}";
    }
    
    public async Task<GetAccessTokenRes> GetAccessToken(string code)
    {
        HttpClient httpClient = new HttpClient();
        httpClient.BaseAddress = new Uri("https://github.com/");
        httpClient.DefaultRequestHeaders.Accept.Clear();
        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        HttpResponseMessage response = await httpClient.PostAsJsonAsync("login/oauth/access_token", new {
            client_id = _githubCredentials.ClientId,
            client_secret = _githubCredentials.ClientSecret,
            code = code
        });
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsAsync<GetAccessTokenRes>();
    }

    public async void updateDbProfileData()
    {
        var test =_userService.GetCurrentUser();
        var user = await _gitHubClient.User.Current();
        _userService.SetGithubOAuthData(user.Login);
    }

    private void CreateWebhooks(string repository, string whEvent, ActionReaction actionReaction)
    {
        try {
            User user = _userService.GetCurrentUser()!;
            var config = new Dictionary<string, string>
            {
                { "url", $"{_webhooksSettings.ServerBaseUrl}/Github/{whEvent}"},
                { "content_type", "json" },
                { "secret", "super secret"},
            };
            var hook = new NewRepositoryHook("web", config)
            {
                Events = new List<string> { whEvent },
                Active = true
            };
            var res = _gitHubHooksClient.Create(user.GithubOAuth.username, repository, hook).Result;
            actionReaction.Data.Add("hookId", res.Id.ToString());
            actionReaction.Data.Add("event", whEvent);
            var res2 = _gitHubClient.User.Current().Result;
            actionReaction.Data.Add("username", res2.Login);
        } catch (Octokit.ApiValidationException e) {
            throw new Exception("Failed to create webhooks");
        }
    }
    
    public void AddActionReaction(ActionReaction actionReaction)
    {
        if (actionReaction.ParamsAction == null && actionReaction.ParamsAction["Repository"] == null)
            throw new BadHttpRequestException("invalid parameters");
        string repository = actionReaction.ParamsAction["Repository"];
        switch (actionReaction.Action) {
            case "OnPush": CreateWebhooks(repository, "push", actionReaction); break;
            case "OnPullRequest": CreateWebhooks(repository, "pull_request", actionReaction); break;
            case "OnWorkflow": CreateWebhooks(repository, "workflow_run", actionReaction); break;
        }
    }

    public void RemoveActionReaction(string owner, ActionReaction actionReaction)
    {
        try {
            _gitHubHooksClient.Delete(owner, actionReaction.ParamsAction["Repository"], int.Parse(actionReaction.Data["hookId"])).Wait();
        } catch (Octokit.ApiValidationException e) {
            throw new Exception("Failed to create webhooks");
        }
    }
    
    public void CreateIssue(Dictionary<string, string> parameters, string id)
    {
        try {
            SetGithubClientCredentials(id);
            User? user = _userService.GetUserById(id);
            _gitHubClient.Issue.Create(user.GithubOAuth.username, parameters["Repository"], new NewIssue(parameters["Title"])).Wait();
        } catch (Octokit.ApiValidationException e) {
            throw new Exception("Failed to create webhooks");
        }
    }
    
    public void CreatePullRequest(Dictionary<string, string> parameters, string id)
    {
        try {
            SetGithubClientCredentials(id);
            User? user = _userService.GetUserById(id);
            _gitHubClient.PullRequest.Create(user.GithubOAuth.username, parameters["Repository"], new NewPullRequest(parameters["Title"], parameters["Head"], parameters["BaseRef"]) {
                Body = parameters["Body"]
            }).Wait();
        } catch (Octokit.ApiValidationException e) {
            throw new Exception("Failed to create webhooks");
        }
    }
}
