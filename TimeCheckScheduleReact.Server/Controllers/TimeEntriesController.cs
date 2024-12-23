// Controllers/TimeEntriesController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TimeCheckScheduleReact.Data;
using TimeCheckScheduleReact.DTOs;
using TimeCheckScheduleReact.Models;

namespace TimeCheckScheduleReact.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TimeEntriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TimeEntriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Получить все записи времени текущего пользователя
        [HttpGet]
        public async Task<IActionResult> GetTimeEntries()
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var timeEntries = await _context.TimeEntries
                .Include(te => te.TaskItem)
                .ThenInclude(t => t.Project)
                .Where(te => te.TaskItem.Project.User.Username == username)
                .Select(te => new TimeEntryDto
                {
                    Id = te.Id,
                    StartTime = te.StartTime,
                    EndTime = te.EndTime,
                    TaskItemId = te.TaskItemId,
                    TaskTitle = te.TaskItem.Title
                })
                .ToListAsync();

            return Ok(timeEntries);
        }

        // Создать новую запись времени
        [HttpPost]
        public async Task<IActionResult> CreateTimeEntry([FromBody] TimeEntryDto dto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var task = await _context.TaskItems
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == dto.TaskItemId && t.Project.User.Username == username);

            if (task == null)
                return Unauthorized(new { message = "Задача не найдена." });

            var timeEntry = new TimeEntry
            {
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                TaskItemId = dto.TaskItemId
            };

            _context.TimeEntries.Add(timeEntry);
            await _context.SaveChangesAsync();

            dto.Id = timeEntry.Id;
            dto.TaskTitle = task.Title;

            return Ok(dto);
        }

        // Обновить запись времени
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTimeEntry(int id, [FromBody] TimeEntryDto dto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var timeEntry = await _context.TimeEntries
                .Include(te => te.TaskItem)
                .ThenInclude(t => t.Project)
                .FirstOrDefaultAsync(te => te.Id == id && te.TaskItem.Project.User.Username == username);

            if (timeEntry == null)
                return NotFound(new { message = "Запись времени не найдена." });

            timeEntry.StartTime = dto.StartTime;
            timeEntry.EndTime = dto.EndTime;
            timeEntry.TaskItemId = dto.TaskItemId;

            await _context.SaveChangesAsync();

            dto.Id = timeEntry.Id;
            dto.TaskTitle = timeEntry.TaskItem.Title;

            return Ok(dto);
        }

        // Удалить запись времени
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTimeEntry(int id)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var timeEntry = await _context.TimeEntries
                .Include(te => te.TaskItem)
                .ThenInclude(t => t.Project)
                .FirstOrDefaultAsync(te => te.Id == id && te.TaskItem.Project.User.Username == username);

            if (timeEntry == null)
                return NotFound(new { message = "Запись времени не найдена." });

            _context.TimeEntries.Remove(timeEntry);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
