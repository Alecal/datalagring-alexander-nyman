using Membler.Domain.Entities;
using Membler.Domain.Interfaces;
using Membler.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Membler.Infrastructure.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly MemblerDbContext _dbContext;

    public CourseRepository(MemblerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CourseEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Courses
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<CourseEntity>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Courses.ToListAsync(cancellationToken);
    }

    // Räkna antal kurser med rå SQL
    public async Task<int> GetCountAsync(CancellationToken cancellationToken = default)
    {
        var result = await _dbContext.Database
            .SqlQueryRaw<long>("SELECT COUNT(*) AS \"Value\" FROM \"Courses\"")
            .SingleAsync(cancellationToken);

        return (int)result;
    }

    public async Task AddAsync(CourseEntity course, CancellationToken cancellationToken = default)
    {
        await _dbContext.Courses.AddAsync(course, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(CourseEntity course, CancellationToken cancellationToken = default)
    {
        _dbContext.Courses.Update(course);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(CourseEntity course, CancellationToken cancellationToken = default)
    {
        _dbContext.Courses.Remove(course);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}