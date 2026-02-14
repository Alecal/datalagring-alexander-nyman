using Membler.Application.DTO;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;

namespace Membler.Application.Courses;

public class CourseService
{
    private readonly ICourseRepository _courses;

    public CourseService(ICourseRepository courses)
    {
        _courses = courses;
    }

    // HÄMTA EN KURS MED ID
    public async Task<CourseDto?> GetByIdAsync(Guid id)
    {
        var course = await _courses.GetByIdAsync(id);
        if (course is null) return null;

        return new CourseDto
        {
            Id = course.Id,
            Name = course.Name,
            Description = course.Description
        };
    }

    // HÄMTA ALLA KURSER
    public async Task<IReadOnlyList<CourseDto>> GetAllAsync()
    {
        var entities = await _courses.GetAllAsync();

        return entities
            .Select(c => new CourseDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            })
            .ToList();
    }

    // SKAPA NY KURS
    public async Task<CourseDto> CreateAsync(CourseDto request)
    {
        var course = new CourseEntity
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description
        };

        await _courses.AddAsync(course);

        return new CourseDto
        {
            Id = course.Id,
            Name = course.Name,
            Description = course.Description
        };
    }

    // UPPDATERA EN KURS
    public async Task<CourseDto?> UpdateAsync(Guid id, CourseDto request)
    {
        var course = await _courses.GetByIdAsync(id);
        if (course is null) return null;

        course.Name = request.Name;
        course.Description = request.Description;

        await _courses.UpdateAsync(course);

        return new CourseDto
        {
            Id = course.Id,
            Name = course.Name,
            Description = course.Description
        };
    }

    // TA BORT KURS
    public async Task<bool> DeleteAsync(Guid id)
    {
        var course = await _courses.GetByIdAsync(id);
        if (course is null) return false;

        await _courses.DeleteAsync(course);
        return true;
    }
}