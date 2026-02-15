namespace Membler.Application.DTO;

public class CreateEnrollmentRequest
{
    public Guid ParticipantId { get; set; }
    public Guid OfferingId { get; set; }
    public Guid StatusId { get; set; }
    public DateTime? EnrollmentDate { get; set; }
}
