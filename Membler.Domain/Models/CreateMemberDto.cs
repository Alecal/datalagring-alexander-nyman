namespace Membler.Domain.Models;

public sealed record CreateMemberDto(
    string FirstName,
    string LastName,
    string Email,
    bool IsInstructor
);