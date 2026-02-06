namespace Membler.Domain.Models;

public class Member
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsInstructor { get; set; }
}

public class PhoneNumber
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Number { get; set; } = string.Empty;
}