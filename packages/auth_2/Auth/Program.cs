using Auth;
using Grpc.Core;
using Microsoft.AspNetCore.Server.Kestrel.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();

var app = builder.Build();

app.MapGrpcService<AuthService>();

app.Run();

public class AuthService : Auth.AuthService.AuthServiceBase
{
    private readonly HashSet<string> _users = new()
    {
        "user1",
        "user2",
        "user3",
        "user4",
        "user5",
    };

    public override Task<ResponseAuth> Auth(RequestAuth request, ServerCallContext context)
    {
        if (_users.Contains(request.Name))
        {
            return Task.FromResult(new ResponseAuth
            {
                Authenticated = true
            });
        }
        return Task.FromResult(new ResponseAuth
        {
            Authenticated = false
        });
    }
}