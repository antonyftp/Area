using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Area.Models;

public class ActionReaction
{
    public class Param
    {
        [BsonElement("name")]
        public string Name { get; set; } = String.Empty;
        [BsonElement("value")]
        public string Value { get; set; } = String.Empty;
    }
    
    [BsonId]
    [BsonElement("id_")]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id_ { get; set; }

    [BsonElement("id")]
    public string Id {
        get {
            return Id_.ToString();
        } }

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; }
    
    [BsonElement("name")]
    public string Name { get; set; } = String.Empty;
    
    [BsonElement("actionService")]
    public string ActionService { get; set; } = String.Empty;
    
    [BsonElement("action")]
    public string Action { get; set; } = String.Empty;
    
    [BsonElement("reactionService")]
    public string ReactionService { get; set; } = String.Empty;
    
    [BsonElement("reaction")]
    public string Reaction { get; set; } = String.Empty;
    
    [BsonElement("paramsAction")] 
    public Dictionary<string, string>? ParamsAction { get; set; } = null;

    [BsonElement("paramsReaction")] 
    public Dictionary<string, string>? ParamsReaction { get; set; } = null;

    [BsonElement("data")] 
    public Dictionary<string, string>? Data { get; set; } = new Dictionary<string, string>();
}