using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        // Attribute [Authorize] này chính là "chốt chặn" bảo vệ API
        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            // Lấy thông tin từ Token mà người dùng gửi kèm
            var userName = User.Identity?.Name;
            var userId = User.FindFirst("UserId")?.Value;

            return Ok(new
            {
                Message = "Chào mừng bạn đến với hồ sơ cá nhân!",
                Username = userName,
                UserId = userId
            });
        }

        

    }
}