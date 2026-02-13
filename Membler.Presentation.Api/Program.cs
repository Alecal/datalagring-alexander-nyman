using Membler.Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using System.Net.Security;

using Membler.Domain.Interfaces;
using Membler.Infrastructure.Repositories;
using Membler.Application.Users;
using Membler.Application.DTO;

using Membler.Domain.Interfaces;
using Membler.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// USER
builder.Services.AddScoped<IUserRepository, UserRepository>();
// INSTRUCTOR
builder.Services.AddScoped<IInstructorRepository, InstructorRepository>();

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


// GET /api/users/{id} - HÄMTA MED ID!
app.MapGet("/api/users/{id:guid}", async (UserService service, Guid id) =>
{
    var user = await service.GetByIdAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});


// PUT /api/users/{id} - UPPDATERA MED ID!
app.MapPut("/api/users/{id:guid}", async (UserService service, Guid id, UserDto request) =>
{
    var updated = await service.UpdateAsync(id, request);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});


// DELETE /api/users/{id} - TA BORT MED ID!
app.MapDelete("/api/users/{id:guid}", async (UserService service, Guid id) =>
{
    var deleted = await service.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();
