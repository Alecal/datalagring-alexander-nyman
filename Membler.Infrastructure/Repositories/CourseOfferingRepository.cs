using Membler.Domain.Entities;
using Membler.Domain.Interfaces;
using Membler.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Membler.Infrastructure.Repositories;

public class CourseOfferingRepository : ICourseOfferingRepository
{
    private readonly MemblerDbContext _dbContext;

    public CourseOfferingRepository(MemblerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CourseOfferingEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.CourseOfferings
            .Include(o => o.Course)
            .Include(o => o.Instructor)
                .ThenInclude(i => i.User)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<CourseOfferingEntity>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.CourseOfferings
            .Include(o => o.Course)
            .Include(o => o.Instructor)
                .ThenInclude(i => i.User)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(CourseOfferingEntity offering, CancellationToken cancellationToken = default)
    {
        await _dbContext.CourseOfferings.AddAsync(offering, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(CourseOfferingEntity offering, CancellationToken cancellationToken = default)
    {
        _dbContext.CourseOfferings.Update(offering);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(CourseOfferingEntity offering, CancellationToken cancellationToken = default)
    {
        _dbContext.CourseOfferings.Remove(offering);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
