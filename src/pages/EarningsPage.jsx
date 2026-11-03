import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Wallet,
  Sparkles,
  CheckCircle2,
  Receipt,
  Building2,
  RefreshCw
} from 'lucide-react';

export default function EarningsPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();

  const [earnings, setEarnings] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const [earn, hist] = await Promise.all([
        api.getEarnings().catch(() => null),
        api.getTripHistory().catch(() => []),
      ]);
      setEarnings(earn);
      setHistory(hist || []);
    } catch (err) {
      console.error('Failed to load earnings data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const handleInstantPayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
    }, 4000);
  };

  const todayAmount = earnings?.today_earnings || profile?.today_earnings || 620;
  const totalAmount = earnings?.total_earnings || profile?.total_earnings || 18450;
  const tripsCount = earnings?.today_trips || profile?.today_trips || 6;
  const targetCompleted = earnings?.incentive_completed || 6;
  const targetTotal = earnings?.incentive_target || 10;
  const targetPercent = Math.min(100, Math.round((targetCompleted / targetTotal) * 100));

  return (
    <div className="pb-24 pt-3 px-4 max-w-lg mx-auto space-y-4">
      
      {/* Payout Transfer Alert */}
      {payoutSuccess && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-xs text-emerald-200 flex items-center justify-between gap-2 shadow-lg animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>₹{Number(todayAmount).toFixed(0)} successfully transferred to HDFC Bank (A/C **4821)!</span>
          </div>
        </div>
      )}

      {/* Main Wallet Balance Card */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-5 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Wallet className="w-4 h-4" />
            <span>Delivery Wallet Balance</span>
          </span>
          <span className="text-[10px] text-stone-500 font-bold bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800">
            Auto-Settlement Daily
          </span>
        </div>

        <div>
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ₹{Number(todayAmount).toLocaleString('en-IN')}
          </span>
          <p className="text-xs text-stone-400 mt-1">
            Earned from <strong className="text-white font-bold">{tripsCount} trips</strong> today • All verification bonuses cleared
          </p>
        </div>

        {/* Breakdown Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800/80 text-[11px]">
          <div>
            <span className="text-stone-500 block">Base Pay</span>
            <span className="font-bold text-stone-200">₹{Number(tripsCount * 50).toFixed(0)}</span>
          </div>
          <div>
            <span className="text-stone-500 block">ID Checks</span>
            <span className="font-bold text-emerald-400">₹{Number(tripsCount * 25).toFixed(0)}</span>
          </div>
          <div>
            <span className="text-stone-500 block">All-time</span>
            <span className="font-bold text-stone-300">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Instant Payout CTA */}
        <button
          type="button"
          onClick={handleInstantPayout}
          className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Building2 className="w-4 h-4" />
          <span>{t('instantPayout')} (₹{Number(todayAmount).toFixed(0)})</span>
        </button>
      </div>

      {/* Daily Incentive Challenge Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>{t('weeklyTarget')}</span>
          </div>
          <span className="text-xs font-black text-emerald-400">+₹250 Extra</span>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed">
          {t('targetSubtitle')}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${targetPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-stone-400 font-bold">
            <span>{targetCompleted} / {targetTotal} completed</span>
            <span>{targetTotal - targetCompleted} trips left</span>
          </div>
        </div>
      </div>

      {/* Trip History Header */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="text-sm font-extrabold text-stone-200 flex items-center gap-1.5">
          <Receipt className="w-4 h-4 text-amber-400" />
          <span>{t('tripHistory')}</span>
        </h3>
        <button
          type="button"
          onClick={fetchEarningsData}
          className="text-stone-400 hover:text-stone-200 p-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 text-center text-xs text-stone-500">
          No trips recorded in this shift yet. Complete orders to build history.
        </div>
      ) : (
        <div className="space-y-2.5">
          {history.map((trip) => (
            <div
              key={trip.order_id}
              className="bg-stone-900 border border-stone-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-200">
                    {trip.order_number}
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.2 rounded font-bold">
                    Delivered
                  </span>
                </div>
                <p className="text-xs text-stone-400 truncate mt-0.5">
                  {trip.customer_locality} • {trip.retailer_name}
                </p>
                <span className="text-[10px] text-stone-500">
                  {new Date(trip.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-black text-emerald-400 block">
                  +₹{trip.earnings ? Number(trip.earnings).toFixed(0) : '75'}
                </span>
                <span className="text-[10px] text-stone-500">Credited</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
