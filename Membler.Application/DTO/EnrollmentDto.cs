namespace Membler.Application.DTO;

public class EnrollmentDto
{
    public Guid Id { get; set; }
    public Guid ParticipantId { get; set; }
    public Guid OfferingId { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public Guid StatusId { get; set; }
    public string? ParticipantName { get; set; }
    public string? CourseName { get; set; }
    public string? StatusName { get; set; }
}
