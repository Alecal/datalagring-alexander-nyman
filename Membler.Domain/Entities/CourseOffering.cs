namespace Membler.Domain.Entities;

public class CourseOffering
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Guid InstructorId { get; set; }
    public int MaxCapacity { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    public Course Course { get; set; } = null!;
    public Instructor Instructor { get; set; } = null!;
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}