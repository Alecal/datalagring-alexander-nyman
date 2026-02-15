namespace Membler.Application.DTO;

public class CourseOfferingDto
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Guid InstructorId { get; set; }
    public int MaxCapacity { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string? CourseName { get; set; }
    public string? InstructorName { get; set; }
}
