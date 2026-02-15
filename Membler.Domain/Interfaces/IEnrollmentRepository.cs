using Membler.Domain.Entities;

namespace Membler.Domain.Interfaces;

public interface IEnrollmentRepository
{
    Task<EnrollmentEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EnrollmentEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EnrollmentEntity>> GetByOfferingIdAsync(Guid offeringId, CancellationToken cancellationToken = default);
    Task AddAsync(EnrollmentEntity enrollment, CancellationToken cancellationToken = default);
    Task UpdateAsync(EnrollmentEntity enrollment, CancellationToken cancellationToken = default);
    Task DeleteAsync(EnrollmentEntity enrollment, CancellationToken cancellationToken = default);
}
