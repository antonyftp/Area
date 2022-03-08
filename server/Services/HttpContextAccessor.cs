using System.Security.Claims;
using Area.Models;

namespace Area.Services;

public class HttpContextAccessor
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    
    public HttpContextAccessor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? GetUserIdFromJwt()
    {
        var identity = _httpContextAccessor?.HttpContext?.User.Identity as ClaimsIdentity;
        if (identity == null)
            return null;
        return identity.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
    }
}