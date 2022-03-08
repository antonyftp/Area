using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Area.Models;

public class Param
{
    [BsonElement("name")]
    public string Name { get; set; } = String.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = String.Empty;

    [BsonElement("type")]
    public string Type { get; set; } = String.Empty;
}

public class Action
{
    [BsonElement("name")]
    public string Name { get; set; } = String.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = String.Empty;

    [BsonElement("params")] 
    public Param[]? Params { get; set; } = null;

    [BsonElement("variables")] 
    public Param[]? Variables { get; set; } = null;
}

public class Reaction
{
    [BsonElement("name")]
    public string Name { get; set; } = String.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = String.Empty;

    [BsonElement("params")] 
    public Param[]? Params { get; set; } = null;
}

public class Service
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonElement("name")]
    public string Name { get; set; } = String.Empty;

    [BsonElement("actions")]
    public List<Action>? Actions { get; set; } = null;

    [BsonElement("reactions")]
    public Reaction[]? Reactions { get; set; } = null;
}
