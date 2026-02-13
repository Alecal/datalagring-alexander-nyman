using Membler.Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using System.Net.Security;

var builder = WebApplication.CreateBuilder(args);

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

app.MapGet("/api/users", async (MemblerDbContext db) =>
{
    var users = await db.Users
        .Select(u => new
        {
            u.Id,
            u.Email,
            u.FirstName,
            u.LastName,
            u.CreatedAt
        })
        .ToListAsync();

    return Results.Ok(users);
});

app.Run();
