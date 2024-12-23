using System.ComponentModel.DataAnnotations;

public class TaskItemDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "The Title field is required.")]
    public string Title { get; set; }

    [Required(ErrorMessage = "The Description field is required.")]
    public string Description { get; set; }

    [Required(ErrorMessage = "The StartTime field is required.")]
    public DateTime StartTime { get; set; }

    [Required(ErrorMessage = "The EndTime field is required.")]
    public DateTime EndTime { get; set; }

    public DateTime Date { get; set; }

    [Required(ErrorMessage = "The ProjectId field is required.")]
    public int ProjectId { get; set; }

    // Поле не обязательно для ввода
    public string? ProjectName { get; set; }
}
