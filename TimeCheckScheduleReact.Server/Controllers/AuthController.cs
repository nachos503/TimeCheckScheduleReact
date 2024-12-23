// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TimeCheckScheduleReact.Data;
using TimeCheckScheduleReact.Models;
using TimeCheckScheduleReact.Services;
using System.ComponentModel.DataAnnotations;

namespace TimeCheckScheduleReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenService _jwtTokenService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, JwtTokenService jwtTokenService, ILogger<AuthController> logger)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _logger = logger;
        }

        /// <summary>
        /// Регистрация нового пользователя
        /// </summary>
        /// <param name="registerDto">Данные для регистрации</param>
        /// <returns>Сообщение о результате регистрации</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (registerDto == null)
            {
                _logger.LogWarning("Получены пустые данные для регистрации.");
                return BadRequest(new { message = "Данные для регистрации не могут быть пустыми." });
            }

            if (_context.Users.Any(u => u.Username == registerDto.Username))
            {
                _logger.LogWarning($"Пользователь с именем {registerDto.Username} уже существует.");
                return BadRequest(new { message = "Пользователь с таким именем уже существует." });
            }

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = HashPassword(registerDto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Пользователь {user.Username} зарегистрирован с ID: {user.Id}");

            return Ok(new { message = "Регистрация прошла успешно." });
        }

        /// <summary>
        /// Вход пользователя
        /// </summary>
        /// <param name="loginDto">Данные для входа</param>
        /// <returns>JWT токен</returns>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null)
            {
                _logger.LogWarning("Получены пустые данные для входа.");
                return BadRequest(new { message = "Данные для входа не могут быть пустыми." });
            }

            var user = _context.Users.SingleOrDefault(u => u.Username == loginDto.Username);
            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                _logger.LogWarning($"Неверные учетные данные для пользователя {loginDto.Username}.");
                return Unauthorized(new { message = "Неверные имя пользователя или пароль." });
            }

            var token = _jwtTokenService.GenerateToken(user);

            _logger.LogInformation($"Пользователь {user.Username} вошел в систему.");

            return Ok(new { token });
        }

        /// <summary>
        /// Хэширование пароля
        /// </summary>
        /// <param name="password">Пароль</param>
        /// <returns>Хэшированный пароль</returns>
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        /// <summary>
        /// Проверка пароля
        /// </summary>
        /// <param name="password">Введенный пароль</param>
        /// <param name="storedHash">Сохраненный хэш пароля</param>
        /// <returns>true, если пароль верный; иначе false</returns>
        private bool VerifyPassword(string password, string storedHash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == storedHash;
        }
    }

    // DTOs
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [EmailAddress]
        public string Email { get; set; }
    }

    public class LoginDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
