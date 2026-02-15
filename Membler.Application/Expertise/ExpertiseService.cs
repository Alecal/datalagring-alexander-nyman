using Membler.Application.DTO;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;

namespace Membler.Application.Expertise;

public class ExpertiseService
{
    private readonly IExpertiseRepository _expertises;

    public ExpertiseService(IExpertiseRepository expertises)
    {
        _expertises = expertises;
    }

    public async Task<ExpertiseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _expertises.GetByIdAsync(id, cancellationToken);
        return entity is null ? null : new ExpertiseDto { Id = entity.Id, Subject = entity.Subject };
    }

    public async Task<IReadOnlyList<ExpertiseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var entities = await _expertises.GetAllAsync(cancellationToken);
        return entities.Select(e => new ExpertiseDto { Id = e.Id, Subject = e.Subject }).ToList();
    }

    public async Task<ExpertiseDto> CreateAsync(CreateExpertiseRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new ExpertiseEntity
        {
            Id = Guid.NewGuid(),
            Subject = request.Subject.Trim()
        };
        await _expertises.AddAsync(entity, cancellationToken);
        return new ExpertiseDto { Id = entity.Id, Subject = entity.Subject };
    }

    public async Task<ExpertiseDto?> UpdateAsync(Guid id, ExpertiseDto request, CancellationToken cancellationToken = default)
    {
        var entity = await _expertises.GetByIdAsync(id, cancellationToken);
        if (entity is null) return null;
        entity.Subject = request.Subject.Trim();
        await _expertises.UpdateAsync(entity, cancellationToken);
        return new ExpertiseDto { Id = entity.Id, Subject = entity.Subject };
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _expertises.GetByIdAsync(id, cancellationToken);
        if (entity is null) return false;
        await _expertises.DeleteAsync(entity, cancellationToken);
        return true;
    }
}
