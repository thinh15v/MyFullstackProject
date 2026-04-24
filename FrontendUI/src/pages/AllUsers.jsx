import { useEffect, useState } from 'react';
import api from '../api/axios';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/user/all');
                setUsers(res.data);
            } catch (err) {
                setError('Bạn không có quyền truy cập hoặc phiên làm việc hết hạn.');
            }
        };
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
            <h2 style={{ color: 'var(--accent)' }}>Quản lý Người dùng</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Tên đăng nhập</th>
                        <th style={{ padding: '12px' }}>Họ tên</th>
                        <th style={{ padding: '12px' }}>Quyền</th>
                        <th style={{ padding: '12px' }}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.userId} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '12px' }}>{u.userId}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.username}</td>
                            <td style={{ padding: '12px' }}>{u.fullName || '---'}</td>
                            <td style={{ padding: '12px' }}>
                                <span style={{ padding: '4px 8px', borderRadius: '4px', background: u.role === 'Admin' ? '#fee2e2' : '#e0f2fe' }}>
                                    {u.role}
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>{u.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllUsers;