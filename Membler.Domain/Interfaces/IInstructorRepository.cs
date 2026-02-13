using Membler.Domain.Entities;

namespace Membler.Domain.Interfaces;

public interface IInstructorRepository
{
    Task AddAsync(InstructorEntity instructor, CancellationToken cancellationToken = default);
}