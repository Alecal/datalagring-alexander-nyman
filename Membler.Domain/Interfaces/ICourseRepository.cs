using Membler.Domain.Entities;
namespace Membler.Domain.Interfaces;

public interface ICourseRepository
{
    Task<CourseEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<CourseEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(CourseEntity course, CancellationToken cancellationToken = default);
    Task UpdateAsync(CourseEntity course, CancellationToken cancellationToken = default);
    Task DeleteAsync(CourseEntity course, CancellationToken cancellationToken = default);
}