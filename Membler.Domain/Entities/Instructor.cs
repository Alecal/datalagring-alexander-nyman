namespace Membler.Domain.Entities;

public class Instructor
{
    public Guid UserId { get; set; }
    public string? Bio { get; set; }

    public User User { get; set; } = null!;
    public ICollection<Expertise> Expertises { get; set; } = new List<Expertise>();
    public ICollection<CourseOffering> CourseOfferings { get; set; } = new List<CourseOffering>();
}