using Membler.Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using System.Net.Security;

using Membler.Domain.Interfaces;
using Membler.Infrastructure.Repositories;
using Membler.Application.Users;
using Membler.Application.DTO;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<UserService>();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<MemblerDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("MemblerDatabase"),
        sql => sql.MigrationsAssembly("Membler.Infrastructure")
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// GET /api/users
app.MapGet("/api/users", async (UserService service) =>
{
    var users = await service.GetAllAsync();
    return Results.Ok(users);
});

// POST /api/users
app.MapPost("/api/users", async (UserService service, UserDto request) =>
{
    var created = await service.CreateAsync(request);
    return Results.Created($"/api/users/{created.Id}", created);
});

app.Run();
