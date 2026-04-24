using BackendAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        // Tiêm (Inject) UserService vào Controller
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // 1. Chỉ lấy đúng cái UserId từ Token (Giống như quét mã vạch thẻ)
            var userIdString = User.FindFirst("UserId")?.Value;

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized(new { message = "Token không hợp lệ hoặc đã hết hạn!" });
            }

            // 2. Nhờ UserService xuống Database lấy toàn bộ thông tin mới nhất
            var userProfile = await _userService.GetUserProfileByIdAsync(userId);

            if (userProfile == null)
            {
                return NotFound(new { message = "Không tìm thấy tài khoản này trong hệ thống!" });
            }

            // 3. Trả hộp dữ liệu (DTO) về cho React
            return Ok(userProfile);
        }

        [Authorize(Roles = "Admin")] 
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            
            return Ok(users);
        }
    }
}