import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Radio,
  Store,
  MapPin,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Package,
  Navigation,
} from 'lucide-react';

export default function RadarPage() {
  const { profile, isOnline, toggleOnlineStatus } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchRadarData = useCallback(async () => {
    try {
      setLoading(true);
      setActionError(null);
      const [avail, active] = await Promise.all([
        api.getAvailableOrders().catch(() => []),
        api.getActiveOrder().catch(() => null),
      ]);
      setOrders(avail || []);
      setActiveOrder(active);
    } catch (err) {
      console.error('Failed to fetch available orders:', err);
      setActionError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRadarData();
    const interval = setInterval(fetchRadarData, 12000);
    return () => clearInterval(interval);
  }, [fetchRadarData]);

  const handleAcceptOrder = async (orderId) => {
    try {
      setAcceptingId(orderId);
      setActionError(null);
      await api.acceptOrder(orderId);
      navigate('/active');
    } catch (err) {
      setActionError(err.message || 'Failed to accept order');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-lg mx-auto space-y-4">
      
      {/* Active Trip Banner if currently carrying an order */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 p-4 rounded-2xl shadow-lg shadow-amber-600/20 flex items-center justify-between gap-3 animate-pulse">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-stone-900">
              <Navigation className="w-3.5 h-3.5 shrink-0" />
              <span>Trip In Progress ({activeOrder.order_number})</span>
            </div>
            <p className="text-xs font-bold text-white truncate mt-0.5">
              {activeOrder.customer_locality} • {activeOrder.retailer_name}
            </p>
          </div>
          <Link
            to="/active"
            className="py-2 px-3.5 rounded-xl bg-stone-950 text-amber-400 font-extrabold text-xs shadow shrink-0 flex items-center gap-1 hover:bg-stone-900 transition"
          >
            <span>Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Duty Status Banner */}
      {!isOnline ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-200">{t('offDutyNotice')}</h3>
            <p className="text-xs text-stone-500 mt-1">
              Switch duty online to receive nearby wine shop pickups in {profile?.current_zone || 'Madhapur'}.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleOnlineStatus}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
          >
            Go Online Now
          </button>
        </div>
      ) : (
        <div className="bg-stone-900/80 border border-emerald-900/40 rounded-2xl p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-400">{t('onDutyNotice')}</span>
          </div>
          <span className="text-[11px] font-semibold text-stone-400">
            {profile?.current_zone?.split(' &')[0] || 'Madhapur'}
          </span>
        </div>
      )}

      {/* Today's KPI Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-stone-900 border border-stone-800/80 p-3 rounded-2xl text-center">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
            {t('todayEarnings')}
          </span>
          <span className="text-lg font-black text-amber-400 mt-0.5 block">
            ₹{profile?.today_earnings ? Number(profile.today_earnings).toFixed(0) : '620'}
          </span>
        </div>

        <div className="bg-stone-900 border border-stone-800/80 p-3 rounded-2xl text-center">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
            {t('tripsCompleted')}
          </span>
          <span className="text-lg font-black text-stone-100 mt-0.5 block">
            {profile?.today_trips || '6'}
          </span>
        </div>

        <div className="bg-stone-900 border border-stone-800/80 p-3 rounded-2xl text-center">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
            {t('driverRating')}
          </span>
          <span className="text-lg font-black text-emerald-400 mt-0.5 block">
            ★ {profile?.rating ? Number(profile.rating).toFixed(2) : '4.92'}
          </span>
        </div>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Feed Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-extrabold text-stone-100">
            {t('availableOrdersTitle')}
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-800 text-stone-300 border border-stone-700">
            {orders.length}
          </span>
        </div>

        <button
          type="button"
          onClick={fetchRadarData}
          disabled={loading}
          className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 transition"
          title="Refresh orders"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Available Orders List */}
      {loading && orders.length === 0 ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-stone-900/60 rounded-2xl border border-stone-800/60 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-800 text-stone-500 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-300">{t('noOrdersTitle')}</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
              {t('noOrdersDesc')}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchRadarData}
            className="py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 transition"
          >
            {t('refreshBtn')}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((ord) => (
            <div
              key={ord.order_id}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md space-y-3 hover:border-amber-500/40 transition-all"
            >
              {/* Order Header: Payout & Badge */}
              <div className="flex items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {ord.order_number}
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded-full font-bold">
                    Ready for Pickup
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Payout</span>
                  <span className="text-base font-black text-emerald-400 leading-tight">
                    ₹{ord.payout_amount ? Number(ord.payout_amount).toFixed(0) : '65'}
                  </span>
                </div>
              </div>

              {/* Route & Locality Details */}
              <div className="space-y-2 text-xs">
                {/* Store Pickup point */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-amber-950/60 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-stone-200 truncate">{ord.retailer_name}</p>
                    <p className="text-[11px] text-stone-400 truncate">{ord.retailer_address}</p>
                  </div>
                </div>

                {/* Drop point */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-stone-200 truncate">{ord.customer_locality}</p>
                    <p className="text-[11px] text-stone-500 truncate">{ord.items_summary}</p>
                  </div>
                </div>
              </div>

              {/* Distance and ETA */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400 bg-stone-950/60 px-3 py-2 rounded-xl">
                <span>Trip Distance: <strong className="text-stone-200 font-bold">{ord.estimated_distance_km || '3.2'} km</strong></span>
                <span>Est. Time: <strong className="text-stone-200 font-bold">~18 mins</strong></span>
              </div>

              {/* Accept CTA Button */}
              <button
                type="button"
                onClick={() => handleAcceptOrder(ord.order_id)}
                disabled={Boolean(acceptingId) || !isOnline}
                className="w-full py-3 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {acceptingId === ord.order_id ? (
                  <span>Accepting Order...</span>
                ) : !isOnline ? (
                  <span>Go Online to Accept</span>
                ) : (
                  <>
                    <span>{t('acceptOrderBtn')} (₹{Number(ord.payout_amount || 65).toFixed(0)})</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
