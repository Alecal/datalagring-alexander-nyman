using Membler.Application.DTO;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;

namespace Membler.Application.Instructors;

public class InstructorService
{
    private readonly IInstructorRepository _instructors;
    private readonly IUserRepository _users;
    private readonly IExpertiseRepository _expertises;

    public InstructorService(IInstructorRepository instructors, IUserRepository users, IExpertiseRepository expertises)
    {
        _instructors = instructors;
        _users = users;
        _expertises = expertises;
    }

    public async Task<InstructorDto?> GetByIdAsync(Guid userId)
    {
        var entity = await _instructors.GetByIdAsync(userId);
        return entity is null ? null : MapToDto(entity);
    }

    public async Task<IReadOnlyList<InstructorDto>> GetAllAsync()
    {
        var entities = await _instructors.GetAllAsync();
        return entities.Select(MapToDto).ToList();
    }


    /// gör en bef. användare till lärare

    public async Task<InstructorDto?> CreateAsync(Guid userId)
    {
        var user = await _users.GetByIdAsync(userId);
        if (user is null) return null;
        var existing = await _instructors.GetByIdAsync(userId);
        if (existing is not null) return null;

        var instructor = new InstructorEntity { UserId = userId };
        await _instructors.AddAsync(instructor);

        return new InstructorDto
        {
            UserId = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Bio = null
        };
    }

    public async Task<InstructorDto?> UpdateAsync(Guid userId, InstructorDto request)
    {
        var entity = await _instructors.GetByIdAsync(userId);
        if (entity is null) return null;
        entity.Bio = request.Bio;
        if (request.ExpertiseIds is not null)
        {
            entity.Expertises.Clear();
            if (request.ExpertiseIds.Count > 0)
            {
                var expertiseList = await _expertises.GetByIdsAsync(request.ExpertiseIds);
                foreach (var e in expertiseList)
                    entity.Expertises.Add(e);
            }
        }
        await _instructors.UpdateAsync(entity);
        return MapToDto(entity);
    }

    public async Task<bool> DeleteAsync(Guid userId)
    {
        var entity = await _instructors.GetByIdAsync(userId);
        if (entity is null) return false;
        await _instructors.DeleteAsync(entity);
        return true;
    }

    private static InstructorDto MapToDto(InstructorEntity i)
    {
        return new InstructorDto
        {
            UserId = i.UserId,
            FirstName = i.User.FirstName,
            LastName = i.User.LastName,
            Bio = i.Bio,
            Expertises = i.Expertises.Select(e => new ExpertiseDto { Id = e.Id, Subject = e.Subject }).ToList()
        };
    }
}
