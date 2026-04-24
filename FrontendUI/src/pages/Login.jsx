import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import './Login'
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await api.post('/auth/login', { username, password });
            const accessToken = response.data.accessToken; 
            const refreshToken = response.data.refreshToken;
            const role = response.data.role;
            login(accessToken, refreshToken, role);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra lại tài khoản!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <h2>Đăng Nhập</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Tên đăng nhập:</label>
                    <input type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Nhập tên đăng nhập..." />
                </div>
                <div className="form-group">
                    <label className="form-label">Mật khẩu:</label>
                    <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Nhập mật khẩu..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                </button>
            </form>

            <p className="auth-footer">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
        </div>
    );
};

export default Login;