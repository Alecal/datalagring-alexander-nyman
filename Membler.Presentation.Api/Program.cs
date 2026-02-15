using Membler.Application.DTO;

using Membler.Application.CourseOfferings;
using Membler.Application.Courses;
using Membler.Application.Enrollments;
using Membler.Application.Instructors;
using Membler.Application.Users;

using Membler.Domain.Interfaces;
using Membler.Infrastructure.Data;
using Membler.Infrastructure.Repositories;

using System.Text.Json;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// JSON med camelCase så att frontend får id, name, userId osv.
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

// USER
builder.Services.AddScoped<IUserRepository, UserRepository>();
// INSTRUCTOR
builder.Services.AddScoped<IInstructorRepository, InstructorRepository>();
// COURSE
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
// COURSE OFFERING
builder.Services.AddScoped<ICourseOfferingRepository, CourseOfferingRepository>();
// ENROLLMENT
builder.Services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();

builder.Services.AddScoped<CourseService>();
builder.Services.AddScoped<EnrollmentService>();
builder.Services.AddScoped<CourseOfferingService>();
builder.Services.AddScoped<InstructorService>();
builder.Services.AddScoped<UserService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

builder.Services.AddDbContext<MemblerDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("MemblerDatabase"),
        sql => sql.MigrationsAssembly("Membler.Infrastructure")
    );
});

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

//                       USERS API ENDPOINTS
// GET /api/users
app.MapGet("/api/users", async (UserService service) =>
{
    var users = await service.GetAllAsync();
    return Results.Ok(users);
});


// POST /api/users
app.MapPost("/api/users", async (UserService service, CreateUserRequest request) =>
{
    var created = await service.CreateAsync(request);
    return Results.Created($"/api/users/{created.Id}", created);
});


// GET /api/users/{id} - HÄMTA MED ID!
app.MapGet("/api/users/{id:guid}", async (UserService service, Guid id) =>
{
    var user = await service.GetByIdAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});


// PUT /api/users/{id} - UPPDATERA MED ID!
app.MapPut("/api/users/{id:guid}", async (UserService service, Guid id, UserDto request) =>
{
    var updated = await service.UpdateAsync(id, request);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});


// DELETE /api/users/{id} - TA BORT MED ID!
app.MapDelete("/api/users/{id:guid}", async (UserService service, Guid id) =>
{
    var deleted = await service.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

// GET /api/instructors
app.MapGet("/api/instructors", async (InstructorService service) =>
{
    var list = await service.GetAllAsync();
    return Results.Ok(list);
});

// POST /api/instructors – GÖR EN ANVÄNDARE TILL LÄRARE
app.MapPost("/api/instructors", async (InstructorService service, CreateInstructorRequest request) =>
{
    var created = await service.CreateAsync(request.UserId);
    return created is null ? Results.BadRequest("Användaren finns inte eller är redan registrerad som lärare.") : Results.Created($"/api/instructors/{created.UserId}", created);
});

//                        COURSES API ENDPOINTS
// GET /api/courses
app.MapGet("/api/courses", async (CourseService service) =>
{
    var courses = await service.GetAllAsync();
    return Results.Ok(courses);
});

// GET /api/courses/{id}
app.MapGet("/api/courses/{id:guid}", async (CourseService service, Guid id) =>
{
    var course = await service.GetByIdAsync(id);
    return course is null ? Results.NotFound() : Results.Ok(course);
});

// POST /api/courses
app.MapPost("/api/courses", async (CourseService service, CreateCourseRequest request) =>
{
    var created = await service.CreateAsync(request);
    return Results.Created($"/api/courses/{created.Id}", created);
});

// PUT /api/courses/{id}
app.MapPut("/api/courses/{id:guid}", async (CourseService service, Guid id, CourseDto request) =>
{
    var updated = await service.UpdateAsync(id, request);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

// DELETE /api/courses/{id}
app.MapDelete("/api/courses/{id:guid}", async (CourseService service, Guid id) =>
{
    var deleted = await service.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

//                        COURSE OFFERINGS API ENDPOINTS
app.MapGet("/api/course-offerings", async (CourseOfferingService service) =>
{
    var list = await service.GetAllAsync();
    return Results.Ok(list);
});

app.MapGet("/api/course-offerings/{id:guid}", async (CourseOfferingService service, Guid id) =>
{
    var offering = await service.GetByIdAsync(id);
    return offering is null ? Results.NotFound() : Results.Ok(offering);
});

app.MapPost("/api/course-offerings", async (CourseOfferingService service, CreateCourseOfferingRequest request) =>
{
    var created = await service.CreateAsync(request);
    return Results.Created($"/api/course-offerings/{created.Id}", created);
});

app.MapPut("/api/course-offerings/{id:guid}", async (CourseOfferingService service, Guid id, CourseOfferingDto request) =>
{
    var updated = await service.UpdateAsync(id, request);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

app.MapDelete("/api/course-offerings/{id:guid}", async (CourseOfferingService service, Guid id) =>
{
    var deleted = await service.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

//                        ENROLLMENTS API ENDPOINTS
app.MapGet("/api/enrollments", async (EnrollmentService service) =>
{
    var list = await service.GetAllAsync();
    return Results.Ok(list);
});

app.MapGet("/api/enrollments/{id:guid}", async (EnrollmentService service, Guid id) =>
{
    var enrollment = await service.GetByIdAsync(id);
    return enrollment is null ? Results.NotFound() : Results.Ok(enrollment);
});

app.MapGet("/api/course-offerings/{offeringId:guid}/enrollments", async (EnrollmentService service, Guid offeringId) =>
{
    var list = await service.GetByOfferingIdAsync(offeringId);
    return Results.Ok(list);
});

app.MapPost("/api/enrollments", async (EnrollmentService service, CreateEnrollmentRequest request) =>
{
    var created = await service.CreateAsync(request);
    if (created is null)
        return Results.BadRequest("Kurstillfället finns inte, är fullt eller deltagaren är redan registrerad.");
    return Results.Created($"/api/enrollments/{created.Id}", created);
});

app.MapPut("/api/enrollments/{id:guid}", async (EnrollmentService service, Guid id, EnrollmentDto request) =>
{
    var updated = await service.UpdateAsync(id, request);
    return updated is null ? Results.NotFound() : Results.Ok(updated);
});

app.MapDelete("/api/enrollments/{id:guid}", async (EnrollmentService service, Guid id) =>
{
    var deleted = await service.DeleteAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound();
});

app.Run();
