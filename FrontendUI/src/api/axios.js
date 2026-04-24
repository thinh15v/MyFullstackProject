import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5106/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// ==========================================
// 1. Bot kiểm tra thư GỬI ĐI (Request Interceptor)
// ==========================================
api.interceptors.request.use(
    (config) => {
        // ĐÃ SỬA: Lấy đúng thẻ tên là 'accessToken'
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// 2. Bot kiểm tra thư GỬI VỀ (Response Interceptor)
// CHỨC NĂNG MỚI: Tự động dùng Refresh Token xin thẻ mới
// ==========================================
api.interceptors.response.use(
    (response) => response, // Nếu mọi thứ OK -> Cho đi qua
    async (error) => {
        const originalRequest = error.config;

        // Nếu bị Backend chửi là Lỗi 401 (Thẻ Access hết hạn) VÀ thư này chưa từng thử gửi lại
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu là đang thử cứu vãn (chống lặp vô tận)

            try {
                // 1. Lấy thẻ dự phòng (Refresh Token) ra
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    throw new Error("Không có thẻ Refresh Token");
                }

                // 2. Cầm thẻ dự phòng chạy lên cổng /refresh của Backend để xin thẻ Access mới
                // (Lưu ý: Dùng axios gốc ở đây để tránh bị lặp lại interceptor)
                const res = await axios.post('http://localhost:5106/api/auth/refresh', {
                    refreshToken: refreshToken
                });

                // 3. Nhận 2 thẻ mới và cất ngay vào ví
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);

                // 4. Dán cái thẻ Access mới tinh vào lá thư ban nãy và GỬI LẠI lần nữa!
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
                return api(originalRequest);

            } catch (err) {
                // Nếu xin thẻ mới cũng thất bại (Refresh Token cũng hết hạn nốt sau 7 ngày)
                // -> Xóa sạch ví, đá người dùng văng ra trang Login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;