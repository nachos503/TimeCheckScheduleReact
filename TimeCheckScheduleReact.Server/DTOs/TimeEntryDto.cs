// DTOs/TimeEntryDto.cs
using System;

namespace TimeCheckScheduleReact.DTOs
{
    public class TimeEntryDto
    {
        public int Id { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int TaskItemId { get; set; }

        public string TaskTitle { get; set; }
    }
}
