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
using System.Text;
using Area.Utils;
using Newtonsoft.Json;

namespace Area.Services.OAuthService;

public class GoogleService : Service
{
    private readonly OAuthSettings _googleCredentials;
    private readonly ActionReactionService _arService;
    private readonly HttpClient _httpClient;

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
    
    protected override void SetClients(User user) 
    {
        OAuth? oauth = user.GoogleOAuth;
        if (oauth != null) {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauth.accessToken);            }
    }
    
    public GoogleService(IOptionsMonitor<OAuthSettings> oauthSettings, UserService userService, ActionReactionService ar) : base(userService)
    {
        _googleCredentials = oauthSettings.Get(OAuthSettings.Google);
        _arService = ar;
        _httpClient = new HttpClient();
        _httpClient.BaseAddress = new Uri("https://www.googleapis.com/");
        _httpClient.DefaultRequestHeaders.Accept.Clear();
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

    }

    /*public string GetAuthorizeCodeUrl()
    {
        string scopes = "https://www.googleapis.com/auth/userinfo.email https://mail.google.com/ https://www.googleapis.com/auth/gmail.send";
        string redirectUrl = "http://localhost:8081/oauth/callback/google";
        return $"https://accounts.google.com/o/oauth2/v2/auth?client_id={_googleCredentials.ClientId}&response_type=token&redirect_uri={redirectUrl}&scope={scopes}";
    }*/
    
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

    public async Task<bool> GetMailList(ActionReaction i)
    {
        var response = await _httpClient.GetAsync("gmail/v1/users/me/profile");
        var Value = i.Data.GetValueOrDefault("Value");
        UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
        temp.ActionReactionId = i.Id;
        temp.Name = i.Name;
        temp.ParamsAction = i.ParamsAction;
        temp.ParamsReaction = i.ParamsReaction;
        temp.Data = i.Data;
        if (response.IsSuccessStatusCode)
        {
            string responseBody = await response.Content.ReadAsStringAsync();
            var json = JsonConvert.DeserializeObject<GetMailResponse>(responseBody);
            if (Value == null)
            {
                temp.Data.Remove("Value");
                temp.Data.Add("Value", json.messagesTotal);
                _arService.Update(temp, i.UserId);
                return false;
            }

            if (Int32.Parse(json.messagesTotal) > Int32.Parse(Value))
            {
                temp.Data.Remove("Value");
                temp.Data.Add("Value", json.messagesTotal);
                _arService.Update(temp, i.UserId);
                return true;
            }

            return false;
        }
        return false;
    }

    public async Task SendMail(ActionReaction actionReaction, User user)
    {
        try {
            SendMailData data = new SendMailData() {
                Body = actionReaction.ParamsReaction["Content"],
                To = actionReaction.ParamsReaction["Receiver"],
                Subject = actionReaction.ParamsReaction["Object"],
            };
            var res = await _httpClient.GetAsync("gmail/v1/users/me/profile");
            Debug.WriteJson(res);
            if (res.IsSuccessStatusCode) {
                Console.WriteLine("Bite");
                string responseBody = await res.Content.ReadAsStringAsync();
                var json = JsonConvert.DeserializeObject<GoogleService.GetMailResponse>(responseBody);
                data.From = json.emailAddress;
                Debug.WriteJson(json);
            }
            var msg = new AE.Net.Mail.MailMessage {
                Subject = data.Subject,
                Body = data.Body,
                From = new MailAddress(data.From),
                To = { new MailAddress(data.To) },
                ReplyTo = { new MailAddress(data.From) }
            };
            var msgStr = new StringWriter();
            msg.Save(msgStr);
            var response2 = new HttpResponseMessage();
            var res2 = await _httpClient.PostAsJsonAsync("gmail/v1/users/me/messages/send", new Message {
                Raw = Base64UrlEncode(msgStr.ToString())
            });
            Debug.WriteJson(res2);
        } catch (Exception e) {
            Console.WriteLine(e);
            throw new Exception("Failed to send mail");
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