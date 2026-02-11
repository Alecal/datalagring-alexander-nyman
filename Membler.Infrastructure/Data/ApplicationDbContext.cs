using Microsoft.EntityFrameworkCore;
using Membler.Domain.Entities;

namespace Membler.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    public DbSet<User> Users => Set<User>();
    public DbSet<PhoneNumber> PhoneNumbers => Set<PhoneNumber>();
    public DbSet<Instructor> Instructors => Set<Instructor>();
    public DbSet<Expertise> Expertises => Set<Expertise>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<CourseOffering> CourseOfferings => Set<CourseOffering>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Status> Statuses => Set<Status>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //ai använd för att hjälpa till att generera resterande kod baserad på ett kodstycke för att koppla ihop tabeller i databas/erd
        
        // sätter userId som pk (relation mellan user och instructor)
        modelBuilder.Entity<Instructor>()
            .HasKey(i => i.UserId);

        modelBuilder.Entity<Instructor>()
            .HasOne(i => i.User)
            .WithOne(u => u.Instructor)
            .HasForeignKey<Instructor>(i => i.UserId);

        // m2m tabell för lärares expertisområden
        modelBuilder.Entity<Instructor>()
            .HasMany(i => i.Expertises)
            .WithMany(e => e.Instructors)
            .UsingEntity(j => j.ToTable("instructor_expertise"));

        // ej samma kurstillfälle flera gånger
        modelBuilder.Entity<Enrollment>()
            .HasIndex(e => new { e.ParticipantId, e.OfferingId })
            .IsUnique();

        // kopplar kurstillfälle till endast en lärare
        modelBuilder.Entity<CourseOffering>()
            .HasOne(co => co.Instructor)
            .WithMany(i => i.CourseOfferings)
            .HasForeignKey(co => co.InstructorId);

        // kopplar lektioner till ett specifik kurstillfälle
        modelBuilder.Entity<Lesson>()
            .HasOne(l => l.Offering)
            .WithMany(o => o.Lessons)
            .HasForeignKey(l => l.OfferingId);

        base.OnModelCreating(modelBuilder);
    }
}