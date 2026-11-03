import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function StatutoryPartnerBanner() {
  const { language } = useLanguage();

  return (
    <div className="bg-amber-950/40 border-b border-amber-800/40 px-3 py-1.5 text-[11px] text-amber-200/90 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 truncate">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate">
          {language === 'te'
            ? 'తెలంగాణ ఎక్సైజ్ నిబంధన: హ్యాండ్‌ఓవర్ సమయంలో 21+ వయస్సు ధృవీకరణ తప్పనిసరి.'
            : 'Telangana Excise Transport Protocol: Mandatory 21+ Physical Age Verification.'}
        </span>
      </div>
      <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider shrink-0">
        Demo Mode
      </span>
    </div>
  );
}
