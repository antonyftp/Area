using Area.Database;
using Area.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using Action = Area.Models.Action;

namespace Area.Services;

public class ServiceService
{
    private readonly IMongoCollection<Service> _services;

    public ServiceService(IConfiguration configuration, DatabaseContext databaseContext)
    {
        _services = databaseContext.Database.GetCollection<Service>("Services");
    }

    public List<Service> GetAllServices() => _services.Find<Service>(_ => true).ToList();

    public Action GetAction(string name, string action)
    {
        var service = _services.Find<Service>(e => e.Name == name).FirstOrDefault();
        return service.Actions.Find(e => e.Name == action);
    }
}