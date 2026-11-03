import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const DICTIONARY = {
  en: {
    // Header & Navigation
    appName: 'AlcoRez Partner',
    subTitle: 'Telangana Delivery & Verification',
    online: 'Online',
    offline: 'Offline',
    radar: 'Radar',
    activeTrip: 'Active Trip',
    earnings: 'Earnings',
    profile: 'Profile',
    logout: 'Logout',
    
    // Radar / Available Orders
    onDutyNotice: 'You are ONLINE and receiving orders',
    offDutyNotice: 'You are OFFLINE. Toggle switch to start receiving orders',
    todayEarnings: "Today's Earnings",
    tripsCompleted: 'Trips Completed',
    driverRating: 'Rating',
    availableOrdersTitle: 'Available Pickups Near You',
    noOrdersTitle: 'Searching for nearby orders...',
    noOrdersDesc: 'Stay online in active zones like Madhapur or Jubilee Hills to receive high-payout orders.',
    refreshBtn: 'Refresh Radar',
    pickupFrom: 'Pickup from',
    deliverTo: 'Deliver to',
    estDistance: 'Distance',
    estPayout: 'Est. Earnings',
    acceptOrderBtn: 'Accept Delivery',
    swipeToAccept: 'Swipe or Tap to Accept',
    orderExpiresIn: 'Offer expires in',

    // Active Trip
    tripHeading: 'Active Delivery Trip',
    step1Store: '1. Store Pickup',
    step2Transit: '2. In Transit',
    step3Verify: '3. Legal Handover',
    arrivedAtStore: 'I Have Arrived at Store',
    counterVerification: 'Wine Counter Pickup Checklist',
    verifySeal: 'Verify tamper-evident excise seal is intact',
    verifyBottleSize: 'Match bottle size and brand count',
    confirmPickupBtn: 'Confirm Pickup & Start Navigation',
    headingToCustomer: 'Navigating to Customer Address',
    callCustomer: 'Call Customer',
    callRetailer: 'Call Wine Shop',
    statutory21CheckTitle: 'Mandatory Telangana 21+ Age Check',
    statutory21CheckDesc: 'You must inspect Government ID proof before handing over beverages.',
    idProofVerified: 'Physically verified 21+ Government ID proof (Aadhaar / DL)',
    customerSobrietyVerified: 'Customer is sober and of legal age as per Excise Act',
    enterOtpTitle: 'Customer Handover 4-Digit OTP',
    otpPlaceholder: 'Enter 4-digit code (Hint: 4821)',
    completeDeliveryBtn: 'Complete Legal Handover & Credit Payout',
    celebrationTitle: 'Trip Completed Successfully!',
    payoutCredited: 'Payout Credited to Wallet',
    backToRadar: 'Back to Radar',

    // Earnings
    dailyEarnings: 'Daily Summary',
    weeklyTarget: 'Daily Incentive Target',
    targetSubtitle: 'Complete 10 trips today for ₹250 extra bonus',
    tripHistory: 'Trip History',
    instantPayout: 'Instant Bank Transfer',
    transferSuccess: '₹{amount} transferred to your linked bank account!',

    // Profile & Compliance
    partnerProfile: 'Partner Profile & Compliance',
    permitBadge: 'TS Excise Delivery Permit Verified',
    vehicleDetails: 'Vehicle Details',
    drivingLicense: 'Driving License',
    activeZone: 'Active Zone',
    kycStatus: 'KYC Status',
    verified: 'Verified',
  },
  te: {
    // Header & Navigation
    appName: 'ఆల్కోరెజ్ పార్ట్‌నర్',
    subTitle: 'తెలంగాణ డెలివరీ & వెరిఫికేషన్',
    online: 'ఆన్‌లైన్',
    offline: 'ఆఫ్‌లైన్',
    radar: 'రాడార్ ఆర్డర్లు',
    activeTrip: 'యాక్టివ్ ట్రిప్',
    earnings: 'ఆదాయం',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్ అవుట్',
    
    // Radar / Available Orders
    onDutyNotice: 'మీరు ఆన్‌లైన్‌లో ఉన్నారు, ఆర్డర్‌లు అందుతున్నాయి',
    offDutyNotice: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు. ఆర్డర్‌లు పొందడానికి ఆన్‌లైన్ చేయండి',
    todayEarnings: 'నేటి ఆదాయం',
    tripsCompleted: 'పూర్తయిన ట్రిప్పులు',
    driverRating: 'రేటింగ్',
    availableOrdersTitle: 'మీ సమీపంలో అందుబాటులో ఉన్న పికప్‌లు',
    noOrdersTitle: 'సమీప ఆర్డర్ల కోసం శోధిస్తోంది...',
    noOrdersDesc: 'మాదాపూర్ లేదా జూబ్లీహిల్స్ పరిధిలో అధిక ఆదాయం గల ఆర్డర్‌ల కోసం ఆన్‌లైన్‌లో ఉండండి.',
    refreshBtn: 'రిఫ్రెష్ చేయండి',
    pickupFrom: 'పికప్ స్టోర్',
    deliverTo: 'డెలివరీ చిరునామా',
    estDistance: 'దూరం',
    estPayout: 'అంచనా ఆదాయం',
    acceptOrderBtn: 'ఆర్డర్ స్వీకరించండి',
    swipeToAccept: 'స్వీకరించడానికి నొక్కండి',
    orderExpiresIn: 'ఆఫర్ ముగింపు సమయం',

    // Active Trip
    tripHeading: 'యాక్టివ్ డెలివరీ ట్రిప్',
    step1Store: '1. స్టోర్ పికప్',
    step2Transit: '2. ప్రయాణంలో ఉంది',
    step3Verify: '3. చట్టబద్ధమైన డెలివరీ',
    arrivedAtStore: 'నేను వైన్ షాపుకు చేరుకున్నాను',
    counterVerification: 'వైన్ కౌంటర్ పికప్ చెక్‌లిస్ట్',
    verifySeal: 'ఎక్సైజ్ సీల్ పక్కాగా ఉందో లేదో తనిఖీ చేయండి',
    verifyBottleSize: 'బాటిల్ సైజు మరియు సంఖ్యను సరిచూడండి',
    confirmPickupBtn: 'పికప్ నిర్ధారించండి & బయలుదేరండి',
    headingToCustomer: 'కస్టమర్ చిరునామాకు వెళుతున్నారు',
    callCustomer: 'కస్టమర్‌కు కాల్ చేయండి',
    callRetailer: 'వైన్ షాపుకు కాల్ చేయండి',
    statutory21CheckTitle: 'తప్పనిసరి తెలంగాణ 21+ వయస్సు తనిఖీ',
    statutory21CheckDesc: 'మద్యం ప్యాకేజీని అప్పగించే ముందు ప్రభుత్వ గుర్తింపు కార్డును పరిశీలించాలి.',
    idProofVerified: 'ప్రభుత్వ గుర్తింపు కార్డు (21+ వయస్సు) తనిఖీ చేయబడింది',
    customerSobrietyVerified: 'కస్టమర్ చట్టబద్ధమైన వయస్సు కలిగి ఉన్నారు',
    enterOtpTitle: 'కస్టమర్ హ్యాండ్‌ఓవర్ 4-అంకెల OTP',
    otpPlaceholder: '4-అంకెల కోడ్ నమోదు చేయండి (సూచన: 4821)',
    completeDeliveryBtn: 'చట్టబద్ధమైన డెలివరీ పూర్తి చేసి డబ్బు పొందండి',
    celebrationTitle: 'ట్రిప్ విజయవంతంగా పూర్తయింది!',
    payoutCredited: 'ఆదాయం మీ వాలెట్‌కు జమ చేయబడింది',
    backToRadar: 'తిరిగి రాడార్‌కు వెళ్లండి',

    // Earnings
    dailyEarnings: 'రోజువారీ నివేదిక',
    weeklyTarget: 'రోజువారీ ప్రోత్సాహక లక్ష్యం',
    targetSubtitle: '₹250 అదనపు బోనస్ కోసం నేడు 10 ట్రిప్పులు పూర్తి చేయండి',
    tripHistory: 'ట్రిప్ చరిత్ర',
    instantPayout: 'తక్షణ బ్యాంక్ బదిలీ',
    transferSuccess: 'మీ బ్యాంక్ ఖాతాకు ₹{amount} బదిలీ చేయబడింది!',

    // Profile & Compliance
    partnerProfile: 'డెలివరీ భాగస్వామి ప్రొఫైల్',
    permitBadge: 'తెలంగాణ ఎక్సైజ్ డెలివరీ అనుమతి ధృవీకరించబడింది',
    vehicleDetails: 'వాహనం వివరాలు',
    drivingLicense: 'డ్రైవింగ్ లైసెన్స్',
    activeZone: 'ప్రస్తుత జోన్',
    kycStatus: 'కేవైసీ స్థితి',
    verified: 'ధృవీకరించబడింది',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('partner_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('partner_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const t = (key, fallback = '') => {
    const dict = DICTIONARY[language] || DICTIONARY.en;
    return dict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

