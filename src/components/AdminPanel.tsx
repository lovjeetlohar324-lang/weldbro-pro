// Permanent Version - No Expiry
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  CheckCircle,
  Save,
  Users,
  FileText,
  DollarSign,
  Flame,
  Globe,
  Lock,
  Phone,
  Mail,
  Sliders,
  Check,
  AlertTriangle,
  UserX,
  MessageSquare,
  Star,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminPanel: React.FC = () => {
  const {
    adminSettings,
    updateAdminSettings,
    welders,
    toggleWelderVerification,
    orders,
    parties,
    workers,
    currentUser,
    switchRole,
    playSparkSound,
    t
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'settings' | 'welders' | 'users' | 'complaints' | 'reviews'>('settings');

  // Admin settings state
  const [appName, setAppName] = useState(adminSettings.appName);
  const [tagline, setTagline] = useState(adminSettings.tagline);
  const [ownerName, setOwnerName] = useState(adminSettings.ownerName);
  const [ownerMobile, setOwnerMobile] = useState(adminSettings.ownerMobile);
  const [ownerUpiId, setOwnerUpiId] = useState(adminSettings.ownerUpiId);
  const [businessAddress, setBusinessAddress] = useState(adminSettings.businessAddress);
  const [supportEmail, setSupportEmail] = useState(adminSettings.supportEmail);
  const [whatsappLink, setWhatsappLink] = useState(adminSettings.whatsappCommunityLink);
  const [telegramLink, setTelegramLink] = useState(adminSettings.telegramGroupLink);
  const [youtubeLink, setYoutubeLink] = useState(adminSettings.youtubeChannelUrl);
  const [instagramHandle, setInstagramHandle] = useState(adminSettings.instagramHandle);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [passError, setPassError] = useState(false);

  // Complaints state
  const [complaints, setComplaints] = useState([
    {
      id: 'CMP-101',
      customerName: 'Kishore Mali',
      customerPhone: '+91 94142 88771',
      welderShop: 'Solanki Net Cafe & Smart Print Hub',
      subject: 'Delay in gate primer coat drying due to unseasonal rain',
      status: 'Resolved',
      date: '2026-10-22'
    },
    {
      id: 'CMP-102',
      customerName: 'Gaurav Soni',
      customerPhone: '+91 98291 44552',
      welderShop: 'Royal Rajputana Steel Arts',
      subject: 'Clarification needed on SS-304 vs SS-202 pipe thickness gauge',
      status: 'Investigating',
      date: '2026-10-25'
    }
  ]);

  const totalPlatformVolume = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSparkSound();
    confetti({ particleCount: 40, spread: 60 });

    updateAdminSettings({
      appName,
      tagline,
      ownerName,
      ownerMobile,
      ownerUpiId,
      businessAddress,
      supportEmail,
      whatsappCommunityLink: whatsappLink,
      telegramGroupLink: telegramLink,
      youtubeChannelUrl: youtubeLink,
      instagramHandle
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput.trim() === 'WELDBRO@2026' || adminPassInput.trim() === 'LAVJEET@778') {
      switchRole('admin');
      setPassError(false);
      playSparkSound();
    } else {
      setPassError(true);
    }
  };

  // If current user is not admin, show secure passkey lock screen
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-heading text-white">
            ADMINISTRATOR ACCESS RESTRICTED
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            यह क्षेत्र केवल मुख्य व्यवस्थापक (Lavjeet Kumar Solanki) के लिए सुरक्षित है। कृपया एडमिन पासकी दर्ज करें।
          </p>

          {passError && (
            <p className="text-xs font-mono text-rose-400">
              अमान्य पासकी (Invalid Admin Passkey). कृपया सही क्रेडेंशियल दर्ज करें।
            </p>
          )}

          <form onSubmit={handleUnlockAdmin} className="space-y-3 pt-2">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={adminPassInput}
                onChange={(e) => setAdminPassInput(e.target.value)}
                placeholder="Enter Admin Master Passkey"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow"
            >
              Unlock Master Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>MASTER GOVERNANCE PANEL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide mt-1">
            MAIN ADMINISTRATOR CONTROL PANEL
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {t.adminNotice}
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-mono">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Master Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Analytics KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400 block uppercase">Total System Volume</span>
          <span className="text-2xl font-black font-mono text-amber-400 mt-1 block">
            ₹{totalPlatformVolume.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400 block uppercase">Fabrication Orders</span>
          <span className="text-2xl font-black font-mono text-white mt-1 block">
            {orders.length} Orders
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400 block uppercase">Registered Workshops</span>
          <span className="text-2xl font-black font-mono text-cyan-400 mt-1 block">
            {welders.length} Shops
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400 block uppercase">Verified Partners</span>
          <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">
            {welders.filter((w) => w.isVerified).length} Verified
          </span>
        </div>
      </div>

      {/* Admin Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'settings', label: 'Owner & Branding Settings' },
          { id: 'welders', label: `Welders Moderation (${welders.length})` },
          { id: 'users', label: `Clients & Crew (${parties.length + workers.length})` },
          { id: 'complaints', label: `Complaints Log (${complaints.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveAdminTab(tab.id as typeof activeAdminTab);
              playSparkSound();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors ${
              activeAdminTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Owner & Branding Settings */}
      {activeAdminTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>OFFICIAL OWNER &amp; BRAND CREDENTIALS</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">PROTECTED CONFIG</span>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Owner Information */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  Primary Business Owner Information
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Owner Full Name</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Owner Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={ownerMobile}
                      onChange={(e) => setOwnerMobile(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Official UPI ID (For Invoices)</label>
                    <input
                      type="text"
                      required
                      value={ownerUpiId}
                      onChange={(e) => setOwnerUpiId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-cyan-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Support Email</label>
                    <input
                      type="email"
                      required
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Head Office Business Address</label>
                  <input
                    type="text"
                    required
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Social Channels */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">WhatsApp Community Link</label>
                  <input
                    type="text"
                    value={whatsappLink}
                    onChange={(e) => setWhatsappLink(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Telegram Group Link</label>
                  <input
                    type="text"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Master Platform Settings</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-3">
            <h4 className="text-sm font-bold font-heading text-white">FIREBASE DEPLOYMENT STATUS</h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div>Project ID: <span className="text-amber-400 font-bold">analog-plating-kl37k</span></div>
              <div>Auth Engine: <span className="text-emerald-400">Phone SMS + reCAPTCHA</span></div>
              <div>Firestore: <span className="text-cyan-400">ABAC Security Rules Deployed</span></div>
              <div>Storage Bucket: <span className="text-slate-300">firebasestorage.app</span></div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                Permanent Version - No Expiry
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Welders Moderation */}
      {activeAdminTab === 'welders' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
          <h3 className="text-lg font-bold font-heading text-white">
            WELDER WORKSHOP VERIFICATION &amp; SUSPENSION AUDIT
          </h3>
          <div className="space-y-3">
            {welders.map((welder) => (
              <div
                key={welder.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">{welder.shopName}</h4>
                  <p className="text-amber-400 font-mono text-[11px] mt-0.5">
                    {welder.name} · {welder.phone} · {welder.city}, {welder.state}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Rating: {welder.rating} ({welder.reviewsCount} reviews) · Completed: {welder.completedJobsCount} jobs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      toggleWelderVerification(welder.id);
                      playSparkSound();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      welder.isVerified
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300'
                        : 'bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-slate-950'
                    }`}
                  >
                    {welder.isVerified ? '✓ Verified Partner' : '+ Grant Verification'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Clients & Workers Oversight */}
      {activeAdminTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
            <h4 className="text-base font-bold font-heading text-white">CUSTOMERS &amp; CLIENTS ({parties.length})</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {parties.map((p) => (
                <div key={p.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <p className="font-bold text-white">{p.partyName}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{p.phone} · {p.city}</p>
                  <p className="text-slate-500 text-[10px] mt-1">Total Billing: ₹{p.totalBilled.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
            <h4 className="text-base font-bold font-heading text-white">WORKSHOP WORKERS &amp; CREW ({workers.length})</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {workers.map((w) => (
                <div key={w.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <p className="font-bold text-white">{w.name} ({w.role})</p>
                  <p className="text-purple-400 font-mono text-[11px]">{w.phone}</p>
                  <p className="text-slate-500 text-[10px] mt-1">Daily Wage: ₹{w.dailyWage} / day</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Complaints Log */}
      {activeAdminTab === 'complaints' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
          <h3 className="text-lg font-bold font-heading text-white">CUSTOMER DISPUTES &amp; COMPLAINTS</h3>
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{c.subject}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] uppercase">
                    {c.status}
                  </span>
                </div>
                <p className="text-slate-400">Complainant: {c.customerName} ({c.customerPhone}) · Shop: {c.welderShop}</p>
                <p className="text-slate-500 text-[10px] font-mono">Date: {c.date} · Ref ID: {c.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
