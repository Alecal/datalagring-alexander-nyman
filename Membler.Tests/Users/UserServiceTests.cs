using Membler.Application.DTO;
using Membler.Application.Users;
using Membler.Domain.Entities;
using Membler.Domain.Interfaces;
using Moq;
using Xunit;

namespace Membler.Tests.Users;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _usersMock;
    private readonly Mock<IInstructorRepository> _instructorsMock;
    private readonly Mock<IExpertiseRepository> _expertisesMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly UserService _sut;

    public UserServiceTests()
    {
        _usersMock = new Mock<IUserRepository>();
        _instructorsMock = new Mock<IInstructorRepository>();
        _expertisesMock = new Mock<IExpertiseRepository>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        var txMock = new Mock<ITransaction>();
        txMock.Setup(t => t.CommitAsync(It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);
        txMock.Setup(t => t.RollbackAsync(It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);
        txMock.Setup(t => t.DisposeAsync()).Returns(ValueTask.CompletedTask);
        _unitOfWorkMock.Setup(u => u.BeginTransactionAsync(It.IsAny<CancellationToken>())).ReturnsAsync(txMock.Object);
        _sut = new UserService(_usersMock.Object, _instructorsMock.Object, _expertisesMock.Object, _unitOfWorkMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_WhenNoUsers_ReturnsEmptyList()
    {
        _usersMock
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(Array.Empty<UserEntity>());

        var result = await _sut.GetAllAsync();

        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetAllAsync_WhenUsersExist_ReturnsMappedDtos()
    {
        var id = Guid.NewGuid();
        var createdAt = DateTime.UtcNow.AddDays(-1);
        var entities = new List<UserEntity>
        {
            new UserEntity
            {
                Id = id,
                Email = "anna@example.com",
                FirstName = "Anna",
                LastName = "Andersson",
                CreatedAt = createdAt,
                Instructor = null
            }
        };
        _usersMock
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(entities);

        var result = await _sut.GetAllAsync();

        Assert.Single(result);
        var dto = result[0];
        Assert.Equal(id, dto.Id);
        Assert.Equal("anna@example.com", dto.Email);
        Assert.Equal("Anna", dto.FirstName);
        Assert.Equal("Andersson", dto.LastName);
        Assert.Equal(createdAt, dto.CreatedAt);
        Assert.False(dto.IsInstructor);
        Assert.Null(dto.Bio);
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserNotFound_ReturnsNull()
    {
        var id = Guid.NewGuid();
        _usersMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((UserEntity?)null);

        var result = await _sut.GetByIdAsync(id);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserExists_ReturnsUserDto()
    {
        var id = Guid.NewGuid();
        var createdAt = DateTime.UtcNow;
        var user = new UserEntity
        {
            Id = id,
            Email = "erik@example.com",
            FirstName = "Erik",
            LastName = "Eriksson",
            CreatedAt = createdAt,
            Instructor = null
        };
        _usersMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var result = await _sut.GetByIdAsync(id);

        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
        Assert.Equal("erik@example.com", result.Email);
        Assert.Equal("Erik", result.FirstName);
        Assert.Equal("Eriksson", result.LastName);
        Assert.Equal(createdAt, result.CreatedAt);
        Assert.False(result.IsInstructor);
    }

    [Fact]
    public async Task DeleteAsync_WhenUserNotFound_ReturnsFalse()
    {
        var id = Guid.NewGuid();
        _usersMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((UserEntity?)null);

        var result = await _sut.DeleteAsync(id);

        Assert.False(result);
        _usersMock.Verify(r => r.DeleteAsync(It.IsAny<UserEntity>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_WhenUserExists_DeletesAndReturnsTrue()
    {
        var id = Guid.NewGuid();
        var user = new UserEntity
        {
            Id = id,
            Email = "delete@example.com",
            FirstName = "Delete",
            LastName = "Me",
            CreatedAt = DateTime.UtcNow
        };
        _usersMock
            .Setup(r => r.GetByIdAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        var result = await _sut.DeleteAsync(id);

        Assert.True(result);
        _usersMock.Verify(r => r.DeleteAsync(user, It.IsAny<CancellationToken>()), Times.Once);
    }
}
