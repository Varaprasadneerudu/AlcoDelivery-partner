import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Bike,
  Star,
  LogOut,
  PhoneCall,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-lg mx-auto space-y-4">
      
      {/* Identity Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-stone-950 font-black text-xl flex items-center justify-center shadow-md shrink-0">
            {profile?.full_name?.charAt(0) || user?.full_name?.charAt(0) || 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-white truncate">
                {profile?.full_name || user?.full_name || 'Suresh Kumar Goud'}
              </h2>
              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
            <p className="text-xs text-stone-400 truncate">{user?.email || 'partner@demo.com'}</p>
            <p className="text-xs text-stone-400">{profile?.phone || '+91-9876501234'}</p>
          </div>
        </div>

        {/* State Excise Permit Pill */}
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-amber-200 block text-[11px]">
                Telangana Excise Delivery Badge
              </span>
              <span className="font-mono text-[10px] text-amber-400">
                {profile?.compliance_permit_no || 'TS-EXCISE-DP-2024-0982'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
            Active
          </span>
        </div>
      </div>

      {/* Vehicle & Verification Details */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
          <Bike className="w-4 h-4 text-amber-400" />
          <span>Vehicle & Documents</span>
        </h3>

        <div className="space-y-2 text-xs divide-y divide-stone-800/80">
          <div className="flex justify-between items-center pt-1">
            <span className="text-stone-400">Vehicle Registered</span>
            <span className="font-bold text-stone-200">{profile?.vehicle_type || 'Honda Activa 6G'}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-stone-400">License Plate</span>
            <span className="font-mono font-bold text-amber-400">{profile?.vehicle_number || 'TS 09 EB 4821'}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-stone-400">Driving License</span>
            <span className="font-mono font-bold text-stone-200">{profile?.driving_license_number || 'DL-TS-2022-987654'}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-stone-400">Identity KYC</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aadhaar Verified</span>
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-stone-400">Assigned Zone</span>
            <span className="font-bold text-stone-200">{profile?.current_zone || 'Madhapur & HITEC City'}</span>
          </div>
        </div>
      </div>

      {/* Ratings & Performance Summary */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-400" />
          <span>Ratings & Performance</span>
        </h3>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-2xl font-black text-amber-400">
              ★ {profile?.rating ? Number(profile.rating).toFixed(2) : '4.92'}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Customer Rating</span>
          </div>

          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
            <span className="text-2xl font-black text-emerald-400">
              {profile?.total_trips || '42'}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Total Trips Completed</span>
          </div>
        </div>
      </div>

      {/* Support & Helpline */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-xs">
        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
          Helpline & Safety
        </span>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-stone-200">Excise Partner Support</p>
            <p className="text-[11px] text-stone-500">24x7 Driver Emergency Dispatch</p>
          </div>
          <a
            href="tel:+914023456789"
            className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>Call Help</span>
          </a>
        </div>
      </div>

      {/* Logout Action */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-red-950/60 hover:bg-red-950 text-red-300 border border-red-800/60 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        <LogOut className="w-4 h-4" />
        <span>{t('logout')}</span>
      </button>

    </div>
  );
}
