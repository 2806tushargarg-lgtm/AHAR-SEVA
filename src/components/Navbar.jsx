import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Database } from 'lucide-react';

export default function Navbar({ user, logout }) {
  const navigate = useNavigate();
  const [dbStatus, setDbStatus] = useState('checking');
  const [hasUri, setHasUri] = useState(true);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  useEffect(() => {
    const checkHealth = () => {
      fetch('/api/health')
        .then(res => res.json())
        .then(data => {
          setDbStatus(data.db);
          setHasUri(data.hasUri);
          setIsLocalhost(data.isLocalhost);
          setIsPlaceholder(data.isPlaceholder);
        })
        .catch(() => setDbStatus('disconnected'));
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = () => {
    if (!hasUri) return 'bg-amber-50 text-amber-600';
    if (isLocalhost) return 'bg-red-50 text-red-600';
    if (isPlaceholder) return 'bg-orange-50 text-orange-600';
    switch (dbStatus) {
      case 'connected': return 'bg-green-50 text-green-600';
      case 'connecting': return 'bg-blue-50 text-blue-600';
      case 'disconnected': return 'bg-red-50 text-red-500';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  return (
    <nav className="h-20 w-full border-b border-warm-border sticky top-0 z-50 bg-white/50 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-10 h-full flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-olive rounded-xl flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-105">A</div>
            <span className="text-2xl font-serif font-bold text-[#3D3D30] tracking-tight">Ahar Seva</span>
          </Link>
          
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${getStatusColor()}`}>
            <Database size={10} />
            <span>
              {!hasUri ? 'URI Missing (check secrets)' : 
               isLocalhost ? 'Localhost Not Supported' : 
               isPlaceholder ? 'Update Password in URI' :
               `DB ${dbStatus}`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          {!user ? (
            <>
              <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-primary-olive hover:text-accent-sage transition-colors">Login</Link>
              <Link to="/register" className="bg-primary-olive text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#4A4A35] transition-all shadow-lg shadow-primary-olive/20 hover:shadow-primary-olive/30">Register</Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 pr-8 border-r border-warm-border">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.role}</p>
                  <p className="text-xs font-bold text-[#3D3D30]">{user.name}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-warm-border border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-primary-olive">
                  {user.name.charAt(0)}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                id="logout-btn"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
