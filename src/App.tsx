// Permanent Version - No Expiry
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AnimatedHero } from './components/AnimatedHero';
import { SmartConfigurator } from './components/SmartConfigurator';
import { MeasurementSystem } from './components/MeasurementSystem';
import { WeldBroCamera } from './components/WeldBroCamera';
import { WelderDirectory } from './components/WelderDirectory';
import { OrderManagement } from './components/OrderManagement';
import { CustomerLedger } from './components/CustomerLedger';
import { WorkerManagement } from './components/WorkerManagement';
import { JobsAndCommunity } from './components/JobsAndCommunity';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { testConnection } from './services/firebase';
import {
  Compass,
  Boxes,
  Ruler,
  FileText,
  Camera,
  Users,
  Hammer,
  BookOpen,
  UserCheck,
  Shield,
  PhoneCall,
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, adminSettings, t, playSparkSound } = useApp();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    testConnection();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    playSparkSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Navbar with 3-Zone Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        openAuthModal={() => setAuthModalOpen(true)}
        openProfileModal={() => setProfileModalOpen(true)}
      />

      {/* Role Workspace Ribbon (Quiet, functional inline status) */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Workspace:</span>
            <span className="font-bold text-white font-mono">{currentUser.name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
              {currentUser.role}
            </span>
            {currentUser.shopName && (
              <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
                · {currentUser.shopName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            {currentUser.role === 'welder' && (
              <>
                <button
                  onClick={() => handleTabChange('parties')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                    activeTab === 'parties' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white bg-slate-800'
                  }`}
                >
                  Party Khata
                </button>
                <button
                  onClick={() => handleTabChange('workers')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                    activeTab === 'workers' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white bg-slate-800'
                  }`}
                >
                  Workers Log
                </button>
              </>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => handleTabChange('admin')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                  activeTab === 'admin' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                }`}
              >
                Admin Control
              </button>
            )}

            <button
              onClick={() => setProfileModalOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs text-amber-400 underline font-mono hover:text-amber-300 whitespace-nowrap"
            >
              Switch Role / Login
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <AnimatedHero
            onNavigate={handleTabChange}
            openAuthModal={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'configurator' && <SmartConfigurator />}

        {activeTab === 'measurements' && <MeasurementSystem />}

        {activeTab === 'camera' && <WeldBroCamera />}

        {activeTab === 'welders' && <WelderDirectory />}

        {activeTab === 'orders' && <OrderManagement />}

        {activeTab === 'parties' && <CustomerLedger />}

        {activeTab === 'workers' && <WorkerManagement />}

        {activeTab === 'jobs' && <JobsAndCommunity />}

        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Footer (Anti-slop compliant: quiet copyright, direct links, and real actions) */}
      <footer className="no-print bg-slate-950 border-t border-slate-800 py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-xl font-black font-heading text-white tracking-wider">
                  {adminSettings.appName.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {adminSettings.tagline}
              </p>
              <p className="text-slate-500 font-mono text-[11px] mt-2">
                Designed for welders, fabricators, shop owners &amp; customers.
              </p>
            </div>

            <div>
              <span className="text-white font-bold font-mono uppercase text-[11px] tracking-wider block mb-3">
                Core Modules
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => handleTabChange('welders')} className="hover:text-amber-400 transition-colors">
                    Find Certified Welders
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('configurator')} className="hover:text-amber-400 transition-colors">
                    3D Material &amp; Weight Configurator
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('measurements')} className="hover:text-amber-400 transition-colors">
                    Smart Measurement Diagram
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('camera')} className="hover:text-amber-400 transition-colors">
                    Automatic Watermark Camera
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-white font-bold font-mono uppercase text-[11px] tracking-wider block mb-3">
                Business Management
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => handleTabChange('orders')} className="hover:text-amber-400 transition-colors">
                    Order Invoices &amp; PDF Receipts
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('parties')} className="hover:text-amber-400 transition-colors">
                    Customer Ledger (Khata)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('workers')} className="hover:text-amber-400 transition-colors">
                    Worker Attendance &amp; Wages
                  </button>
                </li>
                <li>
                  <button onClick={() => handleTabChange('jobs')} className="hover:text-amber-400 transition-colors">
                    Jobs &amp; Technical Forum
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-white font-bold font-mono uppercase text-[11px] tracking-wider block mb-3">
                Platform Operations
              </span>
              <p className="text-slate-300 font-bold mb-1">{adminSettings.ownerName}</p>
              <p className="text-slate-400 text-[11px] mb-2">{adminSettings.businessAddress}</p>
              <p className="font-mono text-amber-400 mb-3">{adminSettings.ownerMobile}</p>
              <button
                onClick={() => handleTabChange('admin')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
            <p>
              © {new Date().getFullYear()} {adminSettings.appName}. All rights reserved. Precision Welding &amp; Fabrication Architecture.
            </p>
            <div className="flex items-center gap-4">
              <span>Rajasthan · Gujarat · Pan-India</span>
              <span aria-hidden="true">·</span>
              <span>English / हिंदी</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (Frontend Design Touch App Pattern 1) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 grid grid-cols-5 items-center h-16 pb-safe px-2">
        <button
          onClick={() => handleTabChange('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </button>

        <button
          onClick={() => handleTabChange('configurator')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'configurator' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Boxes className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">3D Calc</span>
        </button>

        <button
          onClick={() => handleTabChange('measurements')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'measurements' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Ruler className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Measure</span>
        </button>

        <button
          onClick={() => handleTabChange('camera')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'camera' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Camera</span>
        </button>

        <button
          onClick={() => handleTabChange('orders')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'orders' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Orders</span>
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
