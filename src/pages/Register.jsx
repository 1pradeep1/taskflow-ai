import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      login({ name: res.data.name, email: res.data.email, id: res.data.id }, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TaskFlow AI</h1>
          <p className="text-blue-300">Smart Productivity Platform</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
          {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-blue-200 text-sm font-medium mb-1 block">Full Name</label>
              <input type="text" placeholder="Pradeep C" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div>
              <label className="text-blue-200 text-sm font-medium mb-1 block">Email</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <div>
              <label className="text-blue-200 text-sm font-medium mb-1 block">Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-blue-300 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}