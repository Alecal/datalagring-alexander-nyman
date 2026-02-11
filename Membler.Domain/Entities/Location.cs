namespace Membler.Domain.Entities;

public class Location
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Address { get; set; }
}