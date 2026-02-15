using Membler.Application.DTO;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;

namespace Membler.Application.CourseOfferings;
public class CourseOfferingService
{
    private readonly ICourseOfferingRepository _offerings;

    public CourseOfferingService(ICourseOfferingRepository offerings)
    {
        _offerings = offerings;
    }

    public async Task<CourseOfferingDto?> GetByIdAsync(Guid id)
    {
        var offering = await _offerings.GetByIdAsync(id);
        if (offering is null) return null;
        return MapToDto(offering);
    }

    public async Task<IReadOnlyList<CourseOfferingDto>> GetAllAsync()
    {
        var entities = await _offerings.GetAllAsync();
        return entities.Select(MapToDto).ToList();
    }

    public async Task<CourseOfferingDto> CreateAsync(CreateCourseOfferingRequest request)
    {
        var offering = new CourseOfferingEntity
        {
            Id = Guid.NewGuid(),
            CourseId = request.CourseId,
            InstructorId = request.InstructorId,
            MaxCapacity = request.MaxCapacity,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };
        await _offerings.AddAsync(offering);
        return MapToDto(offering);
    }

    public async Task<CourseOfferingDto?> UpdateAsync(Guid id, CourseOfferingDto request)
    {
        var offering = await _offerings.GetByIdAsync(id);
        if (offering is null) return null;

        offering.CourseId = request.CourseId;
        offering.InstructorId = request.InstructorId;
        offering.MaxCapacity = request.MaxCapacity;
        offering.StartDate = request.StartDate;
        offering.EndDate = request.EndDate;

        await _offerings.UpdateAsync(offering);
        return MapToDto(offering);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var offering = await _offerings.GetByIdAsync(id);
        if (offering is null) return false;
        await _offerings.DeleteAsync(offering);
        return true;
    }

    private static CourseOfferingDto MapToDto(CourseOfferingEntity o)
    {
        return new CourseOfferingDto
        {
            Id = o.Id,
            CourseId = o.CourseId,
            InstructorId = o.InstructorId,
            MaxCapacity = o.MaxCapacity,
            StartDate = o.StartDate,
            EndDate = o.EndDate,
            CourseName = o.Course?.Name,
            InstructorName = o.Instructor?.User != null
                ? $"{o.Instructor.User.FirstName} {o.Instructor.User.LastName}".Trim()
                : null
        };
    }
}
