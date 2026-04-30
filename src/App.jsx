import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelDashboard from './pages/HotelDashboard';
import NGODashboard from './pages/NGODashboard';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const login = (userInfo, userToken) => {
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', userToken);
    setUser(userInfo);
    setToken(userToken);
  };

  return (
    <Router>
      <div className="min-h-screen bg-warm-bg font-sans">
        <Navbar user={user} logout={logout} />
        <main className="container mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Navigate to={user ? (user.role === 'Hotel' ? '/hotel' : '/ngo') : '/login'} />} />
            <Route path="/login" element={!user ? <Login onLogin={login} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            
            <Route 
              path="/hotel" 
              element={user && user.role === 'Hotel' ? <HotelDashboard token={token} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/ngo" 
              element={user && user.role === 'NGO' ? <NGODashboard token={token} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
