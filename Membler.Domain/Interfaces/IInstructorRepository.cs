using Membler.Domain.Entities;
namespace Membler.Domain.Interfaces;

public interface IInstructorRepository
{
    Task<InstructorEntity?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InstructorEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(InstructorEntity instructor, CancellationToken cancellationToken = default);
}