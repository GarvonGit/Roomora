import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BedDouble, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 transition-colors p-4">
      <div className="w-full max-w-md card space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <BedDouble className="w-6 h-6 text-primary-600 dark:text-primary-400" />
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

        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Test Credentials:</strong><br/>
            Username: admin<br/>
            Password: password
          </p>
        </div>
      </div>
    </div>
  );
}
