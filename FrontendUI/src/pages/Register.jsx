import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            return setError('Mật khẩu nhập lại không khớp!');
        }

        setLoading(true);
        try {
            await api.post('/auth/register', { username, password });
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <h2>Đăng Ký Tài Khoản</h2>
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
                <div className="form-group">
                    <label className="form-label">Xác nhận mật khẩu:</label>
                    <input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Nhập lại mật khẩu..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
            </form>

            <p className="auth-footer">
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
        </div>
    );
};

export default Register;