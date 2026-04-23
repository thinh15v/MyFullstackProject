import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // 1. Gọi API login ở Backend (port 5106)
            const response = await api.post('/auth/login', {
                username: username,
                password: password
            });

            // 2. Nếu thành công, lưu token vào Context và localStorage
            const token = response.data.token;
            login(token);

            // 3. Chuyển hướng sang trang Profile
            alert("Đăng nhập thành công!");
            navigate('/profile');
        } catch (err) {
            // 4. Xử lý lỗi (Sai pass, server sập...)
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra lại tài khoản!');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
            <h2>Đăng Nhập</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên đăng nhập:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none' }}>
                    Đăng nhập
                </button>
            </form>
        </div>
    );
};

export default Login;