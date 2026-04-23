using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BackendAPI.Data;
using BackendAPI.Models;
using BackendAPI.Models.DTOs;
using Microsoft.IdentityModel.Tokens;

namespace BackendAPI.Services
{
    public class AuthService
    {
        private readonly ApiDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(ApiDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // 1. Hàm Đăng ký (Register)
        public async Task<bool> Register(RegisterRequest request)
        {
            // Kiểm tra user tồn tại
            if (_context.Users.Any(u => u.Username == request.Username))
                return false;

            // Băm mật khẩu trước khi lưu vào SQL Server
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Username = request.Username,
                PasswordHash = passwordHash,
                Role = "User" // Mặc định là User
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // 2. Hàm Đăng nhập & Tạo Token (Login)
        public string? Login(LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == request.Username);

            // Kiểm tra user và verify mật khẩu đã băm
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return null;

            return CreateToken(user);
        }

        // 3. Hàm tạo JWT Token (Private - dùng nội bộ trong class)
        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("UserId", user.Id.ToString()),
                new Claim("FullName", user.FullName ?? ""),
                new Claim("Email", user.Email ?? ""),
                new Claim("PhoneNumber", user.PhoneNumber ?? "")
            };

            // Lấy key từ file .env (đã được load qua Program.cs)
            var keyStr = Environment.GetEnvironmentVariable("JWT_KEY") 
                         ?? _config["Jwt:Key"] 
                         ?? "Chuoi_Backup_Sieu_Bao_Mat_32_Ky_Tu_Tro_Len";
            
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: Environment.GetEnvironmentVariable("JWT_ISSUER") ?? _config["Jwt:Issuer"],
                audience: Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}