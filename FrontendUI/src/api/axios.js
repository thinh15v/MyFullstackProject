import axios from 'axios';

// Tạo một bản sao của axios với cấu hình riêng
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5106/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// "Bộ lọc" (Interceptor) - Tự động đính kèm Token trước khi gửi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;