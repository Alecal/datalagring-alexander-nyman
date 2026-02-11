namespace Membler.Domain.Entities;

public class InstructorEntity
{
    public Guid UserId { get; set; }
    public string? Bio { get; set; }

    public UserEntity User { get; set; } = null!;
    public ICollection<ExpertiseEntity> Expertises { get; set; } = new List<ExpertiseEntity>();
    public ICollection<CourseOfferingEntity> CourseOfferings { get; set; } = new List<CourseOfferingEntity>();
}