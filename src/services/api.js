const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL;

function getBaseCandidates() {
  if (ENV_API_BASE) return [ENV_API_BASE];
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    // If running on port 5174, Vite proxy handles /api/v1; fallback directly to FastAPI on port 8000
    return ['/api/v1', 'http://localhost:8000/api/v1', 'http://127.0.0.1:8000/api/v1'];
  }
  return ['/api/v1'];
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('partner_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const candidates = getBaseCandidates();
  let lastError = null;

  for (let i = 0; i < candidates.length; i++) {
    const base = candidates[i];
    try {
      const res = await fetch(`${base}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        let errMessage = 'Request failed';
        try {
          const errData = await res.json();
          errMessage = errData.detail || errData.message || JSON.stringify(errData);
        } catch {
          errMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errMessage);
      }

      return await res.json();
    } catch (err) {
      lastError = err;
      // If network failure / connection refused on relative URL or localhost, try next candidate
      const isNetworkErr = err instanceof TypeError || (err.message && err.message.toLowerCase().includes('fetch'));
      if (isNetworkErr && i < candidates.length - 1) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('Network request failed');
}

export const api = {
  // Authentication
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      localStorage.setItem('partner_token', data.access_token);
    }
    return data;
  },

  getCurrentUser: () => request('/auth/me'),

  // Partner Duty & Status
  getProfile: () => request('/delivery/profile'),
  updateStatus: (isOnline, zone) =>
    request('/delivery/status', {
      method: 'PATCH',
      body: JSON.stringify({ is_online: isOnline, current_zone: zone }),
    }),

  // Orders & Fulfillment
  getAvailableOrders: () => request('/delivery/available-orders'),
  getActiveOrder: () => request('/delivery/active-order'),
  acceptOrder: (orderId) =>
    request(`/delivery/orders/${orderId}/accept`, {
      method: 'POST',
    }),
  pickupOrder: (orderId) =>
    request(`/delivery/orders/${orderId}/pickup`, {
      method: 'POST',
    }),
  completeDelivery: (orderId, payload) =>
    request(`/delivery/orders/${orderId}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // History & Earnings
  getTripHistory: () => request('/delivery/history'),
  getEarnings: () => request('/delivery/earnings'),
};

