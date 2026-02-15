using Membler.Application.Courses;
using Membler.Application.DTO;
using Membler.Infrastructure.Data;
using Membler.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Membler.Tests.Api;

public class CoursesApiIntegrationTests
{
    private static (MemblerDbContext Db, CourseService Service) CreateService()
    {
        var options = new DbContextOptionsBuilder<MemblerDbContext>()
            .UseInMemoryDatabase("MemblerIntegrationTestDb_" + Guid.NewGuid().ToString("N"))
            .Options;

        var db = new MemblerDbContext(options);
        var repository = new CourseRepository(db);
        var service = new CourseService(repository);
        return (db, service);
    }

    [Fact]
    public async Task GetCourses_ReturnsOkAndListStructure()
    {
        var (db, courseService) = CreateService();
        await using (db)
        {
            await db.Database.EnsureCreatedAsync();

            var result = await courseService.GetAllAsync();

            Assert.NotNull(result);
            Assert.IsAssignableFrom<IReadOnlyList<CourseDto>>(result);
            Assert.Empty(result);
        }
    }

    [Fact]
    public async Task CreateCourse_ThenGetAll_ReturnsExpectedCourse()
    {
        var (db, courseService) = CreateService();
        await using (db)
        {
            await db.Database.EnsureCreatedAsync();

            var created = await courseService.CreateAsync(new CreateCourseRequest
            {
                Name = "Integrationstest-kurs",
                Description = "Skapad i integrationstest"
            });

            Assert.NotNull(created);
            Assert.NotEqual(Guid.Empty, created.Id);
            Assert.Equal("Integrationstest-kurs", created.Name);

            var all = await courseService.GetAllAsync();
            Assert.Single(all);
            Assert.Equal(created.Id, all[0].Id);
            Assert.Equal("Integrationstest-kurs", all[0].Name);
        }
    }
}
