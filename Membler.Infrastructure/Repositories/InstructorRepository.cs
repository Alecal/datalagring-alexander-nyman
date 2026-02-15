using Membler.Domain.Entities;
using Membler.Domain.Interfaces;
using Membler.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Membler.Infrastructure.Repositories;

public class InstructorRepository : IInstructorRepository
{
    private readonly MemblerDbContext _dbContext;

    public InstructorRepository(MemblerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<InstructorEntity?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Instructors
            .Include(i => i.User)
            .FirstOrDefaultAsync(i => i.UserId == userId, cancellationToken);
    }

    public async Task<IReadOnlyList<InstructorEntity>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Instructors
            .Include(i => i.User)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(InstructorEntity instructor, CancellationToken cancellationToken = default)
    {
        await _dbContext.Instructors.AddAsync(instructor, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}