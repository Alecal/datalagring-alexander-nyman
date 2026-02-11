namespace Membler.Domain.Entities;

public class Course
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    public ICollection<CourseOffering> Offerings { get; set; } = new List<CourseOffering>();
}