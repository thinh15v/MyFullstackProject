import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Gọi API lấy thông tin VIP
                const response = await api.get('/user/profile');
                setProfileData(response.data);
            } catch (err) {
                setError('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
                setTimeout(() => {
                    logout();
                    navigate('/login');
                }, 2000);
            }
        };

        fetchProfile();
    }, [logout, navigate]);

    if (!profileData && !error) {
        return <h3 style={{ textAlign: 'center', marginTop: '50px', color: '#4b5563' }}>Đang tải dữ liệu...</h3>;
    }

    return (
        <div style={{ 
            maxWidth: '400px', 
            margin: '50px auto', 
            padding: '30px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '16px', 
            backgroundColor: '#ffffff', /* ÉP NỀN MÀU TRẮNG GIỐNG TRANG ĐĂNG KÝ */
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
        }}>
            <h2 style={{ color: 'var(--accent, #004ea2)', marginBottom: '25px', marginTop: '0' }}>
                Hồ Sơ Cá Nhân
            </h2>
            
            {error ? (
                <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{error}</p>
            ) : (
                <div style={{ textAlign: 'left', lineHeight: '2', color: '#333333', marginBottom: '25px' }}>
                    <p style={{ margin: '5px 0' }}><strong>Lời chào:</strong> {profileData.message}</p>
                    <p style={{ margin: '5px 0' }}>
                        <strong>Tên tài khoản:</strong> <span style={{ color: 'var(--accent, #004ea2)', fontWeight: 'bold' }}>{profileData.username}</span>
                    </p>
                    <p style={{ margin: '5px 0' }}><strong>ID Hệ thống:</strong> {profileData.userId}</p>
                    <p style={{ margin: '5px 0' }}><strong>Vai trò:</strong> {profileData.role}</p>
                    <p style={{ margin: '5px 0' }}><strong>Họ tên:</strong> {profileData.fullName || 'Chưa cập nhật'}</p>
                    <p style={{ margin: '5px 0' }}><strong>Email:</strong> {profileData.email || 'Chưa cập nhật'}</p>
                    <p style={{ margin: '5px 0' }}><strong>Số điện thoại:</strong> {profileData.phoneNumber || 'Chưa cập nhật'}</p>
                
                </div>
            )}
            
            <button 
                onClick={() => { logout(); navigate('/login'); }} 
                style={{ 
                    width: '100%', 
                    padding: '12px', 
                    background: '#ef4444', /* Nút màu đỏ tươi nổi bật */
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    fontSize: '16px', 
                    cursor: 'pointer' 
                }}
            >
                Đăng Xuất
            </button>
        </div>
    );
};

export default Profile;