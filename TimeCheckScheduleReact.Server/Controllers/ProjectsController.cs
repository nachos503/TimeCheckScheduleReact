// Controllers/ProjectsController.cs
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
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Получить все проекты текущего пользователя
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var projects = await _context.Projects
                .Where(p => p.User.Username == username)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name
                })
                .ToListAsync();

            return Ok(projects);
        }

        // Создать новый проект
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDto dto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return Unauthorized(new { message = "Пользователь не найден." });

            var project = new Project
            {
                Name = dto.Name,
                UserId = user.Id
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            dto.Id = project.Id;

            return Ok(dto);
        }

        // Обновить проект
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectDto dto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id && p.User.Username == username);

            if (project == null)
                return NotFound(new { message = "Проект не найден." });

            project.Name = dto.Name;
            await _context.SaveChangesAsync();

            return Ok(dto);
        }

        // Удалить проект
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == id && p.User.Username == username);

            if (project == null)
                return NotFound(new { message = "Проект не найден." });

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
