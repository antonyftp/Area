using Area.Exceptions;
using Area.Models;

namespace Area.Services.OAuthService;

public class Service
{
    protected readonly UserService _userService;

    public Service(UserService userService)
    {
        _userService = userService;
    }
    
    protected virtual void SetClients(User user)
    {
        
    }
    
    public void SetClientCredentials()
    {
        User? user = _userService.GetCurrentUser();
        if (user != null)
            SetClients(user);
    }

    public void SetClientCredentials(string id)
    {
        User? user = _userService.GetUserById(id);
        if (user != null)
            SetClients(user);
    }

    public void SetClientCredentials(User user) 
    {
        SetClients(user);
    }
}