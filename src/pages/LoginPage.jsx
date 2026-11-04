import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bike, ShieldCheck, ArrowRight, Lock, Mail, AlertTriangle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoPartner = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('partner@demo.com', 'Partner@123456');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-center px-4 py-8 relative transition-colors duration-200">
      <div className="absolute top-4 right-4 z-10">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-amber-400 border border-stone-200 dark:border-stone-700 transition flex items-center justify-center cursor-pointer shadow-xs"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
        </button>
      </div>
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-600/20">
            <Bike className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            AlcoRez <span className="text-amber-400">Partner</span>
          </h1>
          <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
            Telangana Licensed Alcoholic Beverage Transport & Doorstep Age Verification Portal
          </p>
        </div>

        {/* 1-Click Demo Partner Access */}
        <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Instant Demo Partner Sign In</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoPartner}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <div className="text-left">
              <p className="font-extrabold text-sm leading-tight">
                {loading ? 'Authenticating...' : 'Suresh Kumar Goud'}
              </p>
              <p className="text-[10px] text-amber-200">Honda Activa 6G • TS 09 EB 4821</p>
            </div>
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <ArrowRight className="w-4 h-4 shrink-0" />
            )}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Manual Credentials Form */}
        <form onSubmit={handleManualLogin} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Partner Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@demo.com"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In with Credentials'}
          </button>
        </form>

        {/* Regulatory footer note */}
        <div className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Compliant with Telangana Excise Transport Directives</span>
        </div>

      </div>
    </div>
  );
}
