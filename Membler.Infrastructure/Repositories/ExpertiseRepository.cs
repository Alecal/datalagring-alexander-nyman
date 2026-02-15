using Membler.Domain.Entities;
using Membler.Domain.Interfaces;
using Membler.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Membler.Infrastructure.Repositories;

public class ExpertiseRepository : IExpertiseRepository
{
    private readonly MemblerDbContext _dbContext;

    public ExpertiseRepository(MemblerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ExpertiseEntity>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Expertises
            .OrderBy(e => e.Subject)
            .ToListAsync(cancellationToken);
    }

    public async Task<ExpertiseEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Expertises.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IReadOnlyList<ExpertiseEntity>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
    {
        var idList = ids.ToList();
        if (idList.Count == 0) return Array.Empty<ExpertiseEntity>();
        return await _dbContext.Expertises
            .Where(e => idList.Contains(e.Id))
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(ExpertiseEntity expertise, CancellationToken cancellationToken = default)
    {
        await _dbContext.Expertises.AddAsync(expertise, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(ExpertiseEntity expertise, CancellationToken cancellationToken = default)
    {
        _dbContext.Expertises.Update(expertise);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(ExpertiseEntity expertise, CancellationToken cancellationToken = default)
    {
        _dbContext.Expertises.Remove(expertise);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
