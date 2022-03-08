using Area.Database;
using Area.Models;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Http.Extensions;
using System.Net.Http.Headers;
using Area.Controllers;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using System.Net.Mail;
using Area.Utils;
using Newtonsoft.Json;

namespace Area.Services.OAuthService;

public class GoogleService
{
    private readonly OAuthSettings _googleCredentials;
    private readonly UserService _userService;
    static HttpClient Client = new HttpClient();


    public class RequestMailData
    {
        public string maxResults { get; set; } = "1";
        public string q { get; set; } = "is:unread";

    }

    public class GetMailResponse
    {
        public string emailAddress { get; set; }
        public string messagesTotal { get; set; }
    }

    public class SendMailData
    {
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } =  string.Empty;

        public string From { get; set; } = string.Empty;
        public string To { get; set; } = string.Empty;

    }
    
    public GoogleService(IOptionsMonitor<OAuthSettings> oauthSettings, UserService userService)
    {
        _googleCredentials = oauthSettings.Get(OAuthSettings.Google);
        _userService = userService;
    }

    public string GetAuthorizeCodeUrl()
    {
        string scopes = "https://www.googleapis.com/auth/userinfo.email https://mail.google.com/";
        string redirectUrl = "http://localhost:8081/oauth/callback/google";
        return $"https://accounts.google.com/o/oauth2/v2/auth?client_id={_googleCredentials.ClientId}&response_type=token&redirect_uri={redirectUrl}&scope={scopes}";
    }
    
    public OAuthCredentials GetCredentials()
    {
        return new OAuthCredentials() {
            clientId = _googleCredentials.ClientId,
        };
    }
    
    public void AddActionReaction(ActionReaction actionReaction)
    {
        // if (actionReaction.Params == null && actionReaction.Params["Repository"] == null)
        //     throw new BadHttpRequestException("invalid parameters");
        switch (actionReaction.Action) {
            // case "OnEmail": break;//CreateWebhooks(repository, "push", actionReaction); break;
        }
    }

    public async Task<string?> GetMailList(string req, string? value)
    {
        var response = new HttpResponseMessage();
        using (
            var request = new HttpRequestMessage(HttpMethod.Get, "https://gmail.googleapis.com/gmail/v1/users/me/profile"))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", req);
            response = await Client.SendAsync(request);
        }
        if (response.IsSuccessStatusCode)
        {
            string responseBody = await response.Content.ReadAsStringAsync();
            var json = JsonConvert.DeserializeObject<GetMailResponse>(responseBody);

            if (value != null && (Int32.Parse(json.messagesTotal) != Int32.Parse(value)))
            {
                return json.messagesTotal;
            }
            return null;
        }
        return null;
        
    }

    public async void SendMail(ActionReaction actionReaction)
    {
        SendMailData data = new SendMailData() {
            Body = actionReaction.ParamsReaction["Content"],
            To = actionReaction.ParamsReaction["Receiver"],
            Subject = actionReaction.ParamsReaction["Object"],
        };
        User user = _userService.GetUserById(actionReaction.UserId);
        var Client = new HttpClient();
        var response = new HttpResponseMessage();
        Debug.WriteClass(user);
        using (var request = new HttpRequestMessage(HttpMethod.Get, "https://gmail.googleapis.com/gmail/v1/users/me/profile"))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", user.GoogleOAuth.accessToken);
            response = await Client.SendAsync(request);
        }
        if (response.IsSuccessStatusCode)
        {
            string responseBody = await response.Content.ReadAsStringAsync();
            var json = JsonConvert.DeserializeObject<GoogleService.GetMailResponse>(responseBody);
            data.From = json.emailAddress;
        }
        var msg = new AE.Net.Mail.MailMessage
        {
            Subject = data.Subject,
            Body = data.Body,
            From = new MailAddress(data.From)
        };
        msg.To.Add(new MailAddress(data.To));
        msg.ReplyTo.Add(msg.From);
        var msgStr = new StringWriter();
        msg.Save(msgStr);
        var response2 = new HttpResponseMessage();
        using (
            var request = new HttpRequestMessage(HttpMethod.Post, "https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send"))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", user.GoogleOAuth.accessToken);
            var message = new Message
            {
                Raw = Base64UrlEncode(msgStr.ToString())
            };
            request.Content = JsonContent.Create(message);
            response2 = await Client.SendAsync(request);
        }
    }
    private static string Base64UrlEncode(string input)
    {
        var inputBytes = System.Text.Encoding.UTF8.GetBytes(input);
        return Convert.ToBase64String(inputBytes)
          .Replace('+', '-')
          .Replace('/', '_')
          .Replace("=", "");
    }
}