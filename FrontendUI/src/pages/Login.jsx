import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link để chuyển trang
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // 1. Gọi API login ở Backend
            const response = await api.post('/auth/login', {
                username: username,
                password: password
            });

            // 2. Nếu thành công, lưu token vào Context
            const token = response.data.token;
            login(token);

            // 3. Chuyển hướng sang trang Profile
            alert("Đăng nhập thành công!");
            navigate('/profile');
        } catch (err) {
            // 4. Xử lý lỗi
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra lại tài khoản!');
        } finally {
            setLoading(false);
        }
    };

    // Style cho các ô nhập liệu (Giống trang Register)
    const inputStyle = { 
        width: '100%', 
        padding: '12px', 
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: '#f9fafb', // Nền xám siêu nhạt
        color: '#333333',           // Chữ xám đậm
        outline: 'none',
        boxSizing: 'border-box'
    };

    // Style cho chữ của Label
    const labelStyle = {
        display: 'block', 
        marginBottom: '5px', 
        fontWeight: 'bold',
        color: '#4b5563' 
    };

    return (
        <div style={{ 
            maxWidth: '400px', 
            margin: '50px auto', 
            padding: '30px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '16px', 
            backgroundColor: '#ffffff', /* ÉP NỀN FORM MÀU TRẮNG */
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)'
        }}>
            <h2 style={{ textAlign: 'center', color: 'var(--accent, #004ea2)', marginBottom: '25px', marginTop: '0' }}>
                Đăng Nhập
            </h2>
            
            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label style={labelStyle}>Tên đăng nhập:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={inputStyle}
                        placeholder="Nhập tên đăng nhập..."
                    />
                </div>
                <div>
                    <label style={labelStyle}>Mật khẩu:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={inputStyle}
                        placeholder="Nhập mật khẩu..."
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                        width: '100%', 
                        padding: '14px', 
                        background: 'var(--accent, #007bff)', /* Nút màu xanh dương */
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontWeight: 'bold', 
                        fontSize: '16px', 
                        cursor: 'pointer', 
                        marginTop: '10px' 
                    }}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14.5px', color: '#6b7280' }}>
                Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--accent, #004ea2)', textDecoration: 'none', fontWeight: 'bold' }}>Đăng ký ngay</Link>
            </p>
        </div>
    );
};

export default Login;