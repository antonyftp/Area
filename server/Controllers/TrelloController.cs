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
    
    [HttpPost("onBoardUpdateTest")]
    public async Task<ActionResult> OnBoardUpdateTest()
    {
        await _trelloService.CreateWebhooks("Trello/onBoardUpdate", "62116654b7b6fc3dbc712e0b", "oui", new ActionReaction());
        return Ok();
    }
}