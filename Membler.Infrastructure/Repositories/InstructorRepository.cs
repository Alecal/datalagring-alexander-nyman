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
            .Include(i => i.Expertises)
            .FirstOrDefaultAsync(i => i.UserId == userId, cancellationToken);
    }

    public async Task<IReadOnlyList<InstructorEntity>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Instructors
            .Include(i => i.User)
            .Include(i => i.Expertises)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(InstructorEntity instructor, CancellationToken cancellationToken = default)
    {
        await _dbContext.Instructors.AddAsync(instructor, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(InstructorEntity instructor, CancellationToken cancellationToken = default)
    {
        _dbContext.Instructors.Update(instructor);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(InstructorEntity instructor, CancellationToken cancellationToken = default)
    {
        _dbContext.Instructors.Remove(instructor);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}