// Controllers/TasksController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TimeCheckScheduleReact.Data;
using TimeCheckScheduleReact.DTOs; 
using TimeCheckScheduleReact.Models;
using System.ComponentModel.DataAnnotations;

namespace TimeCheckScheduleReact.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ApplicationDbContext context, ILogger<TasksController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Получение списка всех задач текущего пользователя
        /// </summary>
        /// <returns>Список задач</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetTasks()
        {
            LogAllClaims();

            var username = GetUsername();
            if (string.IsNullOrEmpty(username))
            {
                _logger.LogWarning("Не удалось определить пользователя.");
                return Unauthorized(new { message = "Не удалось определить пользователя." });
            }

            _logger.LogInformation($"Получение задач для пользователя: {username}");

            var tasks = await _context.TaskItems
                .Where(t => t.User.Username == username)
                .Select(t => new TaskItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    StartTime = t.StartTime,
                    EndTime = t.EndTime,
                    Date = t.Date
                })
                .ToListAsync();

            return Ok(tasks);
        }

        /// <summary>
        /// Получение задачи по ID
        /// </summary>
        /// <param name="id">ID задачи</param>
        /// <returns>Задача</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItemDto>> GetTask(int id)
        {
            LogAllClaims();

            var username = GetUsername();
            if (string.IsNullOrEmpty(username))
            {
                _logger.LogWarning("Не удалось определить пользователя.");
                return Unauthorized(new { message = "Не удалось определить пользователя." });
            }

            _logger.LogInformation($"Получение задачи с ID: {id} для пользователя: {username}");

            var task = await _context.TaskItems
                .Where(t => t.Id == id && t.User.Username == username)
                .Select(t => new TaskItemDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    StartTime = t.StartTime,
                    EndTime = t.EndTime,
                    Date = t.Date
                })
                .FirstOrDefaultAsync();

            if (task == null)
            {
                _logger.LogWarning($"Задача с ID: {id} не найдена для пользователя: {username}");
                return NotFound(new { message = "Задача не найдена." });
            }

            return Ok(task);
        }

        /// <summary>
        /// Создание новой задачи
        /// </summary>
        /// <param name="taskDto">Данные задачи</param>
        /// <returns>Созданная задача</returns>
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItemDto taskDto)
        {
            LogAllClaims();

            var username = GetUsername();
            if (string.IsNullOrEmpty(username))
            {
                _logger.LogWarning("Не удалось определить пользователя.");
                return Unauthorized(new { message = "Не удалось определить пользователя." });
            }

            if (taskDto == null)
            {
                _logger.LogWarning("Получены пустые данные задачи.");
                return BadRequest(new { message = "Данные задачи не могут быть пустыми." });
            }

            // Поиск пользователя по username
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                _logger.LogWarning($"Пользователь с именем {username} не найден.");
                return Unauthorized(new { message = "Пользователь не найден." });
            }

            var task = new TaskItem
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                StartTime = taskDto.StartTime,
                EndTime = taskDto.EndTime,
                Date = taskDto.Date,
                UserId = user.Id
            };

            _context.TaskItems.Add(task);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Задача создана с ID: {task.Id} для пользователя: {username}");

            // Преобразование в DTO для ответа
            var createdTaskDto = new TaskItemDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                StartTime = task.StartTime,
                EndTime = task.EndTime,
                Date = task.Date
            };

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, createdTaskDto);
        }

        /// <summary>
        /// Обновление существующей задачи
        /// </summary>
        /// <param name="id">ID задачи</param>
        /// <param name="taskDto">Обновленные данные задачи</param>
        /// <returns>Обновленная задача</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItemDto taskDto)
        {
            LogAllClaims();

            var username = GetUsername();
            if (string.IsNullOrEmpty(username))
            {
                _logger.LogWarning("Не удалось определить пользователя.");
                return Unauthorized(new { message = "Не удалось определить пользователя." });
            }

            if (taskDto == null)
            {
                _logger.LogWarning("Получены пустые данные задачи для обновления.");
                return BadRequest(new { message = "Данные задачи не могут быть пустыми." });
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                _logger.LogWarning($"Пользователь с именем {username} не найден.");
                return Unauthorized(new { message = "Пользователь не найден." });
            }

            var existingTask = await _context.TaskItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == user.Id);
            if (existingTask == null)
            {
                _logger.LogWarning($"Задача с ID: {id} не найдена для пользователя: {username}");
                return NotFound(new { message = "Задача не найдена." });
            }

            existingTask.Title = taskDto.Title;
            existingTask.Description = taskDto.Description;
            existingTask.StartTime = taskDto.StartTime;
            existingTask.EndTime = taskDto.EndTime;
            existingTask.Date = taskDto.Date;

            _context.TaskItems.Update(existingTask);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Задача с ID: {id} обновлена для пользователя: {username}");

            // Преобразование в DTO для ответа
            var updatedTaskDto = new TaskItemDto
            {
                Id = existingTask.Id,
                Title = existingTask.Title,
                Description = existingTask.Description,
                StartTime = existingTask.StartTime,
                EndTime = existingTask.EndTime,
                Date = existingTask.Date
            };

            return Ok(updatedTaskDto);
        }

        /// <summary>
        /// Удаление задачи по ID
        /// </summary>
        /// <param name="id">ID задачи</param>
        /// <returns>Статус удаления</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var username = GetUsername();
            if (string.IsNullOrEmpty(username))
            {
                _logger.LogWarning("Не удалось определить пользователя.");
                return Unauthorized(new { message = "Не удалось определить пользователя." });
            }

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                _logger.LogWarning($"Пользователь с именем {username} не найден.");
                return Unauthorized(new { message = "Пользователь не найден." });
            }

            var task = await _context.TaskItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == user.Id);
            if (task == null)
            {
                _logger.LogWarning($"Задача с ID: {id} не найдена для пользователя: {username}");
                return NotFound(new { message = "Задача не найдена." });
            }

            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Задача с ID: {id} удалена для пользователя: {username}");

            return NoContent();
        }

        /// <summary>
        /// Вспомогательный метод для получения username из Claims
        /// </summary>
        /// <returns>Username пользователя или null</returns>
        private string GetUsername()
        {
            var usernameClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return usernameClaim?.Value;
        }

        /// <summary>
        /// Вспомогательный метод для логирования всех claims
        /// </summary>
        private void LogAllClaims()
        {
            foreach (var claim in User.Claims)
            {
                _logger.LogInformation($"Claim: Type = {claim.Type}, Value = {claim.Value}");
            }
        }
    }
}
