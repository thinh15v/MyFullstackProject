using BackendAPI.Models.DTOs;
using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Đường dẫn sẽ là: api/auth
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // 1. API Đăng ký: POST api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.Register(request);
            
            if (!result)
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại!" });
            }

            return Ok(new { message = "Đăng ký tài khoản thành công." });
        }

        // 2. API Đăng nhập: POST api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var token = _authService.Login(request);

            if (token == null)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác." });
            }

            // Trả về Token cho Frontend React lưu trữ
            return Ok(new AuthResponse(token));
        }
    }
}