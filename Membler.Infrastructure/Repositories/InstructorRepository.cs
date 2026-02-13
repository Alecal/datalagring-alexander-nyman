using Membler.Domain.Entities;
using Membler.Domain.Interfaces;
using Membler.Infrastructure.Data;

namespace Membler.Infrastructure.Repositories;

public class InstructorRepository : IInstructorRepository
{
    private readonly MemblerDbContext _dbContext;

    public InstructorRepository(MemblerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(InstructorEntity instructor, CancellationToken cancellationToken = default)
    {
        await _dbContext.Instructors.AddAsync(instructor, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}