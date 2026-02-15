using Membler.Domain.Entities;
using Membler.Domain.Interfaces;
using Membler.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Membler.Infrastructure.Repositories;

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly MemblerDbContext _dbContext;

    public EnrollmentRepository(MemblerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<EnrollmentEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Enrollments
            .Include(e => e.Participant)
            .Include(e => e.Offering)
                .ThenInclude(o => o.Course)
            .Include(e => e.Status)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<EnrollmentEntity>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Enrollments
            .Include(e => e.Participant)
            .Include(e => e.Offering)
                .ThenInclude(o => o.Course)
            .Include(e => e.Status)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<EnrollmentEntity>> GetByOfferingIdAsync(Guid offeringId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Enrollments
            .Include(e => e.Participant)
            .Include(e => e.Offering)
                .ThenInclude(o => o.Course)
            .Include(e => e.Status)
            .Where(e => e.OfferingId == offeringId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(EnrollmentEntity enrollment, CancellationToken cancellationToken = default)
    {
        await _dbContext.Enrollments.AddAsync(enrollment, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(EnrollmentEntity enrollment, CancellationToken cancellationToken = default)
    {
        _dbContext.Enrollments.Update(enrollment);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(EnrollmentEntity enrollment, CancellationToken cancellationToken = default)
    {
        _dbContext.Enrollments.Remove(enrollment);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
