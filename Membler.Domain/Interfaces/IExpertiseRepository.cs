using Membler.Domain.Entities;

namespace Membler.Domain.Interfaces;

public interface IExpertiseRepository
{
    Task<ExpertiseEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ExpertiseEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ExpertiseEntity>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default);
    Task AddAsync(ExpertiseEntity expertise, CancellationToken cancellationToken = default);
    Task UpdateAsync(ExpertiseEntity expertise, CancellationToken cancellationToken = default);
    Task DeleteAsync(ExpertiseEntity expertise, CancellationToken cancellationToken = default);
}
