namespace TimeCheckScheduleReact.DTOs
{
    public class TaskItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime Date { get; set; }
        // Если необходимо, можно добавить поля пользователя
        // public string Username { get; set; }
    }
}