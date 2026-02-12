using Membler.Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

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

app.Run();
