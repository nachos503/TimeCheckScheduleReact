// Models/TaskItem.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TimeCheckScheduleReact.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public DateTime Date { get; set; }

        // Внешний ключ к пользователю
        public int UserId { get; set; }

        // Навигационное свойство к пользователю
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
