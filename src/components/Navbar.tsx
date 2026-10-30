import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Volume2,
  VolumeX,
  Languages,
  UserCheck,
  Shield,
  Hammer,
  User,
  Menu,
  X,
  Compass,
  Boxes,
  Ruler,
  FileText,
  Users,
  Camera
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
  openProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  openProfileModal
}) => {
  const {
    currentUser,
    switchRole,
    language,
    setLanguage,
    t,
    soundEnabled,
    setSoundEnabled,
    playSparkSound
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.home, icon: Compass },
    { id: 'welders', label: 'Welders', icon: Users },
    { id: 'configurator', label: t.configurator, icon: Boxes },
    { id: 'measurements', label: t.measurements, icon: Ruler },
    { id: 'orders', label: t.orders, icon: FileText },
    { id: 'camera', label: t.camera, icon: Camera },
    { id: 'jobs', label: t.jobsCommunity, icon: Hammer }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    playSparkSound();
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'welder':
        return { label: 'Welder / Shop', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'customer':
        return { label: 'Customer', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' };
      case 'admin':
        return { label: 'Master Admin', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'worker':
        return { label: 'Shop Worker', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'User', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark (One element, single line) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 p-0.5 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-wider text-white font-heading leading-none flex items-center gap-1">
                  WELDBRO
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-amber-500 text-slate-950 font-bold rounded">
                    PRO
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-sans tracking-wide">
                  Smart Welding Hub
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  activeTab === item.id
                    ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleTabClick('jobs')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'jobs'
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Jobs & Community
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action Area & Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSparkSound();
              }}
              title={soundEnabled ? 'Mute Spark Sound' : 'Enable Spark Sound'}
              className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-900 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Switch */}
            <button
              onClick={() => {
                setLanguage(language === 'en' ? 'hi' : 'en');
                playSparkSound();
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-900/80 text-slate-300 hover:text-white transition-colors"
              title="Toggle English / हिंदी"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* In-App PWA Install Action */}
            <PWAInstallButton />

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${roleBadge.color}`}
              >
                {currentUser.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5" />
                ) : currentUser.role === 'welder' ? (
                  <Hammer className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded bg-white/10 uppercase tracking-wider">
                  {currentUser.role}
                </span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.phone}</p>
                    <p className="text-[10px] text-amber-400 font-mono mt-0.5">{roleBadge.label}</p>
                  </div>

                  <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t.switchRole}
                  </p>
                  
                  <button
                    onClick={() => {
                      switchRole('welder');
                      setRoleDropdownOpen(false);
                      playSparkSound();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                      currentUser.role === 'welder' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Hammer className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.welderShop}</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('customer');
                      setRoleDropdownOpen(false);
                      playSparkSound();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                      currentUser.role === 'customer' ? 'bg-sky-500/20 text-sky-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.customer}</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setRoleDropdownOpen(false);
                      playSparkSound();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                      currentUser.role === 'admin' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.admin}</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('worker');
                      setRoleDropdownOpen(false);
                      playSparkSound();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                      currentUser.role === 'worker' ? 'bg-purple-500/20 text-purple-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.worker}</span>
                  </button>

                  <div className="border-t border-slate-800 mt-1 pt-1 space-y-1">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        openProfileModal();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                    >
                      <span>प्रोफ़ाइल संपादित करें (Edit Profile)</span>
                      <span className="text-[10px] text-amber-400">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        openAuthModal();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-amber-400 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                    >
                      <span>Firebase Phone OTP Login</span>
                      <span className="text-[10px] text-emerald-400 font-mono">SMS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
