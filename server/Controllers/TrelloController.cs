using Area.Models;
using Area.Services.OAuthService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Area.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class TrelloController : Controller
{
    private readonly TrelloService _trelloService;

    public TrelloController(TrelloService TrelloService)
    {
        _trelloService = TrelloService;
    }

    [HttpPost("onBoardUpdate")]
    [AllowAnonymous]
    public async Task<ActionResult> OnBoardUpdate()
    {
        Console.WriteLine("tttttttttt");
        return Ok();
    }
}