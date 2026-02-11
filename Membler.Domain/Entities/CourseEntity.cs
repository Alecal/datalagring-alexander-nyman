namespace Membler.Domain.Entities;

public class CourseEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    public ICollection<CourseOfferingEntity> Offerings { get; set; } = new List<CourseOfferingEntity>();
}