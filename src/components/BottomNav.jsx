import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navigation, Wallet, User, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav({ hasActiveTrip }) {
  const { t } = useLanguage();

  const links = [
    {
      to: '/',
      label: t('radar'),
      icon: Radio,
      exact: true,
    },
    {
      to: '/active',
      label: t('activeTrip'),
      icon: Navigation,
      badge: hasActiveTrip,
    },
    {
      to: '/earnings',
      label: t('earnings'),
      icon: Wallet,
    },
    {
      to: '/profile',
      label: t('profile'),
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 pb-safe transition-colors duration-200">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-bold transition-all relative ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 scale-105'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {link.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                )}
                {link.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full" />
                )}
              </div>
              <span className="truncate">{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

