namespace Membler.Application.DTO;

public class CreateCourseOfferingRequest
{
    public Guid CourseId { get; set; }
    public Guid InstructorId { get; set; }
    public int MaxCapacity { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}
