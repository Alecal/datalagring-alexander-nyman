using Membler.Domain.Entities;
using Membler.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Membler.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly MemblerDbContext _dbContext;

    public UserRepository(MemblerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(UserEntity user, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users.AddAsync(user, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(UserEntity user, CancellationToken cancellationToken = default)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }



    public Task<IReadOnlyList<UserEntity>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<UserEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(UserEntity user, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

}