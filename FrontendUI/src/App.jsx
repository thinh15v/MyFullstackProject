import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// 1. IMPORT ĐẦY ĐỦ 3 TRANG BẠN ĐÃ TẠO (Đảm bảo tên file khớp 100% chữ hoa/thường)
import Login from './pages/Login';
import Register from './pages/Register'; 
import Profile from './pages/Profile';
import AllUsers from './pages/AllUsers';
import ProtectedRoute from './routes/ProtectedRoute';
import './App.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="main-nav">
      <Link to="/" className="nav-link">Trang chủ</Link>
      
      {user ? (
        <>
          <Link to="/profile" className="nav-link">Hồ sơ </Link>

          {user.role === 'Admin' && (
            <Link to="/admin/users" className="nav-link">Quản trị</Link>
          )}

          <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', cursor: 'pointer', border: 'none' }}>
            Đăng xuất
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-link">Đăng nhập</Link>
          <Link to="/register" className="nav-link">Đăng ký</Link>
        </>
      )}
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content-area">
          <Routes>
            <Route path="/" element={<h1 style={{ marginTop: '50px' }}>Chào mừng đến với Hệ thống </h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <AllUsers />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;