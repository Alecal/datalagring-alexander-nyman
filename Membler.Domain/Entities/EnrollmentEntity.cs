namespace Membler.Domain.Entities;

public class EnrollmentEntity
{
    public Guid Id { get; set; }
    public Guid ParticipantId { get; set; }
    public Guid OfferingId { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public Guid StatusId { get; set; }

    public UserEntity Participant { get; set; } = null!;
    public CourseOfferingEntity Offering { get; set; } = null!;
    public StatusEntity Status { get; set; } = null!;
}