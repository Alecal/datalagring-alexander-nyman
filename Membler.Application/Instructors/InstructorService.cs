using Membler.Application.DTO;
using Membler.Domain.Interfaces;

namespace Membler.Application.Instructors;

public class InstructorService
{
    private readonly IInstructorRepository _instructors;

    public InstructorService(IInstructorRepository instructors)
    {
        _instructors = instructors;
    }

    public async Task<IReadOnlyList<InstructorDto>> GetAllAsync()
    {
        var entities = await _instructors.GetAllAsync();
        return entities
            .Select(i => new InstructorDto
            {
                UserId = i.UserId,
                FirstName = i.User.FirstName,
                LastName = i.User.LastName
            })
            .ToList();
    }
}
