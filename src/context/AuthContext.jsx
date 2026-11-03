import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProfile = useCallback(async () => {
    try {
      const p = await api.getProfile();
      setProfile(p);
      setIsOnline(p.is_online);
      return p;
    } catch (err) {
      console.error('Failed to load partner profile:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem('partner_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const u = await api.getCurrentUser();
        if (u.role !== 'delivery_partner' && u.role !== 'admin') {
          throw new Error('Access restricted: Delivery partner credentials required.');
        }
        setUser(u);
        await refreshProfile();
      } catch (err) {
        console.error('Session initialization error:', err);
        localStorage.removeItem('partner_token');
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, [refreshProfile]);

  const login = async (email, password) => {
    setError(null);
    try {
      const authData = await api.login(email, password);
      const u = await api.getCurrentUser();
      
      if (u.role !== 'delivery_partner' && u.role !== 'admin') {
        localStorage.removeItem('partner_token');
        throw new Error('Access restricted: This portal is exclusively for verified Delivery Partners.');
      }

      setUser(u);
      let p = null;
      try {
        p = await refreshProfile();
      } catch (profErr) {
        console.warn('Profile sync notification:', profErr);
      }
      return { user: u, profile: p, authData };
    } catch (err) {
      localStorage.removeItem('partner_token');
      setUser(null);
      setProfile(null);
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('partner_token');
    setUser(null);
    setProfile(null);
    setIsOnline(false);
  };

  const toggleOnlineStatus = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    try {
      const updated = await api.updateStatus(nextState, profile?.current_zone || 'Madhapur & HITEC City');
      setProfile(updated);
    } catch (err) {
      console.error('Failed to update online state:', err);
      // Revert on failure
      setIsOnline(!nextState);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isOnline,
        loading,
        error,
        isAuthenticated: Boolean(user),
        login,
        logout,
        toggleOnlineStatus,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

