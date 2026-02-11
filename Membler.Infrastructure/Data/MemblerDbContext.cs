using Microsoft.EntityFrameworkCore;
using Membler.Domain.Entities;

namespace Membler.Infrastructure.Data;

public sealed class MemblerDbContext : DbContext
{
    public MemblerDbContext(DbContextOptions<MemblerDbContext> options) : base(options) { }
    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<PhoneNumberEntity> PhoneNumbers => Set<PhoneNumberEntity>();
    public DbSet<InstructorEntity> Instructors => Set<InstructorEntity>();
    public DbSet<ExpertiseEntity> Expertises => Set<ExpertiseEntity>();
    public DbSet<CourseEntity> Courses => Set<CourseEntity>();
    public DbSet<CourseOfferingEntity> CourseOfferings => Set<CourseOfferingEntity>();
    public DbSet<LocationEntity> Locations => Set<LocationEntity>();
    public DbSet<LessonEntity> Lessons => Set<LessonEntity>();
    public DbSet<StatusEntity> Statuses => Set<StatusEntity>();
    public DbSet<EnrollmentEntity> Enrollments => Set<EnrollmentEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //ai använd för att hjälpa till att generera resterande kod baserad på ett kodstycke för att koppla ihop tabeller i databas/erd
        
        // sätter userId som pk (relation mellan user och instructor)
        modelBuilder.Entity<InstructorEntity>()
            .HasKey(i => i.UserId);

        modelBuilder.Entity<InstructorEntity>()
            .HasOne(i => i.User)
            .WithOne(u => u.Instructor)
            .HasForeignKey<InstructorEntity>(i => i.UserId);

        // m2m tabell för lärares expertisområden
        modelBuilder.Entity<InstructorEntity>()
            .HasMany(i => i.Expertises)
            .WithMany(e => e.Instructors)
            .UsingEntity(j => j.ToTable("instructor_expertise"));

        // ej samma kurstillfälle flera gånger
        modelBuilder.Entity<EnrollmentEntity>()
            .HasIndex(e => new { e.ParticipantId, e.OfferingId })
            .IsUnique();

        // kopplar kurstillfälle till endast en lärare
        modelBuilder.Entity<CourseOfferingEntity>()
            .HasOne(co => co.Instructor)
            .WithMany(i => i.CourseOfferings)
            .HasForeignKey(co => co.InstructorId);

        // kopplar lektioner till ett specifik kurstillfälle
        modelBuilder.Entity<LessonEntity>()
            .HasOne(l => l.Offering)
            .WithMany(o => o.Lessons)
            .HasForeignKey(l => l.OfferingId);

        base.OnModelCreating(modelBuilder);
    }
}