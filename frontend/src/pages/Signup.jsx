import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Lock, Mail, User, Building, Phone, Eye, EyeOff, ArrowRight, CheckCircle, Sparkles, BarChart3, Globe, Cpu } from 'lucide-react';

/* ─── Animated Right Illustration Panel ─── */
function RightPanel() {
  const features = [
    { icon: <Cpu className="w-5 h-5 text-purple-400" />, title: 'Local AI Pricing', desc: 'Llama AI on your server — zero cost, total privacy' },
    { icon: <Globe className="w-5 h-5 text-blue-400" />, title: 'OTA Sync', desc: 'MMT, Booking.com, Agoda, Goibibo — all in one click' },
    { icon: <BarChart3 className="w-5 h-5 text-green-400" />, title: 'Revenue Insights', desc: 'ADR, RevPAR, occupancy trends at a glance' },
  ];

  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full p-12 overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <div className="absolute top-[-15%] right-[-10%] w-[70%] h-[70%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[50%] rounded-full bg-blue-600/20 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#a855f7 1px,transparent 1px),linear-gradient(90deg,#a855f7 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 blur-md opacity-70 scale-110" />
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-lg leading-none">R</span>
          </div>
        </div>
        <span className="text-xl font-black tracking-tighter text-white">Roomora<span className="text-purple-400">.</span></span>
      </div>

      {/* Center graphic */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center">
        {/* Big circle glow with inner illustration */}
        <div className="relative w-64 h-64">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border border-purple-500/20"
            style={{ animation: 'spin 20s linear infinite' }}
          />
          <div
            className="absolute inset-4 rounded-full border border-blue-500/15"
            style={{ animation: 'spin 15s linear infinite reverse' }}
          />
          {/* Dots on ring */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-blue-400/60"
              style={{
                top: `${50 - 48 * Math.cos((deg * Math.PI) / 180)}%`,
                left: `${50 + 48 * Math.sin((deg * Math.PI) / 180)}%`,
                transform: 'translate(-50%,-50%)',
                animation: `pulse 2s ${i * 0.3}s ease-in-out infinite`,
              }}
            />
          ))}

          {/* Center card */}
          <div className="absolute inset-8 rounded-2xl bg-white/6 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center gap-2 shadow-2xl" style={{ animation: 'floatMain 6s ease-in-out infinite alternate' }}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-black text-2xl leading-none">R</span>
            </div>
            <p className="text-white font-black text-sm tracking-tight">Roomora</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}
            </div>
            <p className="text-slate-400 text-[9px]">Hotel Revenue OS</p>
          </div>
        </div>

        {/* Floating stat chips */}
        {[
          { label: 'Hotels Onboarded', value: '2,400+', top: '5%', left: '-10%', delay: '0s' },
          { label: 'Avg Revenue Lift', value: '+34%', top: '50%', left: '88%', delay: '0.8s' },
          { label: 'OTAs Supported', value: '6', top: '88%', left: '10%', delay: '1.5s' },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 shadow-xl"
            style={{ top: s.top, left: s.left, animation: `floatCard 5s ${s.delay} ease-in-out infinite alternate` }}
          >
            <p className="text-white font-black text-base">{s.value}</p>
            <p className="text-slate-500 text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feature list */}
      <div className="relative z-10 space-y-4">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Everything you need</p>
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center flex-shrink-0">
              {f.icon}
            </div>
            <div>
              <p className="text-white text-sm font-bold">{f.title}</p>
              <p className="text-slate-500 text-xs">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatCard { from { transform: translateY(0) } to { transform: translateY(-8px) } }
        @keyframes floatMain { from { transform: translateY(0) } to { transform: translateY(-10px) } }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse {
          0%,100% { opacity: 0.4; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.5); }
        }
      `}</style>
    </div>
  );
}

/* ─── Password Strength ─── */
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ chars', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  if (!password) return null;
  const bar = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-400'][score];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0,1,2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? bar : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map(c => (
          <span key={c.label} className={`text-[10px] font-semibold ${c.pass ? 'text-green-400' : 'text-slate-600'}`}>
            {c.pass ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const inputClass =
  'w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-slate-600 rounded-2xl py-3.5 text-sm focus:outline-none transition-all';

/* ─── Signup Page ─── */
export default function Signup() {
  const [formData, setFormData] = useState({
    username: '', email: '', hotel_name: '', phone_number: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        hotelName: formData.hotel_name,
        hotel_name: formData.hotel_name,
        phoneNumber: formData.phone_number,
        phone_number: formData.phone_number,
        password: formData.password,
      };
      const res = await api.post('/auth/signup', payload);
      if (res.data.requires_email_confirmation) {
        setSuccess('Account created! Check your email to confirm your account before signing in.');
      } else {
        const token = res.data.token || res.data.access_token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* ── Left: Form ── */}
      <div className="flex-1 flex items-center justify-center relative bg-slate-900/60 p-6 lg:p-12 overflow-y-auto">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[50%] h-[40%] rounded-full bg-blue-700/10 blur-[80px]" />
        </div>

        <div
          className="relative z-10 w-full max-w-md"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(-24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-base leading-none">R</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-white">Roomora<span className="text-purple-400">.</span></span>
          </div>

          {success ? (
            <div className="py-10 text-center space-y-5">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-green-500/20 blur-lg scale-110" />
                  <div className="relative w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-2">Check your inbox!</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{success}</p>
              </div>
              <Link to="/login" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold text-sm transition-colors">
                Go to Sign In <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-black text-white mb-1">Create your account</h1>
              <p className="text-slate-400 text-sm mb-8">Set up your hotel revenue OS in 60 seconds · Free 30 days</p>

              {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <span>⚠</span> {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Username</label>
                    <div className="relative group">
                      <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                      <input type="text" required onChange={set('username')} placeholder="hotel_owner" className={`${inputClass} pl-11`} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Phone</label>
                    <div className="relative group">
                      <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                      <input type="tel" onChange={set('phone_number')} placeholder="+91 98765" className={`${inputClass} pl-11`} />
                    </div>
                  </div>
                </div>

                {/* Hotel Name */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Hotel Name</label>
                  <div className="relative group">
                    <Building className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <input type="text" required onChange={set('hotel_name')} placeholder="Grand Mahal, Mumbai" className={`${inputClass} pl-11`} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <input type="email" required onChange={set('email')} placeholder="owner@hotel.com" className={`${inputClass} pl-11`} />
                  </div>
                </div>

                {/* Passwords in a row on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Password</label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        onChange={set('password')}
                        placeholder="••••••••"
                        className={`${inputClass} pl-11 pr-12`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <PasswordStrength password={formData.password} />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Confirm</label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        onChange={set('confirmPassword')}
                        placeholder="••••••••"
                        className={`${inputClass} pl-11 pr-12 ${
                          formData.confirmPassword
                            ? formData.confirmPassword === formData.password
                              ? 'border-green-500/40'
                              : 'border-red-500/30'
                            : ''
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                      <p className="text-[10px] text-red-400 mt-1.5 font-medium">Passwords don't match</p>
                    )}
                    {formData.confirmPassword && formData.confirmPassword === formData.password && (
                      <p className="text-[10px] text-green-400 mt-1.5 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group overflow-hidden rounded-2xl py-3.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-xl shadow-purple-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                >
                  <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  {loading
                    ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating account...</>
                    : <>Create My Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  }
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-5">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">Sign In →</Link>
              </p>

              <div className="flex items-center justify-center gap-1.5 mt-5">
                <Sparkles className="w-3 h-3 text-slate-600" />
                <p className="text-[11px] text-slate-600">No credit card · Cancel anytime · Local AI</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right Illustration Panel ── */}
      <div className="lg:w-[48%] xl:w-[50%] flex-shrink-0">
        <RightPanel />
      </div>
    </div>
  );
}
