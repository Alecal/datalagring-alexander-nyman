namespace Membler.Domain.Entities;

public class LocationEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Address { get; set; }
}