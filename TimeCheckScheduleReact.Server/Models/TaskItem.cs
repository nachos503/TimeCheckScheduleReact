using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TimeCheckScheduleReact.Models;

public class TaskItem
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; }

    public string Description { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public DateTime Date { get; set; }

    public int ProjectId { get; set; }

    [ForeignKey("ProjectId")]
    public Project Project { get; set; }

    public string? ProjectName { get; set; } // Сделать необязательным

    public ICollection<TimeEntry> TimeEntries { get; set; }
}
