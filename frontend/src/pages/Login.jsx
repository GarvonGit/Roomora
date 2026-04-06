import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { BedDouble, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Network Connection Error: Could not reach the Render API. It may be asleep (spins up in ~50s) or offline.');
      } else {
        setError(err.response?.data?.message || `Server Error ${err.response.status}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 transition-colors p-4">
      <div className="w-full max-w-md card space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="text-2xl font-black tracking-tighter text-blue-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30 flex items-center justify-center">
                 <span className="text-white text-lg leading-none">R</span>
              </div>
              Roomora<span className="text-blue-600 dark:text-primary-500">.</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500">Log in to manage your hotel operations</p>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="input-field pl-10" placeholder="admin" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-10" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-2.5">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account? <Link to="/signup" className="text-primary-600 dark:text-primary-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
