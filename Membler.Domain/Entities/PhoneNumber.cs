namespace Membler.Domain.Entities;

public class PhoneNumber
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Number { get; set; } = null!;

    public User User { get; set; } = null!;
}