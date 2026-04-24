import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra xem có token cũ trong máy không khi vừa mở trang web
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const role = localStorage.getItem('role'); 
        if (accessToken) {
            // Tạm thời set user là true, sau này có thể giải mã token để lấy tên
            setUser({ loggedIn: true, role: role }); 
        }
        setLoading(false);
    }, []);

    const login = (accessToken, refreshToken, role) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', role);
        setUser({ loggedIn: true, role: role });
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};