import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Lock, Mail, Eye, EyeOff, ArrowRight, TrendingUp, Zap, Shield, Star } from 'lucide-react';

/* ─── Animated Left Panel ─── */
function LeftPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const metrics = [
    { label: 'Tonight\'s RevPAR', value: '₹4,280', delta: '+18%', color: 'text-green-400' },
    { label: 'Occupancy', value: '87%', delta: '+5%', color: 'text-blue-400' },
    { label: 'AI Price Boost', value: '₹320', delta: 'applied', color: 'text-purple-400' },
  ];

  const currentMetric = metrics[tick % metrics.length];

  const floatCards = [
    { icon: '🤖', text: 'AI raised Deluxe Room to ₹3,200', sub: '12s ago', top: '12%', left: '8%', delay: '0s' },
    { icon: '📊', text: 'MMT synced · 4 new bookings', sub: '2m ago', top: '38%', left: '-4%', delay: '0.5s' },
    { icon: '⭐', text: 'Diwali demand spike detected', sub: 'Nov 1-3', top: '64%', left: '6%', delay: '1s' },
  ];

  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full p-12 overflow-hidden bg-slate-950">
      {/* BG glows */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/25 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/25 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Logo top-left */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 blur-md opacity-70 scale-110" />
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-lg leading-none">R</span>
          </div>
        </div>
        <span className="text-xl font-black tracking-tighter text-white">Roomora<span className="text-blue-400">.</span></span>
      </div>

      {/* Center SVG dashboard illustration */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-8">
        {/* Main metric card */}
        <div className="relative w-full max-w-xs">
          {/* Floating notification cards */}
          {floatCards.map((card, i) => (
            <div
              key={i}
              className="absolute bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2.5 shadow-xl w-56 z-20"
              style={{
                top: card.top,
                left: card.left,
                animation: `floatCard 6s ${card.delay} ease-in-out infinite alternate`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{card.icon}</span>
                <div>
                  <p className="text-white text-[11px] font-semibold leading-tight">{card.text}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{card.sub}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Main dashboard mockup */}
          <div
            className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl mx-auto mt-24 ml-24"
            style={{ animation: 'floatMain 8s ease-in-out infinite alternate' }}
          >
            {/* Mini bar chart */}
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-3 font-semibold">Revenue · This Week</p>
            <div className="flex items-end gap-1.5 h-16 mb-4">
              {[55, 72, 60, 88, 95, 78, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h}%`,
                    background: i === 6
                      ? 'linear-gradient(to top, #2563eb, #9333ea)'
                      : 'rgba(255,255,255,0.12)',
                    animation: `barGrow 0.8s ${i * 0.1}s ease-out both`,
                  }}
                />
              ))}
            </div>

            {/* Live metric that rotates */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/8">
              <div>
                <p className="text-slate-500 text-[10px] mb-0.5">{currentMetric.label}</p>
                <p className="text-white font-black text-lg">{currentMetric.value}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/10 ${currentMetric.color}`}>
                {currentMetric.delta}
              </span>
            </div>

            {/* OTA pills */}
            <div className="flex gap-1.5 mt-3">
              {['MMT', 'BDC', 'Agoda', 'Airbnb'].map(p => (
                <span key={p} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="relative z-10 space-y-3">
        <h2 className="text-2xl font-black text-white leading-tight">
          Stop losing revenue<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">every single night.</span>
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
          Roomora's local AI detects demand spikes — from Diwali to cricket finals — and prices your rooms perfectly. Automatically.
        </p>
        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { icon: <Zap className="w-3 h-3" />, text: 'AI Pricing' },
            { icon: <TrendingUp className="w-3 h-3" />, text: 'Live Analytics' },
            { icon: <Shield className="w-3 h-3" />, text: 'Secure & Private' },
            { icon: <Star className="w-3 h-3" />, text: 'Free 30 days' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-white/6 border border-white/10 px-2.5 py-1 rounded-full">
              <span className="text-blue-400">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatCard {
          from { transform: translateY(0px); }
          to   { transform: translateY(-8px); }
        }
        @keyframes floatMain {
          from { transform: translateY(0px) rotate(-1deg); }
          to   { transform: translateY(-10px) rotate(0deg); }
        }
        @keyframes barGrow {
          from { transform: scaleY(0); transform-origin: bottom; }
          to   { transform: scaleY(1); transform-origin: bottom; }
        }
      `}</style>
    </div>
  );
}

/* ─── Login Page ─── */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token || res.data.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* ── Left ── */}
      <div className="lg:w-[52%] xl:w-[55%] flex-shrink-0">
        <LeftPanel />
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex-1 flex items-center justify-center relative bg-slate-900/60 p-6 lg:p-12">
        {/* Subtle right-side glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[60%] h-[50%] rounded-full bg-purple-700/10 blur-[80px]" />
        </div>

        <div
          className="relative z-10 w-full max-w-sm"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Mobile logo (hidden on lg) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-base leading-none">R</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-white">Roomora<span className="text-blue-400">.</span></span>
          </div>

          <h1 className="text-3xl font-black text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">Sign in to your hotel dashboard</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors z-10" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@hotel.com"
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-600 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-semibold">Forgot password?</button>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-600 rounded-2xl pl-11 pr-12 py-3.5 text-sm focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden rounded-2xl py-3.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              {loading
                ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>
                : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account yet?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              Start free trial →
            </Link>
          </p>

          <p className="text-center text-[11px] text-slate-700 mt-6">
            🔒 Private · Local AI · No data leaves your server
          </p>
        </div>
      </div>
    </div>
  );
}
