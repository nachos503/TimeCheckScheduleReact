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
        public DbSet<TaskItem> TaskItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ���������, ��� Username ��������
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // ��������� ����� ����� User � TaskItem
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.User)
                .WithMany(u => u.TaskItems)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
