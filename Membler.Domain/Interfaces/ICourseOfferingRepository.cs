using Membler.Domain.Entities;

namespace Membler.Domain.Interfaces;

public interface ICourseOfferingRepository
{
    Task<CourseOfferingEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<CourseOfferingEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(CourseOfferingEntity offering, CancellationToken cancellationToken = default);
    Task UpdateAsync(CourseOfferingEntity offering, CancellationToken cancellationToken = default);
    Task DeleteAsync(CourseOfferingEntity offering, CancellationToken cancellationToken = default);
}
