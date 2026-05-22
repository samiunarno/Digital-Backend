import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff, UserPlus, Wifi, Cpu, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* ── Reuse the same industrial background ── */
const IndustrialBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    for (let i = 0; i < 60; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    let frame = 0;
    let raf: number;

    const draw = () => {
      frame++;
      ctx.fillStyle = 'rgba(4, 6, 10, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167,139,250,0.35)';
        ctx.fill();
      });

      const scanY = ((frame * 1.2) % (canvas.height + 40)) - 20;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, 'rgba(167,139,250,0)');
      scanGrad.addColorStop(0.5, 'rgba(167,139,250,0.04)');
      scanGrad.addColorStop(1, 'rgba(167,139,250,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, canvas.width, 40);

      raf = requestAnimationFrame(draw);
    };

    ctx.fillStyle = '#04060a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(167,139,250,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-purple-500/20" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-500/20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-purple-500/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-purple-500/20" />
    </>
  );
};

const BlinkCursor = () => (
  <span className="inline-block w-[2px] h-[1em] bg-purple-400 align-middle ml-0.5 animate-[blink_1s_step-end_infinite]" />
);

const StatusBar = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/10 bg-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">System Online</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi size={9} className="text-purple-400" />
          <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest">Secure Channel</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <Cpu size={9} className="text-white/20" />
      </div>
    </div>
  );
};

/* ── Password strength calculator ── */
type StrengthLevel = 0 | 1 | 2 | 3 | 4;

interface Requirement { label: string; met: boolean }

const getStrength = (pwd: string): { level: StrengthLevel; requirements: Requirement[] } => {
  const requirements: Requirement[] = [
    { label: 'At least 8 characters', met: pwd.length >= 8 },
    { label: 'Uppercase letter (A–Z)', met: /[A-Z]/.test(pwd) },
    { label: 'Lowercase letter (a–z)', met: /[a-z]/.test(pwd) },
    { label: 'Number (0–9)', met: /[0-9]/.test(pwd) },
    { label: 'Special character (!@#...)', met: /[^a-zA-Z0-9]/.test(pwd) },
  ];
  const metCount = requirements.filter(r => r.met).length as StrengthLevel;
  return { level: metCount as StrengthLevel, requirements };
};

const strengthConfig = [
  { label: '', color: 'bg-white/10' },
  { label: 'Weak', color: 'bg-red-500' },
  { label: 'Fair', color: 'bg-orange-400' },
  { label: 'Good', color: 'bg-yellow-400' },
  { label: 'Strong', color: 'bg-emerald-400' },
  { label: 'Excellent', color: 'bg-purple-400' },
];

export default function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootText, setBootText] = useState('');
  const navigate = useNavigate();

  const fullBootText = 'JOYI_OS v2.0 — New Identity Protocol';
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setBootText(fullBootText.slice(0, i));
      if (i >= fullBootText.length) clearInterval(t);
    }, 40);
    return () => clearInterval(t);
  }, []);

  const { level: strengthLevel, requirements } = getStrength(password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('Username is required.'); return; }
    if (username.trim().length < 3) { setError('Username must be at least 3 characters.'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) { setError('Username can only contain letters, numbers, and underscores.'); return; }
    if (strengthLevel < 4) { setError('Password does not meet all requirements.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('isAdmin', data.user.role === 'admin' ? 'true' : 'false');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'admin') {
          navigate('/cms');
        } else {
          navigate('/ai');
        }
      } else {
        setError(data.message || data.error || data.status || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Connection failed. Check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
  };
  const inputFocusStyle = {
    border: '1px solid rgba(167,139,250,0.4)',
    background: 'rgba(167,139,250,0.04)',
    boxShadow: '0 0 0 3px rgba(167,139,250,0.06)',
  };
  const inputBlurStyle = {
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    boxShadow: 'none',
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#04060a', color: '#e2e8f0' }}>
      <IndustrialBackground />

      <div className="relative z-10">
        <StatusBar />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Back */}
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 mb-8 group"
            style={{ color: 'rgba(148,163,184,0.6)' }}
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-[10px] uppercase tracking-widest group-hover:text-purple-400 transition-colors">
              Back to Login
            </span>
          </Link>

          {/* Card */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(8, 12, 20, 0.85)',
              border: '1px solid rgba(167,139,250,0.15)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 0 60px rgba(167,139,250,0.05), 0 32px 64px rgba(0,0,0,0.5)',
            }}
          >
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(167,139,250,0.08)',
                    border: '1px solid rgba(167,139,250,0.2)',
                    boxShadow: '0 0 20px rgba(167,139,250,0.1)',
                  }}
                >
                  <UserPlus size={22} className="text-purple-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold uppercase tracking-tighter text-white">
                    Create <span className="text-purple-400">Joyi Account</span>
                  </h1>
                  <p className="text-[10px] font-mono text-white/30 mt-0.5 uppercase tracking-widest">
                    {bootText}<BlinkCursor />
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="p-8 space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-purple-400/60">
                  <span className="text-purple-400/40 mr-1">{'>'}</span> System Permissions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-3.5 px-4 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all border ${
                      role === 'user'
                        ? 'border-purple-400 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(167,139,250,0.15)]'
                        : 'border-white/5 bg-white/[0.02] text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                    }`}
                  >
                    User (AI Chat)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-3.5 px-4 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all border ${
                      role === 'admin'
                        ? 'border-purple-400 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(167,139,250,0.15)]'
                        : 'border-white/5 bg-white/[0.02] text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                    }`}
                  >
                    Admin (Studio)
                  </button>
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-purple-400/60">
                  <span className="text-purple-400/40 mr-1">{'>'}</span> User Identifier
                </label>
                <div className="relative group">
                  <User
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors duration-200"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(''); }}
                    placeholder="user_username"
                    autoComplete="username"
                    className="w-full py-3.5 pl-11 pr-4 rounded-xl text-sm text-white placeholder:text-white/15 outline-none transition-all duration-200 font-mono"
                    style={inputStyle}
                    onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.currentTarget.style, inputBlurStyle)}
                  />
                </div>
                <p className="font-mono text-[9px] text-white/20 pl-1">Letters, numbers, underscores only · 3–20 chars</p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-purple-400/60">
                  <span className="text-purple-400/40 mr-1">{'>'}</span> Access Key
                </label>
                <div className="relative group">
                  <Lock
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors duration-200"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full py-3.5 pl-11 pr-12 rounded-xl text-sm text-white placeholder:text-white/15 outline-none transition-all duration-200 font-mono"
                    style={inputStyle}
                    onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.currentTarget.style, inputBlurStyle)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-purple-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            i <= strengthLevel ? strengthConfig[strengthLevel]?.color || 'bg-white/10' : 'bg-white/8'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Strength</span>
                      <span className={`font-mono text-[9px] uppercase tracking-widest ${
                        strengthLevel >= 4 ? 'text-emerald-400' : strengthLevel >= 3 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {strengthConfig[strengthLevel]?.label || ''}
                      </span>
                    </div>
                    {/* Requirements checklist */}
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      {requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {req.met
                            ? <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0" />
                            : <XCircle size={11} className="text-white/20 flex-shrink-0" />
                          }
                          <span className={`font-mono text-[9px] transition-colors ${req.met ? 'text-emerald-400/70' : 'text-white/20'}`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-purple-400/60">
                  <span className="text-purple-400/40 mr-1">{'>'}</span> Confirm Access Key
                </label>
                <div className="relative group">
                  <Lock
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors duration-200"
                  />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full py-3.5 pl-11 pr-12 rounded-xl text-sm text-white placeholder:text-white/15 outline-none transition-all duration-200 font-mono"
                    style={{
                      ...inputStyle,
                      ...(passwordsMatch ? { border: '1px solid rgba(52,211,153,0.3)' } : {}),
                      ...(passwordMismatch ? { border: '1px solid rgba(239,68,68,0.3)' } : {}),
                    }}
                    onFocus={e => Object.assign(e.currentTarget.style, {
                      ...inputFocusStyle,
                      ...(passwordMismatch ? { border: '1px solid rgba(239,68,68,0.4)' } : {}),
                    })}
                    onBlur={e => Object.assign(e.currentTarget.style, {
                      ...inputBlurStyle,
                      ...(passwordsMatch ? { border: '1px solid rgba(52,211,153,0.3)' } : {}),
                      ...(passwordMismatch ? { border: '1px solid rgba(239,68,68,0.3)' } : {}),
                    })}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {passwordsMatch && <CheckCircle2 size={13} className="text-emerald-400" />}
                    {passwordMismatch && <XCircle size={13} className="text-red-400" />}
                    <button
                      type="button"
                      onClick={() => setShowConfirm(s => !s)}
                      className="text-white/20 hover:text-purple-400 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                {passwordMismatch && (
                  <p className="font-mono text-[9px] text-red-400 pl-1 flex items-center gap-1">
                    <AlertCircle size={9} /> Passwords do not match
                  </p>
                )}
                {passwordsMatch && (
                  <p className="font-mono text-[9px] text-emerald-400 pl-1 flex items-center gap-1">
                    <CheckCircle2 size={9} /> Passwords match
                  </p>
                )}
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                      <span className="text-xs font-mono text-red-400">{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full relative py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 overflow-hidden transition-all disabled:cursor-not-allowed"
                style={{
                  background: loading ? 'rgba(167,139,250,0.1)' : 'rgba(167,139,250,1)',
                  color: loading ? 'rgba(167,139,250,0.4)' : '#04060a',
                  border: loading ? '1px solid rgba(167,139,250,0.2)' : 'none',
                  boxShadow: loading ? 'none' : '0 0 30px rgba(167,139,250,0.3)',
                }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                    <span className="font-mono text-purple-400">Creating Identity...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    Register Account
                    <ArrowRight size={14} className="ml-auto" />
                  </>
                )}
              </motion.button>

              {/* Login link */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-white/5" />
                <span className="font-mono text-[9px] text-white/15 uppercase tracking-widest">or</span>
                <div className="flex-1 h-[1px] bg-white/5" />
              </div>
              <Link
                to="/admin"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-[11px] uppercase tracking-widest transition-all"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.3)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)';
                  e.currentTarget.style.color = 'rgba(167,139,250,0.7)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
                }}
              >
                Already have an account? Sign In
              </Link>
            </form>

            {/* Footer */}
            <div className="px-8 pb-6 flex items-center justify-between">
              <span className="font-mono text-[9px] text-white/15 uppercase tracking-widest">
                Secure_Registration_Protocol v2.0
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
                <span className="font-mono text-[9px] text-white/15 uppercase tracking-widest">Encrypted</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
          </div>

          <p className="text-center font-mono text-[9px] text-white/10 uppercase tracking-widest mt-6">
            JOYI_CMS · All registrations are audited
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
