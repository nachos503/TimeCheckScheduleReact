// Models/User.cs
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TimeCheckScheduleReact.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Email { get; set; }

        // Навигационное свойство для проектов
        public ICollection<Project> Projects { get; set; }
    }
}
