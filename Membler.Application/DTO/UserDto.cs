namespace Membler.Application.DTO;

public class UserDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // om lärare
    public bool IsInstructor { get; set; }
    public string? Bio { get; set; }
}
