// Permanent Version - No Expiry
import React, { useState, useEffect, useRef } from 'react';
import { ConfirmationResult } from 'firebase/auth';
import { useApp } from '../context/AppContext';
import { UserRole, User } from '../types';
import {
  sendFirebasePhoneOtp,
  verifyFirebaseOtp,
  saveUserProfileToFirestore,
  getUserProfileFromFirestore
} from '../services/firebase';
import {
  X,
  Phone,
  Shield,
  Hammer,
  User as UserIcon,
  UserCheck,
  Flame,
  CheckCircle2,
  KeyRound,
  RotateCw,
  AlertCircle,
  Lock,
  Loader2,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentUser, playSparkSound, adminSettings } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('welder');

  // Phone input (Indian format default)
  const [phone, setPhone] = useState('+91 ');
  
  // Registration fields
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [city, setCity] = useState('Barmer');
  const [state, setState] = useState('Rajasthan');
  const [skills, setSkills] = useState('TIG, MIG, ARC, Precision Railings');
  const [experienceYears, setExperienceYears] = useState(8);
  const [adminSecurityKey, setAdminSecurityKey] = useState('');

  // Firebase OTP Flow States
  const [otpStep, setOtpStep] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [retryAttempts, setRetryAttempts] = useState<number>(0);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (otpStep && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [otpStep, countdown]);

  if (!isOpen) return null;

  // Real Firebase Send SMS OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    playSparkSound();

    if (retryAttempts >= 3) {
      setErrorMessage(
        'Maximum retry attempts exceeded for security. Please wait a few minutes before requesting another OTP.'
      );
      setLoading(false);
      return;
    }

    // Administrator Security Check (Admin cannot be publicly registered without passkey)
    if (role === 'admin') {
      if (adminSecurityKey.trim() !== 'WELDBRO@2026' && adminSecurityKey.trim() !== 'LAVJEET@778') {
        setErrorMessage(
          'Unauthorized: Administrator registration requires an authorized master security passkey. Contact Lavjeet Kumar Solanki.'
        );
        setLoading(false);
        return;
      }
    }

    try {
      const cleanPhone = phone.trim();
      const confirmation = await sendFirebasePhoneOtp(cleanPhone, 'recaptcha-container');
      setConfirmationResult(confirmation);
      setOtpStep(true);
      setCountdown(60);
      setRetryAttempts((prev) => prev + 1);
      setLoading(false);
    } catch (err: unknown) {
      console.error('Firebase Phone Auth Error:', err);
      setLoading(false);
      const errorStr = (err as Error)?.message || '';

      if (errorStr.includes('auth/invalid-phone-number')) {
        setErrorMessage('कृपया मान्य 10 अंकों का मोबाइल नंबर (+91 सहित) दर्ज करें। (Invalid Indian Phone Number)');
      } else if (errorStr.includes('auth/quota-exceeded')) {
        setErrorMessage('SMS OTP दैनिक कोटा समाप्त हो गया है। कृपया कुछ समय बाद पुनः प्रयास करें। (SMS Quota Exceeded)');
      } else if (errorStr.includes('auth/operation-not-allowed')) {
        setErrorMessage(
          'Firebase Console में Phone Authentication Provider सक्रिय (Enable) नहीं है। कृपया Firebase Console > Authentication > Sign-in method में Phone चालू करें।'
        );
      } else if (errorStr.includes('auth/captcha-check-failed')) {
        setErrorMessage('reCAPTCHA सत्यापन विफल रहा। कृपया पृष्ठ को रीफ़्रेश करें और पुनः प्रयास करें।');
      } else {
        setErrorMessage(
          `Firebase SMS OTP अनुरोध विफल: ${errorStr || 'कृपया नेटवर्क जांचें और पुनः प्रयास करें।'}`
        );
      }
    }
  };

  // Real Firebase Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setErrorMessage(null);
    setLoading(true);
    playSparkSound();

    try {
      const firebaseUser = await verifyFirebaseOtp(confirmationResult, enteredOtp);
      
      // Check if user profile already exists in Firestore
      let existingProfile = await getUserProfileFromFirestore(firebaseUser.uid);

      if (!existingProfile) {
        // Create new role-based user profile
        const newProfile: User = {
          id: firebaseUser.uid,
          name: name.trim() || (role === 'admin' ? adminSettings.ownerName : `WeldBro ${role.toUpperCase()}`),
          phone: firebaseUser.phoneNumber || phone,
          email: `${firebaseUser.uid.slice(0, 8)}@weldbro.in`,
          role,
          shopName: role === 'welder' ? (shopName.trim() || 'Solanki Smart Fabrication Hub') : undefined,
          shopAddress: shopAddress.trim() || 'Station Road',
          city: city.trim() || 'Barmer',
          state: state.trim() || 'Rajasthan',
          isVerified: role === 'admin'
        };

        await saveUserProfileToFirestore(newProfile);
        existingProfile = newProfile;
      }

      setVerifiedSuccess(true);
      confetti({ particleCount: 60, spread: 70 });

      setTimeout(() => {
        if (existingProfile) {
          setCurrentUser(existingProfile);
        }
        onClose();
      }, 1200);
    } catch (err: unknown) {
      console.error('Firebase OTP Verification Error:', err);
      setLoading(false);
      const errorStr = (err as Error)?.message || '';
      if (errorStr.includes('auth/invalid-verification-code')) {
        setErrorMessage('गलत OTP कोड दर्ज किया गया है। कृपया SMS में आया 6-अंकों का OTP पुनः जांचें।');
      } else if (errorStr.includes('auth/code-expired')) {
        setErrorMessage('यह OTP कोड समाप्त (Expired) हो चुका है। कृपया Resend OTP बटन पर क्लिक करें।');
      } else {
        setErrorMessage(`सत्यापन विफल: ${errorStr}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* Required DOM Element for Firebase invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>

      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Lockup */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-white">
              {mode === 'login' ? 'REAL FIREBASE SMS LOGIN' : 'CREATE WELDBRO ACCOUNT'}
            </h3>
            <p className="text-[11px] text-emerald-400 font-mono">
              ✓ Firebase Authenticated · SMS OTP (+91)
            </p>
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Success message banner */}
        {verifiedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-xl font-bold text-white">मोबाइल नंबर सत्यापित (Verified)!</h4>
            <p className="text-xs text-slate-300 font-mono">
              Firebase सत्र सुरक्षित रूप से प्रारंभ हो गया है...
            </p>
          </div>
        ) : (
          <>
            {/* Step 1: Phone & Details Input */}
            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
                
                {/* Select Account Type */}
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">
                    खाता प्रकार चुनें (Select Account Type)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'welder', label: 'Welder / Shop Owner', icon: Hammer, desc: 'दुकान मालिक' },
                      { id: 'customer', label: 'Customer / Client', icon: UserIcon, desc: 'ग्राहक' },
                      { id: 'worker', label: 'Workshop Worker', icon: UserCheck, desc: 'कारीगर / हेल्पर' },
                      { id: 'admin', label: 'Master Admin', icon: Shield, desc: 'मुख्य व्यवस्थापक' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setRole(r.id as UserRole);
                          playSparkSound();
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          role === r.id
                            ? 'bg-slate-800 text-white border-amber-400 shadow-md ring-1 ring-amber-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <r.icon className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-xs truncate">{r.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Phone Input with Indian Flag indicator */}
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">
                    मोबाइल नंबर (Indian Mobile Number with +91)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                      🇮🇳
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-400 tracking-wider"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    असली SMS OTP सीधे आपके इस मोबाइल नंबर पर भेजा जाएगा।
                  </span>
                </div>

                {/* Additional Registration Fields */}
                {mode === 'register' && (
                  <div className="space-y-3 pt-1 border-t border-slate-800">
                    <div>
                      <label className="text-slate-400 block mb-1">पूरा नाम (Full Name)</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="उदा. लवजीत कुमार सोलंकी"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    {role === 'welder' && (
                      <div>
                        <label className="text-slate-400 block mb-1">वेल्डिंग वर्कशॉप / दुकान का नाम</label>
                        <input
                          type="text"
                          required
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          placeholder="उदा. सोलंकी स्मार्ट वेल्डिंग हब"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-400 block mb-1">शहर / जिला (City)</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="बाड़मेर"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">राज्य (State)</label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="राजस्थान"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Master Admin Security Passkey (Protected) */}
                {role === 'admin' && (
                  <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-300 font-mono text-[11px] font-bold">
                      <Lock className="w-3.5 h-3.5 text-rose-400" />
                      <span>MASTER ADMINISTRATOR SECURITY PASSKEY</span>
                    </div>
                    <input
                      type="password"
                      required
                      value={adminSecurityKey}
                      onChange={(e) => setAdminSecurityKey(e.target.value)}
                      placeholder="Enter Admin Master Passkey"
                      className="w-full bg-slate-950 border border-rose-700/80 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      अनधिकृत रजिस्ट्रेशन रोकने के लिए मुख्य एडमिन पासवर्ड आवश्यक है।
                    </span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Firebase SMS भेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      <span>Firebase Real SMS OTP भेजें</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: OTP Verification Screen */
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-slate-400 text-xs block">
                    SMS OTP भेजा गया: <strong className="text-white font-mono">{phone}</strong>
                  </span>
                  <p className="text-[11px] text-emerald-400 font-mono">
                    Google Firebase Telephony Gateway · Real OTP
                  </p>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1.5 font-mono text-center">
                    प्राप्त 6-अंकों का SMS OTP दर्ज करें
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-3 text-center text-2xl font-mono font-black tracking-widest text-amber-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Timer & Resend Button */}
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  {countdown > 0 ? (
                    <span className="text-slate-400">
                      OTP पुनः भेजने का समय: <strong className="text-amber-400">{countdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={loading || retryAttempts >= 3}
                      onClick={handleSendOtp}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Resend Real SMS OTP</span>
                    </button>
                  )}
                  <span className="text-slate-500 text-[11px]">
                    Attempt: {retryAttempts}/3
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(false);
                      setEnteredOtp('');
                      setErrorMessage(null);
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl"
                  >
                    नंबर बदलें
                  </button>

                  <button
                    type="submit"
                    disabled={loading || enteredOtp.length !== 6}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>सत्यापित हो रहा है...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>OTP सत्यापित करें &amp; लॉगिन करें</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Toggle Mode: Login vs Register */}
            <div className="mt-4 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              {mode === 'login' ? (
                <p>
                  नया खाता बनाना है?{' '}
                  <button
                    onClick={() => {
                      setMode('register');
                      setOtpStep(false);
                      setErrorMessage(null);
                    }}
                    className="text-amber-400 underline font-semibold"
                  >
                    नया वेल्डर / कस्टमर प्रोफाइल बनाएं
                  </button>
                </p>
              ) : (
                <p>
                  पहले से खाता है?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setOtpStep(false);
                      setErrorMessage(null);
                    }}
                    className="text-amber-400 underline font-semibold"
                  >
                    लॉगिन करें (Sign In)
                  </button>
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
