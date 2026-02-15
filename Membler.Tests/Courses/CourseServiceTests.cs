using Membler.Application.Courses;
using Membler.Application.DTO;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;
using Moq;
using Xunit;

namespace Membler.Tests.Courses;

public class CourseServiceTests
{
    private readonly Mock<ICourseRepository> _coursesMock;
    private readonly CourseService _sut;

    public CourseServiceTests()
    {
        _coursesMock = new Mock<ICourseRepository>();
        _sut = new CourseService(_coursesMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenCourseNotFound_ReturnsNull()
    {
        var id = Guid.NewGuid();
        _coursesMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((CourseEntity?)null);

        var result = await _sut.GetByIdAsync(id);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_WhenCourseExists_ReturnsCourseDto()
    {
        var id = Guid.NewGuid();
        var entity = new CourseEntity
        {
            Id = id,
            Name = "C#",
            Description = "Grundläggande programmering"
        };
        _coursesMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(entity);

        var result = await _sut.GetByIdAsync(id);

        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
        Assert.Equal("C#", result.Name);
        Assert.Equal("Grundläggande programmering", result.Description);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoCourses_ReturnsEmptyList()
    {
        _coursesMock
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(Array.Empty<CourseEntity>());

        var result = await _sut.GetAllAsync();

        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task CreateAsync_ReturnsExpectedDto()
    {
        var request = new CreateCourseRequest
        {
            Name = "React",
            Description = "Javascript"
        };
        _coursesMock
            .Setup(r => r.AddAsync(It.IsAny<CourseEntity>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var result = await _sut.CreateAsync(request);

        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("React", result.Name);
        Assert.Equal("Javascript", result.Description);
    }

    [Fact]
    public async Task DeleteAsync_WhenCourseNotFound_ReturnsFalse()
    {
        var id = Guid.NewGuid();
        _coursesMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((CourseEntity?)null);

        var result = await _sut.DeleteAsync(id);

        Assert.False(result);
        _coursesMock.Verify(r => r.DeleteAsync(It.IsAny<CourseEntity>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
