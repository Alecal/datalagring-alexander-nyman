namespace Membler.Application.DTO;

public class CreateUserRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsInstructor { get; set; }
    public string? Bio { get; set; }
    public List<Guid>? ExpertiseIds { get; set; }
}
