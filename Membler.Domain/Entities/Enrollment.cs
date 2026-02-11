namespace Membler.Domain.Entities;

public class Enrollment
{
    public Guid Id { get; set; }
    public Guid ParticipantId { get; set; }
    public Guid OfferingId { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public Guid StatusId { get; set; }

    public User Participant { get; set; } = null!;
    public CourseOffering Offering { get; set; } = null!;
    public Status Status { get; set; } = null!;
}