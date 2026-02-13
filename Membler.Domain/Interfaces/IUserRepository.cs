using Membler.Domain.Entities;

public interface IUserRepository
{
    Task<UserEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    
    Task<IReadOnlyList<UserEntity>> GetAllAsync(CancellationToken cancellationToken = default);
   
    Task AddAsync(UserEntity user, CancellationToken cancellationToken = default);
    Task UpdateAsync(UserEntity user, CancellationToken cancellationToken = default);
    Task DeleteAsync(UserEntity user, CancellationToken cancellationToken = default);
}