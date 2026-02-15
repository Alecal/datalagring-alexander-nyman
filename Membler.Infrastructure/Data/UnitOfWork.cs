using Membler.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Membler.Infrastructure.Data;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly MemblerDbContext _context;

    public UnitOfWork(MemblerDbContext context) => _context = context;

    public async Task<ITransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        var tx = await _context.Database.BeginTransactionAsync(cancellationToken);
        return new EfTransaction(tx);
    }

    private sealed class EfTransaction : ITransaction
    {
        private readonly Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction _tx;

        public EfTransaction(Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction tx) => _tx = tx;

        public Task CommitAsync(CancellationToken cancellationToken = default) => _tx.CommitAsync(cancellationToken);
        public Task RollbackAsync(CancellationToken cancellationToken = default) => _tx.RollbackAsync(cancellationToken);
        public ValueTask DisposeAsync() => _tx.DisposeAsync();
    }
}
