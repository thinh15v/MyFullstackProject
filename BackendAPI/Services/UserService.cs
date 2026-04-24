using BackendAPI.Data;
using BackendAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class UserService
    {
        private readonly ApiDbContext _context;

        public UserService(ApiDbContext context)
        {
            _context = context;
        }

        // Hàm lấy thông tin Profile dựa vào ID
        public async Task<UserProfileDto?> GetUserProfileByIdAsync(int userId)
        {
            // Tìm user trong Database
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return null; // Không tìm thấy
            }

            // Gói dữ liệu vào DTO
            return new UserProfileDto
            {
                UserId = user.Id,
                Username = user.Username,
                Role = user.Role,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };
        }
        // 2. CHỨC NĂNG MỚI: Lấy danh sách tất cả User
        public async Task<List<UserProfileDto>> GetAllUsersAsync()
        {
            // Lấy toàn bộ user từ Database
            var users = await _context.Users.ToListAsync();

            // Biến đổi (Map) danh sách Entity thành danh sách DTO
            var userDtos = users.Select(user => new UserProfileDto
            {
                UserId = user.Id,
                Username = user.Username,
                Role = user.Role,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            }).ToList();

            return userDtos;
        }
    }
}
