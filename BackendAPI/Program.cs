using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using BackendAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BackendAPI.Services;
using Microsoft.AspNetCore.Authorization;

// 1. Tải các biến môi trường
Env.Load();

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        builder => builder.WithOrigins("http://localhost:5173") // Port của Vite/React
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});


// --- PHẦN 1: ĐĂNG KÝ DỊCH VỤ (SERVICES) ---
// Tất cả builder.Services phải nằm TRƯỚC builder.Build()

builder.Services.AddOpenApi();
builder.Services.AddControllers(); // BẮT BUỘC có dòng này để dùng AuthController

// Cấu hình Database
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION");
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlServer(connectionString));

// Cấu hình JWT
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "Key_Du_Phong_Neu_Env_Loi_123456";
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// Đăng ký Service
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();

// --- PHẦN 2: XÂY DỰNG APP ---
var app = builder.Build();

// --- PHẦN 3: CẤU HÌNH PIPELINE (MIDDLEWARE) ---

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowReact");


// Thứ tự cực kỳ quan trọng: Authentication -> Authorization
app.UseAuthentication(); 
app.UseAuthorization();  

app.MapControllers(); // BẮT BUỘC để kích hoạt các Controller


// API mặc định của template
app.MapGet("/weatherforecast", () => { /* ... giữ nguyên ... */ }).WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}