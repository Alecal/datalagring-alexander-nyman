using Membler.Application.CourseOfferings;
using Membler.Application.DTO;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;
using Moq;
using Xunit;

namespace Membler.Tests.CourseOfferings;

public class CourseOfferingServiceTests
{
    private readonly Mock<ICourseOfferingRepository> _offeringsMock;
    private readonly CourseOfferingService _sut;

    public CourseOfferingServiceTests()
    {
        _offeringsMock = new Mock<ICourseOfferingRepository>();
        _sut = new CourseOfferingService(_offeringsMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenOfferingNotFound_ReturnsNull()
    {
        var id = Guid.NewGuid();
        _offeringsMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((CourseOfferingEntity?)null);

        var result = await _sut.GetByIdAsync(id);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_WhenOfferingExists_ReturnsDto()
    {
        var id = Guid.NewGuid();
        var courseId = Guid.NewGuid();
        var instructorId = Guid.NewGuid();
        var entity = new CourseOfferingEntity
        {
            Id = id,
            CourseId = courseId,
            InstructorId = instructorId,
            MaxCapacity = 25,
            StartDate = new DateOnly(2025, 9, 1),
            EndDate = new DateOnly(2025, 12, 15)
        };
        _offeringsMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(entity);

        var result = await _sut.GetByIdAsync(id);

        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
        Assert.Equal(courseId, result.CourseId);
        Assert.Equal(instructorId, result.InstructorId);
        Assert.Equal(25, result.MaxCapacity);
        Assert.Equal(new DateOnly(2025, 9, 1), result.StartDate);
        Assert.Equal(new DateOnly(2025, 12, 15), result.EndDate);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoOfferings_ReturnsEmptyList()
    {
        _offeringsMock
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(Array.Empty<CourseOfferingEntity>());

        var result = await _sut.GetAllAsync();

        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task CreateAsync_ReturnsExpectedDto()
    {
        var request = new CreateCourseOfferingRequest
        {
            CourseId = Guid.NewGuid(),
            InstructorId = Guid.NewGuid(),
            MaxCapacity = 30,
            StartDate = new DateOnly(2025, 1, 10),
            EndDate = new DateOnly(2025, 6, 10)
        };
        _offeringsMock
            .Setup(r => r.AddAsync(It.IsAny<CourseOfferingEntity>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var result = await _sut.CreateAsync(request);

        Assert.NotNull(result);
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal(request.CourseId, result.CourseId);
        Assert.Equal(request.InstructorId, result.InstructorId);
        Assert.Equal(30, result.MaxCapacity);
        Assert.Equal(request.StartDate, result.StartDate);
        Assert.Equal(request.EndDate, result.EndDate);
    }

    [Fact]
    public async Task DeleteAsync_WhenOfferingNotFound_ReturnsFalse()
    {
        var id = Guid.NewGuid();
        _offeringsMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((CourseOfferingEntity?)null);

        var result = await _sut.DeleteAsync(id);

        Assert.False(result);
        _offeringsMock.Verify(r => r.DeleteAsync(It.IsAny<CourseOfferingEntity>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
