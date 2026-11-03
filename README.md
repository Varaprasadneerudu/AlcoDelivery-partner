# AlcoRez Partner - Telangana Delivery & Verification App

A standalone, mobile-first Web Application for authorized alcoholic beverage transport and mandatory doorstep 21+ physical age verification across licensed Telangana outlets.

This is a completely separate project decoupled from the consumer/retailer portal (`alcodelivery`), integrating with the central backend API on `http://localhost:8000`.

---

## Key Features

1. **On-Duty Availability Radar**:
   - Real-time online/offline duty status toggle with active service zone tracking (e.g. Madhapur, Jubilee Hills, Gachibowli).
   - Live pool of available wine shop pickups showing store location, customer locality, package size, and estimated payout (₹65 - ₹85).
   - Quick one-tap order acceptance.

2. **Step-by-Step Delivery Execution Flow**:
   - **Step 1: Store Navigation**: Direction guidance to the licensed A4 retail wine shop, contact store shortcut, and arrival confirmation.
   - **Step 2: Wine Counter Verification**: Itemized checklist verifying tamper-evident excise seals and bottle quantities before departing.
   - **Step 3: En Route to Customer**: Turn-by-turn guidance to delivery address, customer landmark notes, and calling shortcut.
   - **Step 4: Doorstep Telangana 21+ Age Verification**:
     - Mandatory statutory checklist confirming physical inspection of government-issued age proof (Aadhaar, DL, Passport).
     - Customer 4-digit handover OTP validation (`order.delivery_otp`, e.g. `4821`).
     - Instant payout crediting to wallet upon legal handover.

3. **Earnings & Wallet**:
   - Real-time breakdown: Base pay, ID verification bonuses, and total daily earnings.
   - Daily incentive progress tracker (e.g. complete 10 trips for extra ₹250 bonus).
   - Simulated Instant Bank Payout transfer button.
   - Itemized trip history.

4. **Driver Profile & Excise Compliance**:
   - Digital Telangana Excise Delivery Permit badge (`TS-EXCISE-DP-2024-0982`).
   - Vehicle registration details (`TS 09 EB 4821 - Honda Activa 6G`).
   - Driving license records and customer rating (★ 4.92).

5. **Multi-Language Support**:
   - Full English and Telugu (తెలుగు) interface support.

---

## Quickstart & Development

### 1. Ensure Backend is Running
The delivery partner app connects to the `alcodelivery` backend at `http://localhost:8000`. Ensure the backend server is running:
```bash
cd ../alcodelivery/backend
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Install & Run Partner App
```bash
cd alcodelivery-partner
npm install
npm run dev
```
The partner app will start on: **`http://localhost:5174`**

---

## Demo Credentials

You can sign in with 1-click on the login screen or enter:
- **Email:** `partner@demo.com`
- **Password:** `Partner@123456`
- **Role:** `delivery_partner`
- **Name:** Suresh Kumar Goud
- **Vehicle:** Honda Activa 6G (TS 09 EB 4821)
- **Demo Customer OTP:** `4821`

---

## Project Structure

```
alcodelivery-partner/
├── index.html
├── package.json
├── vite.config.js          # Configured for port 5174 with /api proxy to :8000
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Header.jsx      # Top bar with Online/Offline duty toggle & language
│   │   ├── BottomNav.jsx   # Mobile bottom navigation tabs
│   │   └── StatutoryPartnerBanner.jsx
│   ├── context/
│   │   ├── AuthContext.jsx # Partner session & duty state
│   │   └── LanguageContext.jsx # English & Telugu dictionary
│   ├── pages/
│   │   ├── LoginPage.jsx   # Partner login & 1-click demo button
│   │   ├── RadarPage.jsx   # Available orders feed & acceptance
│   │   ├── ActiveTripPage.jsx # Multi-step trip & 21+ verification
│   │   ├── EarningsPage.jsx # Wallet, payouts & trip history
│   │   └── ProfilePage.jsx # Vehicle & Telangana Excise permit
│   └── services/
│       └── api.js          # API client for backend delivery endpoints
└── README.md
```

