using Membler.Infrastructure.Data;
using Membler.Infrastructure.Repositories;
using Membler.Domain.Models;

// 1. Setup Connection
var connectionString = "Host=172.232.143.174;Database=Membler;Username=membler;Password=membler11223344!";
var factory = new SqlConnectionFactory(connectionString);
var repo = new MemberRepository(factory);

// 2. Prepare Data
var dto = new CreateMemberDto(
    FirstName: "Test",
    LastName: "User",
    Email: $"test_{Guid.NewGuid()}@example.com",
    IsInstructor: false
);

// 3. Execute and Print
try
{
    Console.WriteLine("Attempting to create member...");
    var result = await repo.CreateAsync(dto, CancellationToken.None);

    Console.WriteLine($"Success! ID: {result.Id}");
}
catch (Exception ex)
{
    Console.WriteLine($"Error: {ex.Message}");
    if (ex.InnerException != null)
        Console.WriteLine($"Inner: {ex.InnerException.Message}");
}