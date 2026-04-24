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
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.Login(request);

            if (token == null)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác." });
            }

            // Trả về Token cho Frontend React lưu trữ
            return Ok(token);
        }
        // API MỚI: Dành cho việc cấp lại thẻ
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] TokenApiDto tokenModel)
        {
            // Nếu Frontend gửi lên một chuỗi rỗng
            if (string.IsNullOrEmpty(tokenModel.RefreshToken))
            {
                return BadRequest(new { message = "Vui lòng cung cấp Refresh Token!" });
            }

            // Nhờ Service kiểm tra và cấp thẻ mới
            var tokens = await _authService.RefreshTokenAsync(tokenModel.RefreshToken);

            if (tokens == null)
            {
                return Unauthorized(new { message = "Thẻ Refresh đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!" });
            }

            // Trả thẻ mới về cho React
            return Ok(tokens);
        }
    }
}