// Models/Project.cs
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TimeCheckScheduleReact.Models
{
    public class Project
    {
        public int Id { get; set; }

        public string Name { get; set; }

        // Внешний ключ на User
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        // Навигационное свойство для задач
        public ICollection<TaskItem> TaskItems { get; set; }
    }
}
