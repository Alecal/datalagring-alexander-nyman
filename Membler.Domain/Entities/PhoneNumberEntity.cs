namespace Membler.Domain.Entities;

public class PhoneNumberEntity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Number { get; set; } = null!;

    public UserEntity User { get; set; } = null!;
}