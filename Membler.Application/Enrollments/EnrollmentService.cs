using Membler.Application.DTO;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;

namespace Membler.Application.Enrollments;

public class EnrollmentService
{
    private readonly IEnrollmentRepository _enrollments;
    private readonly ICourseOfferingRepository _offerings;

    public EnrollmentService(IEnrollmentRepository enrollments, ICourseOfferingRepository offerings)
    {
        _enrollments = enrollments;

        _offerings = offerings;
    }

    public async Task<EnrollmentDto?> GetByIdAsync(Guid id)
    {
        var entity = await _enrollments.GetByIdAsync(id);
        return entity is null ? null : MapToDto(entity);
    }

    public async Task<IReadOnlyList<EnrollmentDto>> GetAllAsync()
    {
        var entities = await _enrollments.GetAllAsync();
        return entities.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyList<EnrollmentDto>> GetByOfferingIdAsync(Guid offeringId)
    {
        var entities = await _enrollments.GetByOfferingIdAsync(offeringId);
        return entities.Select(MapToDto).ToList();
    }

    public async Task<EnrollmentDto?> CreateAsync(CreateEnrollmentRequest request)
    {
        var offering = await _offerings.GetByIdAsync(request.OfferingId);
        if (offering is null) return null;

        var existingForOffering = await _enrollments.GetByOfferingIdAsync(request.OfferingId);
        if (existingForOffering.Count >= offering.MaxCapacity)
            return null;
        if (existingForOffering.Any(e => e.ParticipantId == request.ParticipantId))
            return null;

        var enrollment = new EnrollmentEntity
        {
            Id = Guid.NewGuid(),
            ParticipantId = request.ParticipantId,
            OfferingId = request.OfferingId,
            StatusId = request.StatusId,
            EnrollmentDate = request.EnrollmentDate ?? DateTime.UtcNow
        };
        await _enrollments.AddAsync(enrollment);

        var withIncludes = await _enrollments.GetByIdAsync(enrollment.Id);
        return withIncludes is null ? MapToDto(enrollment) : MapToDto(withIncludes);
    }

    public async Task<EnrollmentDto?> UpdateAsync(Guid id, EnrollmentDto request)
    {
        var entity = await _enrollments.GetByIdAsync(id);
        if (entity is null) return null;

        entity.ParticipantId = request.ParticipantId;
        entity.OfferingId = request.OfferingId;
        entity.StatusId = request.StatusId;
        entity.EnrollmentDate = request.EnrollmentDate;

        await _enrollments.UpdateAsync(entity);
        var updated = await _enrollments.GetByIdAsync(id);
        return updated is null ? MapToDto(entity) : MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _enrollments.GetByIdAsync(id);
        if (entity is null) return false;
        await _enrollments.DeleteAsync(entity);
        return true;
    }

    private static EnrollmentDto MapToDto(EnrollmentEntity e)
    {
        return new EnrollmentDto
        {
            Id = e.Id,
            ParticipantId = e.ParticipantId,
            OfferingId = e.OfferingId,
            EnrollmentDate = e.EnrollmentDate,
            StatusId = e.StatusId,
            ParticipantName = e.Participant != null
                ? $"{e.Participant.FirstName} {e.Participant.LastName}".Trim()
                : null,
            CourseName = e.Offering?.Course?.Name,
            StatusName = e.Status?.Name
        };
    }
}
