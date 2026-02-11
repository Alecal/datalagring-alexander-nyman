namespace Membler.Domain.Entities;

public class CourseOfferingEntity
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Guid InstructorId { get; set; }
    public int MaxCapacity { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    public CourseEntity Course { get; set; } = null!;
    public InstructorEntity Instructor { get; set; } = null!;
    public ICollection<LessonEntity> Lessons { get; set; } = new List<LessonEntity>();
    public ICollection<EnrollmentEntity> Enrollments { get; set; } = new List<EnrollmentEntity>();
}