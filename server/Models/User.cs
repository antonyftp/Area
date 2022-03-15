using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Area.Services.OAuthService;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Area.Models;

public class OAuth
{ 
    public string accessToken { get; set; } = String.Empty;
}

public class GithubOAuth : OAuth
{
    public string username { get; set; } = String.Empty;
}

public class GoogleOAuth : OAuth
{
    
}

public class DiscordOAuth : OAuth
{
    
}

public class TrelloOAuth : OAuth
{
    
}

public class DailymotionOAuth : OAuth
{
    public string id { get; set; } = String.Empty;
}

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id_ { get; set; }

    [BsonElement("id")]
    public string Id {
        get {
            return Id_.ToString();
        } }

    [BsonElement("loginType")]
    public LoginTypeEnum LoginType { get; set; }
    
    [Required]
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;
    
    [BsonElement("password")]
    public string Password { get; set; } = string.Empty;
    
    [BsonElement("actionsReactions")]
    public List<ActionReaction> ActionsReactions { get; set; } = new List<ActionReaction>();

    [BsonElement("githubOAuth")] 
    public GithubOAuth? GithubOAuth { get; set; } = null;

    [BsonElement("googleOAuth")] 
    public GoogleOAuth? GoogleOAuth { get; set; } = null;

    [BsonElement("discordOAuth")] 
    public DiscordOAuth? DiscordOAuth { get; set; } = null;
    
    [BsonElement("trelloOAuth")] 
    public TrelloOAuth? TrelloOAuth { get; set; } = null;

    [BsonElement("dailymotionOAuth")] 
    public DailymotionOAuth? DailymotionOAuth { get; set; } = null;
}
