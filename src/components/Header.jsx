import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Globe, MapPin } from 'lucide-react';

export default function Header() {
  const { user, profile, isOnline, toggleOnlineStatus } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 px-4 py-2.5">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        
        {/* Brand & Driver Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-stone-950 font-black flex items-center justify-center text-sm shadow-md shrink-0">
            AR
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-stone-100 truncate">
                {profile?.full_name?.split(' ')[0] || user?.full_name?.split(' ')[0] || 'Partner'}
              </span>
              <span className="inline-flex items-center text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.2 rounded font-bold">
                ★ {profile?.rating ? Number(profile.rating).toFixed(2) : '4.92'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-400 truncate">
              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate">{profile?.current_zone?.split(' &')[0] || 'Madhapur'}</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Duty Toggle & Lang */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-bold transition flex items-center gap-1"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">{language === 'en' ? 'తె' : 'EN'}</span>
          </button>

          {/* Online / Offline Switch */}
          <button
            type="button"
            onClick={toggleOnlineStatus}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/40'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-400 border border-stone-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-white animate-pulse' : 'bg-stone-500'
              }`}
            />
            <span>{isOnline ? t('online') : t('offline')}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
