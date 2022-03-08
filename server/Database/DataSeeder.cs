using System.Text;
using Area.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using Action = Area.Models.Action;

namespace Area.Database;

public class DataSeederService
{
    private readonly IMongoCollection<Service> _serviceC;
    private readonly IMongoCollection<User> _userC;
    private readonly IMongoCollection<ActionReaction> _actionsReactionsC;

    public DataSeederService(DatabaseContext databaseContext)
    {
        databaseContext.Database.DropCollection("Services");
        databaseContext.Database.DropCollection("Users");
        databaseContext.Database.DropCollection("ActionsReactions");
        _serviceC = databaseContext.Database.GetCollection<Service>("Services");
        _userC = databaseContext.Database.GetCollection<User>("Users");
        _actionsReactionsC = databaseContext.Database.GetCollection<ActionReaction>("ActionsReactions");
    }
    
    public void SeedUser()
    {
        var users = new List<User>()
        {
            new User()
            {
                Name = "yann",
                Email = "yann.simon@test.com",
                Password = BCrypt.Net.BCrypt.HashPassword("password")
            }
        };
        _userC.InsertMany(users);
        var actionsReactions = new List<ActionReaction>()
        {
            new ActionReaction()
            {
                UserId = users[0].Id.ToString(),
                Name = "Send email when discord notification is triggered",
                ActionService = "Discord",
                Action = "OnNotif",
                ReactionService = "Gmail",
                Reaction = "SendEmail",
                ParamsAction = {},
                ParamsReaction = {}
            }
        };
        _actionsReactionsC.InsertMany(actionsReactions);
    }

    public void SeedService()
    {
        string json = System.IO.File.ReadAllText("Database/ServicesList.json");
        var services = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Service>>(json);
        _serviceC.InsertMany(services);
    }
}