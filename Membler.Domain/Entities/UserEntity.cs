namespace Membler.Domain.Entities;

public class UserEntity
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public InstructorEntity? Instructor { get; set; }
    public ICollection<PhoneNumberEntity> PhoneNumbers { get; set; } = new List<PhoneNumberEntity>();
    public ICollection<EnrollmentEntity> Enrollments { get; set; } = new List<EnrollmentEntity>();
}