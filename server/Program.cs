using System.Text;
using Area.Database;
using Area.Services;
using Area.Services.OAuthService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using HttpContextAccessor = Area.Services.HttpContextAccessor;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

ConfigurationManager configuration = builder.Configuration;
configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true);

builder.Services.AddControllers();
builder.Services.AddCors(options => { options.AddPolicy("CorsPolicy", builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }); 
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)    
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtKey"])),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();

builder.Services.Configure<DatabaseSettings>(configuration.GetSection(DatabaseSettings.DatabaseSettingsSection));
builder.Services.Configure<WeatherSettings>(configuration.GetSection("Weather"));
builder.Services.Configure<WebhooksSettings>(configuration.GetSection(WebhooksSettings.Section));
builder.Services.Configure<OAuthSettings>(OAuthSettings.Github, configuration.GetSection("OAuth:" + OAuthSettings.Github));
builder.Services.Configure<OAuthSettings>(OAuthSettings.Google, configuration.GetSection("OAuth:" + OAuthSettings.Google));
builder.Services.Configure<OAuthSettings>(OAuthSettings.Discord, configuration.GetSection("OAuth:" + OAuthSettings.Discord));
builder.Services.Configure<OAuthSettings>(OAuthSettings.Trello, configuration.GetSection("OAuth:" + OAuthSettings.Trello));
builder.Services.Configure<OAuthSettings>(OAuthSettings.Dailymotion, configuration.GetSection("OAuth:" + OAuthSettings.Dailymotion));

builder.Services.AddSingleton<DatabaseContext>();

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ServiceService>();
builder.Services.AddScoped<ActionReactionService>();
builder.Services.AddScoped<ReactionService>();
builder.Services.AddScoped<GithubService>();
builder.Services.AddScoped<GoogleService>();
builder.Services.AddScoped<DiscordService>();
builder.Services.AddScoped<TrelloService>();
builder.Services.AddScoped<WeatherService>();
builder.Services.AddScoped<DailymotionService>();
builder.Services.AddScoped<HttpContextAccessor>();
builder.Services.AddScoped<PornhubService>();

builder.Services.AddTransient<DataSeederService>();
builder.Services.AddTransient<OAuthService>();

var app = builder.Build();

void SeedData(IHost app)
{
    var scopedFactory = app.Services.GetService<IServiceScopeFactory>();

    using (var scope = scopedFactory?.CreateScope())
    {
        var service = scope?.ServiceProvider.GetService<DataSeederService>();
        service?.SeedService();
        service?.SeedUser();
    }
    Environment.Exit(0);
}

if (args.Length == 1 && args[0].ToLower() == "seeddata")
    SeedData(app);


// app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();