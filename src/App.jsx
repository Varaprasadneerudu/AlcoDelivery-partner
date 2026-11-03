import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import StatutoryPartnerBanner from './components/StatutoryPartnerBanner';
import LoginPage from './pages/LoginPage';
import RadarPage from './pages/RadarPage';
import ActiveTripPage from './pages/ActiveTripPage';
import EarningsPage from './pages/EarningsPage';
import ProfilePage from './pages/ProfilePage';
import { api } from './services/api';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [hasActiveTrip, setHasActiveTrip] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkActive = async () => {
      try {
        const active = await api.getActiveOrder();
        setHasActiveTrip(Boolean(active));
      } catch {
        setHasActiveTrip(false);
      }
    };

    checkActive();
    const timer = setInterval(checkActive, 10000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-stone-400">Loading AlcoRez Partner...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      <Header />
      <StatutoryPartnerBanner />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<RadarPage />} />
          <Route path="/active" element={<ActiveTripPage />} />
          <Route path="/earnings" element={<EarningsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav hasActiveTrip={hasActiveTrip} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

