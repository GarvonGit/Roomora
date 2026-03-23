import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { BedDouble, Lock, User, Building, Phone, Mail } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', hotelName: '', phoneNumber: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if(formData.password.length < 6) return setError('Password must be at least 6 characters');
    
    try {
      const res = await api.post('/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Network Error: Could not reach the backend API. Please check your Vercel URL configurations.');
      } else {
        setError(err.response?.data?.message || 'Error creating account');
      }
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
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-sm text-gray-500">Set up your hotel channel manager</p>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" required onChange={e => setFormData({...formData, username: e.target.value})} className="input-field pl-10" placeholder="hotel_admin" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className="input-field pl-10" placeholder="admin@roomora.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hotel Name</label>
            <div className="relative">
              <Building className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" required onChange={e => setFormData({...formData, hotelName: e.target.value})} className="input-field pl-10" placeholder="Grand Plaza" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" required onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="input-field pl-10" placeholder="+91 9876543210" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} className="input-field pl-10" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-2.5">
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
