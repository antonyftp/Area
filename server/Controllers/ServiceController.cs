using System.Net;
using Area.Models;
using Area.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Area.Controllers;

public class AboutJson
{
    public struct Client
    {
        public Client(string host_)
        {
            host = host_;
        }
        
        public string host { get; set; }
    }

    public struct Server
    {
        public Server(List<Service> services_)
        {
            services = services_;
            current_time = DateTimeOffset.Now.ToUnixTimeSeconds();
        }

        public long current_time { get; set; }
        public List<Service> services { get; set; }
    }

    public AboutJson(List<Service> services_, string oui)
    {
        client = new Client(oui);
        server = new Server(services_);
    }
    
    public Client client { get; set; }
    public Server server { get; set; }

}

[Authorize]
[ApiController]
[Route("[controller]")]
public class ServiceController : Controller
{
    private readonly ServiceService _service;

    public ServiceController(ServiceService service)
    {
        _service = service;
    }
    
    [HttpGet]
    [Route("/about.json")]
    [AllowAnonymous]
    public ActionResult<string> About()
    {
        var hostEntry = Dns.GetHostEntry(Dns.GetHostName());
        var clientIp = Convert.ToString(hostEntry.AddressList.FirstOrDefault(address => address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork));
        List<Service> services = _service.GetAllServices();
        return Ok(new AboutJson(services, clientIp ?? ""));
    }
}