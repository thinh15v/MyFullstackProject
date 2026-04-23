import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    // Gọi đến AuthContext để lấy thông tin đăng nhập hiện tại
    const { user, loading } = useContext(AuthContext);

    // 1. Trong lúc chờ hệ thống lục tìm Token trong máy...
    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h3 style={{ color: 'var(--accent)' }}>Đang kiểm tra thẻ VIP...</h3>
            </div>
        );
    }

    // 2. Nếu tìm xong mà KHÔNG THẤY user (chưa đăng nhập) -> Đá về trang /login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Nếu ĐÃ CÓ user -> Mở cửa cho vào (hiển thị Component bên trong)
    return children;
};

export default ProtectedRoute;