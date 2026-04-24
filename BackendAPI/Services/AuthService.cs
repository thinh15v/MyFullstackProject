using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BackendAPI.Data;
using BackendAPI.Models;
using BackendAPI.Models.DTOs;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;

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
        public async Task<AuthResponseDto?> Login(LoginRequest request)
        {
            // Tìm user
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            // Xác thực mật khẩu
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return null;

            // In ra 2 thẻ
            var accessToken = CreateToken(user);
            var refreshToken = GenerateRefreshToken();

            // Lưu Refresh Token và thời hạn (7 ngày) vào Database
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            
            await _context.SaveChangesAsync(); // Lưu thay đổi

            // Đóng gói 2 thẻ vào hộp DTO gửi về cho Controller
            return new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Role = user.Role
            };
        }

        // 3. Hàm tạo JWT Token (Private - dùng nội bộ trong class)
        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("UserId", user.Id.ToString()),
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
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
        // 5. Hàm Đổi Thẻ (Refresh Token)
        public async Task<AuthResponseDto?> RefreshTokenAsync(string oldRefreshToken)
        {
            // 1. Chạy xuống kho tìm xem có ai đang giữ cái thẻ Refresh này không
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == oldRefreshToken);

            // 2. Nếu thẻ giả mạo, hoặc đã quá hạn 7 ngày -> Từ chối (Trả về null)
            if (user == null || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return null;
            }

            // 3. Nếu hợp lệ -> In ra 1 cặp thẻ mới tinh
            var newAccessToken = CreateToken(user);
            var newRefreshToken = GenerateRefreshToken(); // Xoay vòng luôn Refresh Token cho an toàn tối đa

            // 4. Lưu thẻ Refresh mới vào Database
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            await _context.SaveChangesAsync();

            // 5. Đóng gói trả về
            return new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                Role = user.Role
            };
        }
    }
}