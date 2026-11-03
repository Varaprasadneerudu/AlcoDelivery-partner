import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  Navigation,
  Store,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  KeyRound
} from 'lucide-react';

export default function ActiveTripPage() {
  const { refreshProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stepper state: 'HEADING_TO_STORE' | 'AT_COUNTER' | 'HEADING_TO_CUSTOMER' | 'VERIFYING_HANDOVER'
  const [currentStep, setCurrentStep] = useState('HEADING_TO_STORE');

  // Checklist states
  const [sealChecked, setSealChecked] = useState(true);
  const [itemsChecked, setItemsChecked] = useState(true);

  // Handover states
  const [idChecked, setIdChecked] = useState(false);
  const [sobrietyChecked, setSobrietyChecked] = useState(false);
  const [otp, setOtp] = useState('');
  const [completedTripData, setCompletedTripData] = useState(null);

  const fetchActiveTrip = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getActiveOrder();
      setActiveOrder(data);
      if (data) {
        if (data.status === 'out_for_delivery') {
          setCurrentStep('HEADING_TO_CUSTOMER');
        } else {
          setCurrentStep('HEADING_TO_STORE');
        }
      }
    } catch (err) {
      console.error('Failed to load active trip:', err);
      setError(err.message || 'Failed to load active delivery trip');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveTrip();
  }, [fetchActiveTrip]);

  // Transitions
  const handleArrivedAtStore = () => {
    setCurrentStep('AT_COUNTER');
  };

  const handleConfirmPickup = async () => {
    if (!activeOrder) return;
    try {
      setActionLoading(true);
      setError(null);
      await api.pickupOrder(activeOrder.order_id);
      setCurrentStep('HEADING_TO_CUSTOMER');
    } catch (err) {
      setError(err.message || 'Failed to confirm pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArrivedAtCustomer = () => {
    setCurrentStep('VERIFYING_HANDOVER');
  };

  const handleCompleteHandover = async (e) => {
    e.preventDefault();
    if (!activeOrder) return;

    if (!idChecked || !sobrietyChecked) {
      setError('You must physically inspect and confirm customer 21+ government ID proof.');
      return;
    }

    if (!otp.trim()) {
      setError('Please enter the customer 4-digit handover OTP.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      await api.completeDelivery(activeOrder.order_id, {
        otp: otp.trim(),
        customer_age_verified: true,
        id_proof_checked: true,
        notes: 'Doorstep legal verification successfully completed',
      });
      await refreshProfile();
      setCompletedTripData({
        order_number: activeOrder.order_number,
        payout: 75,
        customer_name: activeOrder.customer_name,
        locality: activeOrder.customer_locality,
      });
    } catch (err) {
      setError(err.message || 'Failed to complete delivery');
    } finally {
      setActionLoading(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-3">
        <div className="w-9 h-9 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-stone-400">Loading trip details...</span>
      </div>
    );
  }

  // 2. Celebration Modal on Completion
  if (completedTripData) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-emerald-600 text-stone-950 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
            {t('celebrationTitle')}
          </span>
          <h2 className="text-3xl font-black text-white">
            +₹{completedTripData.payout} Credited
          </h2>
          <p className="text-xs text-stone-400">
            Order <strong className="text-stone-200">{completedTripData.order_number}</strong> delivered to {completedTripData.customer_name} ({completedTripData.locality}).
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 w-full text-left space-y-2 text-xs">
          <div className="flex justify-between text-stone-400">
            <span>Base Delivery Fee</span>
            <span className="font-bold text-stone-200">₹50.00</span>
          </div>
          <div className="flex justify-between text-stone-400">
            <span>Telangana 21+ Verification Incentive</span>
            <span className="font-bold text-emerald-400">+₹25.00</span>
          </div>
          <div className="border-t border-stone-800 pt-2 flex justify-between font-black text-sm text-white">
            <span>Total Trip Earning</span>
            <span className="text-emerald-400">₹75.00</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setCompletedTripData(null);
            setActiveOrder(null);
            navigate('/');
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-lg transition cursor-pointer"
        >
          {t('backToRadar')}
        </button>
      </div>
    );
  }

  // 3. Empty State (No Active Trip)
  if (!activeOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 py-12 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-stone-900 text-stone-600 flex items-center justify-center mx-auto border border-stone-800">
          <Navigation className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-stone-200">No Active Trip Right Now</h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
            Accept a wine pickup request from the Radar tab to begin a guided delivery trip.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition cursor-pointer"
        >
          Go to Radar Orders
        </button>
      </div>
    );
  }

  // 4. Guided Multi-Step Workflow
  return (
    <div className="pb-24 pt-3 px-4 max-w-lg mx-auto space-y-4">
      
      {/* Top Trip Header Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
            {t('tripHeading')}
          </span>
          <span className="font-mono text-sm font-black text-white">
            {activeOrder.order_number}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-stone-400 uppercase font-bold block">Trip Earning</span>
          <span className="text-sm font-black text-emerald-400">
            ₹{activeOrder.payout_amount ? Number(activeOrder.payout_amount).toFixed(0) : '75'}
          </span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
        <div
          className={`py-1.5 px-2 rounded-xl transition ${
            currentStep === 'HEADING_TO_STORE' || currentStep === 'AT_COUNTER'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-stone-900 text-stone-500'
          }`}
        >
          {t('step1Store')}
        </div>
        <div
          className={`py-1.5 px-2 rounded-xl transition ${
            currentStep === 'HEADING_TO_CUSTOMER'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-stone-900 text-stone-500'
          }`}
        >
          {t('step2Transit')}
        </div>
        <div
          className={`py-1.5 px-2 rounded-xl transition ${
            currentStep === 'VERIFYING_HANDOVER'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-stone-900 text-stone-500'
          }`}
        >
          {t('step3Verify')}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Heading to Store */}
      {currentStep === 'HEADING_TO_STORE' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Store className="w-4 h-4" />
            <span>Step 1: Head to Licensed Wine Outlet for Pickup</span>
          </div>

          {/* Store Info Card */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
            <h3 className="font-extrabold text-sm text-white">{activeOrder.retailer_name}</h3>
            <p className="text-xs text-stone-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeOrder.retailer_address}</span>
            </p>
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${activeOrder.retailer_phone || '+914023456789'}`}
                className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>Call Store</span>
              </a>
              <span className="text-[11px] text-stone-500">~800 meters away (~3 mins ride)</span>
            </div>
          </div>

          {/* Interactive Simulated Map Box */}
          <div className="relative h-36 bg-gradient-to-br from-stone-950 to-stone-900 rounded-xl border border-stone-800 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-stone-200">Simulated GPS Navigation</span>
            <span className="text-[10px] text-stone-500">Take Madhapur 100 Feet Road towards Ayyappa Society</span>
          </div>

          <button
            type="button"
            onClick={handleArrivedAtStore}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{t('arrivedAtStore')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: At Store Counter Pickup */}
      {currentStep === 'AT_COUNTER' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Package className="w-4 h-4" />
            <span>Step 2: Collect & Verify Package at Wine Counter</span>
          </div>

          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              Items to Collect
            </span>
            <p className="text-xs font-bold text-white">{activeOrder.items_summary}</p>
            <p className="text-[11px] text-stone-500">Total units: {activeOrder.items_count} bottles</p>
          </div>

          {/* Mandatory Checklist */}
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2.5 p-2.5 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={sealChecked}
                onChange={(e) => setSealChecked(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="text-stone-300 font-semibold">{t('verifySeal')}</span>
            </label>

            <label className="flex items-center gap-2.5 p-2.5 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={itemsChecked}
                onChange={(e) => setItemsChecked(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="text-stone-300 font-semibold">{t('verifyBottleSize')}</span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleConfirmPickup}
            disabled={actionLoading || !sealChecked || !itemsChecked}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {actionLoading ? 'Updating Order Status...' : t('confirmPickupBtn')}
          </button>
        </div>
      )}

      {/* STEP 3: In Transit to Customer */}
      {currentStep === 'HEADING_TO_CUSTOMER' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Navigation className="w-4 h-4 animate-spin" />
            <span>Step 3: En Route to Customer</span>
          </div>

          {/* Customer Destination Card */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-white">{activeOrder.customer_name}</h3>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-bold">
                21+ Verified
              </span>
            </div>
            <p className="text-xs text-stone-300 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{activeOrder.customer_address}</span>
            </p>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${activeOrder.customer_phone || '+919876543210'}`}
                className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>Call Customer</span>
              </a>
              <span className="text-[11px] text-stone-500">~2.4 km (~10 mins ride)</span>
            </div>
          </div>

          {/* Turn by turn guidance preview */}
          <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-xs text-stone-300 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white leading-tight">In 400m, turn right</p>
              <p className="text-[11px] text-stone-500">Towards Royal Palms Apartments main gate</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleArrivedAtCustomer}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Arrived at Customer Doorstep</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4: Legal Handover & Verification */}
      {currentStep === 'VERIFYING_HANDOVER' && (
        <form onSubmit={handleCompleteHandover} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Step 4: Statutory 21+ Age Check & Handover OTP</span>
          </div>

          {/* Telangana Excise Statutory Warning Notice */}
          <div className="p-3.5 bg-amber-950/50 border border-amber-800/60 rounded-xl text-xs text-amber-200 space-y-1">
            <p className="font-black text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{t('statutory21CheckTitle')}</span>
            </p>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              {t('statutory21CheckDesc')}
            </p>
          </div>

          {/* Verification Checkboxes */}
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2.5 p-3 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={idChecked}
                onChange={(e) => setIdChecked(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="text-stone-200 font-bold">{t('idProofVerified')}</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 bg-stone-950 rounded-xl border border-stone-800 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={sobrietyChecked}
                onChange={(e) => setSobrietyChecked(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="text-stone-200 font-bold">{t('customerSobrietyVerified')}</span>
            </label>
          </div>

          {/* Customer OTP Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-stone-200 uppercase tracking-wider text-[11px]">
                {t('enterOtpTitle')}
              </label>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                Demo OTP: {activeOrder.delivery_otp || '4821'}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={t('otpPlaceholder')}
                className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm font-mono tracking-widest text-center text-white placeholder-stone-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
              <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={actionLoading || !idChecked || !sobrietyChecked || !otp}
            className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {actionLoading ? 'Verifying & Completing...' : t('completeDeliveryBtn')}
          </button>
        </form>
      )}

    </div>
  );
}
