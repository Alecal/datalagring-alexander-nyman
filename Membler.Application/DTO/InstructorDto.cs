namespace Membler.Application.DTO;

public class InstructorDto
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public List<ExpertiseDto> Expertises { get; set; } = new();
    public List<Guid>? ExpertiseIds { get; set; }
}
