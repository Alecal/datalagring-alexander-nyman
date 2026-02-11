namespace Membler.Domain.Entities;

public class Lesson
{
    public Guid Id { get; set; }
    public Guid OfferingId { get; set; }
    public Guid LocationId { get; set; }
    public string LessonName { get; set; } = null!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public CourseOffering Offering { get; set; } = null!;
    public Location Location { get; set; } = null!;
}