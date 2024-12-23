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
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Получить все задачи текущего пользователя
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var tasks = await _context.TaskItems
                .Include(t => t.Project)
                .Where(t => t.Project.User.Username == username)
                .Select(t => new TaskItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    StartTime = t.StartTime,
                    EndTime = t.EndTime,
                    Date = t.Date,
                    ProjectId = t.ProjectId,
                    ProjectName = t.Project.Name
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // Создать новую задачу
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItemDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Некорректные данные задачи." });
            }

            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return Unauthorized(new { message = "Пользователь не найден." });

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == dto.ProjectId && p.UserId == user.Id);
            if (project == null)
                return BadRequest(new { message = "Проект не найден." });

            var taskItem = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Date = dto.StartTime.Date,
                ProjectId = project.Id,
                ProjectName = project.Name // Установить значение
            };

            _context.TaskItems.Add(taskItem);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Задача успешно создана.",
                task = new TaskItemDto
                {
                    Id = taskItem.Id,
                    Title = taskItem.Title,
                    Description = taskItem.Description,
                    StartTime = taskItem.StartTime,
                    EndTime = taskItem.EndTime,
                    Date = taskItem.Date,
                    ProjectId = taskItem.ProjectId,
                    ProjectName = project.Name
                }
            });
        }
        
        // Обновить задачу
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItemDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Некорректные данные для обновления задачи." });
            }

            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var task = await _context.TaskItems
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project.User.Username == username);

            if (task == null)
                return NotFound(new { message = "Задача не найдена." });

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.StartTime = dto.StartTime;
            task.EndTime = dto.EndTime;
            task.Date = dto.StartTime.Date;
            task.ProjectId = dto.ProjectId;

            await _context.SaveChangesAsync();

            dto.Id = task.Id;
            dto.ProjectName = task.Project.Name;

            return Ok(dto);
        }

        // Удалить задачу
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var task = await _context.TaskItems
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project.User.Username == username);

            if (task == null)
                return NotFound(new { message = "Задача не найдена." });

            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
