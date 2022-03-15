using MongoDB.Driver;
using Newtonsoft.Json;

namespace Area.Database;

public class DatabaseSettings
{
    public const string DatabaseSettingsSection = "DatabaseSettings";

    public string? ConnectionString { get; set; }
    public string? DatabaseName { get; set; }
}
public class OAuthSettings
{
    public const string Github = "Github";
    public const string Google = "Google";
    public const string Discord = "Discord";
    public const string Dailymotion = "Dailymotion";
    public const string Trello = "Trello";

    public string ClientId { get; set; } = String.Empty;

    public string ClientSecret { get; set; } = String.Empty;
}

public class WebhooksSettings
{
    public const string Section = "WebhooksSettings";
    
    public string ServerBaseUrl { get; set; } = String.Empty;
}

public class WeatherSettings
{
    public string ApiKey { get; set; }
}