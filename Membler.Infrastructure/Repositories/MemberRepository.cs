using Dapper;
using Membler.Domain.Entities;
using Membler.Domain.Models;
using Membler.Infrastructure.Data;

namespace Membler.Infrastructure.Repositories;

public sealed class MemberRepository(SqlConnectionFactory factory)
{
    public async Task<Member> CreateAsync(CreateMemberDto member, CancellationToken ct)
    {
        await using var conn = await factory.CreateOpenConnectionAsync(ct);

                string query = """
            INSERT INTO users (first_name, last_name, email, is_instructor)
            VALUES (@FirstName, @LastName, @Email, @IsInstructor)
            RETURNING 
                id, 
                first_name AS FirstName, 
                last_name AS LastName, 
                email AS Email, 
                is_instructor AS IsInstructor
            """;

        return await conn.QuerySingleAsync<Member>(query, member);
    }
}