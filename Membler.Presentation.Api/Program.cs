using Membler.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<MemblerDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("MemblerDatabase"),
        sql => sql.MigrationsAssembly("Membler.Infrastructure")
    );
});

var app = builder.Build();

app.UseHttpsRedirection();

app.Run();
