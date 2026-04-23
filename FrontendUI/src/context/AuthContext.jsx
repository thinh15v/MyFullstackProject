import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra xem có token cũ trong máy không khi vừa mở trang web
        const token = localStorage.getItem('token');
        if (token) {
            // Tạm thời set user là true, sau này có thể giải mã token để lấy tên
            setUser({ loggedIn: true }); 
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ loggedIn: true });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};