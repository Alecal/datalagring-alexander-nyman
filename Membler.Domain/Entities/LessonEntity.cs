namespace Membler.Domain.Entities;

public class LessonEntity
{
    public Guid Id { get; set; }
    public Guid OfferingId { get; set; }
    public Guid LocationId { get; set; }
    public string LessonName { get; set; } = null!;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public CourseOfferingEntity Offering { get; set; } = null!;
    public LocationEntity Location { get; set; } = null!;
}