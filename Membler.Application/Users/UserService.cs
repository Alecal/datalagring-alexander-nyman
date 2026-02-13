using Membler.Application.DTO;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;

namespace Membler.Application.Users;


// LÄGG TILL ERROR HANDLING!


public class UserService
{
    private readonly IUserRepository _users;

    public UserService(IUserRepository users)
    {
        _users = users;
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
            CreatedAt = user.CreatedAt
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
                CreatedAt = u.CreatedAt
            })
            .ToList();
    }

    // SKAPA NY ANVÄNDARE
    public async Task<UserDto> CreateAsync(UserDto request)
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

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            CreatedAt = user.CreatedAt
        };
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