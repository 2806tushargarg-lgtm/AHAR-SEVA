import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Hotel');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://ahar-seva-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      navigate('/login');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-12 rounded-[40px] shadow-2xl shadow-primary-olive/5 border border-warm-border relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-accent-sage opacity-80"></div>
        <h2 className="text-4xl font-serif font-bold text-[#3D3D30] mb-3">Join Us</h2>
        <p className="text-gray-400 font-medium mb-10">Expand the circle of nourishment.</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3D3D30] mb-2 pl-1">Full Name / Org</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 bg-warm-bg border border-warm-border rounded-2xl outline-none focus:ring-2 focus:ring-primary-olive font-medium transition-all"
              placeholder="e.g. Hope Haven"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3D3D30] mb-2 pl-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-warm-bg border border-warm-border rounded-2xl outline-none focus:ring-2 focus:ring-primary-olive font-medium transition-all"
              placeholder="contact@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3D3D30] mb-2 pl-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-warm-bg border border-warm-border rounded-2xl outline-none focus:ring-2 focus:ring-primary-olive font-medium transition-all"
              placeholder="Secure password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3D3D30] mb-4 pl-1">I represent a...</label>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setRole('Hotel')}
                className={`flex-1 py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'Hotel' ? 'bg-primary-olive text-white border-primary-olive shadow-lg shadow-primary-olive/20' : 'bg-warm-bg text-gray-400 border-warm-border hover:border-primary-olive'}`}
              >
                🏨 Hotel
              </button>
              <button 
                type="button" 
                onClick={() => setRole('NGO')}
                className={`flex-1 py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'NGO' ? 'bg-primary-olive text-white border-primary-olive shadow-lg shadow-primary-olive/20' : 'bg-warm-bg text-gray-400 border-warm-border hover:border-primary-olive'}`}
              >
                🏢 NGO
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-olive text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#4A4A35] transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-primary-olive/20 mt-4"
          >
            {loading ? 'Creating...' : 'Register Representation'}
          </button>
        </form>

        <p className="mt-10 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
          Have an account?{' '}
          <Link to="/login" className="text-primary-olive hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
