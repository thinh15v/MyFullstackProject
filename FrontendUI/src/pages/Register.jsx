import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // <-- Thêm state xác nhận mật khẩu
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // 1. Logic kiểm tra mật khẩu nhập lại có khớp không
        if (password !== confirmPassword) {
            return setError('Mật khẩu nhập lại không khớp!');
        }

        setLoading(true);
        try {
            // 2. Gọi API đăng ký
            await api.post('/auth/register', {
                username: username,
                password: password
            });

            // 3. Thông báo và chuyển hướng
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại!');
        } finally {
            setLoading(false);
        }
    };

    // CSS riêng cho ô Input để nó KHÔNG BAO GIỜ bị đen
    const inputStyle = { 
        width: '100%', 
        padding: '12px', 
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: '#ffffff', // Ép nền màu trắng
        color: '#333333',           // Ép chữ màu đen xám
        outline: 'none',
        boxSizing: 'border-box'
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--code-bg)', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ textAlign: 'center', color: 'var(--accent)', marginBottom: '20px' }}>Đăng Ký Tài Khoản</h2>
            
            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên đăng nhập:</label>
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
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mật khẩu:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={inputStyle}
                        placeholder="Nhập mật khẩu..."
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Xác nhận mật khẩu:</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        style={inputStyle}
                        placeholder="Nhập lại mật khẩu..."
                    />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                    {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                Đã có tài khoản? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Đăng nhập ngay</Link>
            </p>
        </div>
    );
};

export default Register;