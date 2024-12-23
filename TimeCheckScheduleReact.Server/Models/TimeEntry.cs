// Models/TimeEntry.cs
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TimeCheckScheduleReact.Models
{
    public class TimeEntry
    {
        public int Id { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        // Внешний ключ на TaskItem
        public int TaskItemId { get; set; }

        [ForeignKey("TaskItemId")]
        public TaskItem TaskItem { get; set; }
    }
}
