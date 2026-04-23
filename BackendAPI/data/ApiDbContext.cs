using Microsoft.EntityFrameworkCore;
using BackendAPI.Models; // Đảm bảo bạn đã có thư mục Models và file User.cs

namespace BackendAPI.Data
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
        }

        // Khai báo bảng Users trong Database
        public DbSet<User> Users { get; set; }
    }
}