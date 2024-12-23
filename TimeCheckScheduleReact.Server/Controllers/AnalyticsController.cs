using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TimeCheckScheduleReact.Data;
using TimeCheckScheduleReact.DTOs;

namespace TimeCheckScheduleReact.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/analytics/date
        [HttpGet("date")]
        public async Task<IActionResult> GetAnalyticsByDate([FromQuery] string startDate, [FromQuery] string endDate)
        {
            // Проверка входных данных
            if (string.IsNullOrWhiteSpace(startDate) || string.IsNullOrWhiteSpace(endDate))
            {
                return BadRequest(new { message = "Обе даты (startDate и endDate) должны быть указаны." });
            }

            if (!DateTime.TryParse(startDate, out var startDateTime) || !DateTime.TryParse(endDate, out var endDateTime))
            {
                return BadRequest(new { message = "Неверный формат даты. Используйте YYYY-MM-DD." });
            }

            if (startDateTime > endDateTime)
            {
                return BadRequest(new { message = "Дата начала не может быть позже даты окончания." });
            }

            // Получение задач в указанном диапазоне дат
            var username = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var tasks = await _context.TaskItems
                .Include(t => t.Project)
                .Where(t => t.Project.User.Username == username &&
                            t.Date >= startDateTime && t.Date <= endDateTime)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Date,
                    Hours = (t.EndTime - t.StartTime).TotalHours
                })
                .ToListAsync();

            // Формирование отчёта
            var report = new
            {
                TaskCount = tasks.Count,
                TotalHours = tasks.Sum(t => t.Hours),
                Tasks = tasks
            };

            return Ok(report);
        }

        // GET: api/analytics/project
        [HttpGet("project")]
        public async Task<IActionResult> GetAnalyticsByProject([FromQuery] string projectId)
        {
            // Проверка входных данных
            if (string.IsNullOrWhiteSpace(projectId))
            {
                return BadRequest(new { message = "Идентификатор проекта должен быть указан." });
            }

            if (!int.TryParse(projectId, out var projectIdInt))
            {
                return BadRequest(new { message = "Идентификатор проекта должен быть числом." });
            }

            // Получение задач по проекту
            var username = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            // Включение Project в запрос
            var tasks = await _context.TaskItems
                .Include(t => t.Project)
                .Where(t => t.Project.User.Username == username && t.ProjectId == projectIdInt)
                .ToListAsync();

            if (!tasks.Any())
            {
                return NotFound(new { message = "По указанному проекту задач не найдено." });
            }

            // Формирование отчёта
            var report = new
            {
                ProjectName = tasks.First().Project.Name,
                TaskCount = tasks.Count,
                TotalHours = tasks.Sum(t => (t.EndTime - t.StartTime).TotalHours),
                Tasks = tasks.Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Date,
                    Hours = (t.EndTime - t.StartTime).TotalHours
                })
            };

            return Ok(report);
        }

    }
}
