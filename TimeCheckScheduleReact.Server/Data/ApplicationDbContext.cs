// Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using TimeCheckScheduleReact.Models;

namespace TimeCheckScheduleReact.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<TimeEntry> TimeEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Уникальный индекс на Username
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Связь User - Projects
            modelBuilder.Entity<Project>()
                .HasOne(p => p.User)
                .WithMany(u => u.Projects)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Связь Project - TaskItems
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.Project)
                .WithMany(p => p.TaskItems)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // Связь TaskItem - TimeEntries
            modelBuilder.Entity<TimeEntry>()
                .HasOne(te => te.TaskItem)
                .WithMany(t => t.TimeEntries)
                .HasForeignKey(te => te.TaskItemId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
