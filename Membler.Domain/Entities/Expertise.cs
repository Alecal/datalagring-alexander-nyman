namespace Membler.Domain.Entities;

public class Expertise
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = null!;

    public ICollection<Instructor> Instructors { get; set; } = new List<Instructor>();
}