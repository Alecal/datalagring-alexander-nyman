using Microsoft.Data.SqlClient;
namespace Membler.Infrastructure.Data;

public sealed class SqlConnectionFactory(string connectionString)
{
    public async Task<SqlConnection> CreateOpenConnectionAsync(CancellationToken cancellationToken = default)
    {
        var connection = new SqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
        return connection;
    }
}
