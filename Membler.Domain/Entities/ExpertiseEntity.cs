namespace Membler.Domain.Entities;

public class ExpertiseEntity
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = null!;

    public ICollection<InstructorEntity> Instructors { get; set; } = new List<InstructorEntity>();
}