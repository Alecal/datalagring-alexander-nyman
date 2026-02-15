using Membler.Application.DTO;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;

namespace Membler.Application.Users;


// LÄGG TILL ERROR HANDLING!


public class UserService
{
    private readonly IUserRepository _users;
    private readonly IInstructorRepository _instructors;
    private readonly IExpertiseRepository _expertises;
    private readonly IUnitOfWork _unitOfWork;

    public UserService(IUserRepository users, IInstructorRepository instructors, IExpertiseRepository expertises, IUnitOfWork unitOfWork)
    {
        _users = users;
        _instructors = instructors;
        _expertises = expertises;
        _unitOfWork = unitOfWork;
    }

    // HÄMTA EN ANVÄNDARE MED ID
    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await _users.GetByIdAsync(id);
        if (user is null) return null;

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            CreatedAt = user.CreatedAt,
            IsInstructor = user.Instructor != null,
            Bio = user.Instructor?.Bio
        };
    }

    // HÄMTA ALLA ANVÄNDARE
    public async Task<IReadOnlyList<UserDto>> GetAllAsync()
    {
        var entities = await _users.GetAllAsync();

        return entities
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                CreatedAt = u.CreatedAt,
                IsInstructor = u.Instructor != null,
                Bio = u.Instructor?.Bio
            })
            .ToList();
    }

    // SKAPA NY ANVÄNDARE OCH EVENTUELLT LÄRARE
    public async Task<UserDto> CreateAsync(CreateUserRequest request)
    {
        await using var tx = await _unitOfWork.BeginTransactionAsync();
        try
        {
            var user = new UserEntity
            {
                Id = Guid.NewGuid(),
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow
            };

            await _users.AddAsync(user);

            if (request.IsInstructor)
            {
                var expertiseList = request.ExpertiseIds?.Count > 0
                    ? await _expertises.GetByIdsAsync(request.ExpertiseIds)
                    : new List<ExpertiseEntity>();
                var instructor = new InstructorEntity
                {
                    UserId = user.Id,
                    Bio = request.Bio
                };
                foreach (var e in expertiseList)
                    instructor.Expertises.Add(e);

                await _instructors.AddAsync(instructor);
            }

            await tx.CommitAsync();
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt,
                IsInstructor = request.IsInstructor,
                Bio = request.Bio
            };
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    // UPPDATERA EN ANVÄNDARE
    public async Task<UserDto?> UpdateAsync(Guid id, UserDto request)
    {
        var user = await _users.GetByIdAsync(id);
        if (user is null) return null;

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;

        await _users.UpdateAsync(user);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            CreatedAt = user.CreatedAt
        };
    }

    // TA BORT ANVÄNDARE
    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await _users.GetByIdAsync(id);
        if (user is null) return false;

        await _users.DeleteAsync(user);
        return true;
    }
}