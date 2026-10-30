// Permanent Version - No Expiry
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { saveUserProfileToFirestore } from '../services/firebase';
import {
  X,
  User as UserIcon,
  Save,
  CheckCircle,
  Building,
  MapPin,
  Briefcase,
  Wrench,
  Camera,
  Upload,
  Phone,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, playSparkSound } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [shopName, setShopName] = useState(currentUser.shopName || '');
  const [shopAddress, setShopAddress] = useState(currentUser.shopAddress || '');
  const [city, setCity] = useState(currentUser.city || 'Barmer');
  const [state, setState] = useState(currentUser.state || 'Rajasthan');
  const [skills, setSkills] = useState('SS-304 TIG, ARC 7018, Pipe Fitting, CNC Sheet');
  const [experienceYears, setExperienceYears] = useState(10);
  const [services, setServices] = useState('Main Gates, SS Railings, Balcony Grills, Sheds');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    playSparkSound();
    confetti({ particleCount: 40, spread: 60 });

    const updatedUser = {
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
      shopName: currentUser.role === 'welder' ? shopName.trim() : currentUser.shopName,
      shopAddress: shopAddress.trim(),
      city: city.trim(),
      state: state.trim()
    };

    setCurrentUser(updatedUser);
    await saveUserProfileToFirestore(updatedUser);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl">
            {name.charAt(0) || 'W'}
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-white">
              EDIT USER PROFILE &amp; DETAILS
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Role: <span className="text-amber-400 uppercase font-bold">{currentUser.role}</span> · UID: {currentUser.id.slice(0, 10)}
            </p>
          </div>
        </div>

        {savedSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Profile Updated in Cloud Firestore!</h4>
            <p className="text-xs text-slate-400 font-mono">प्रोफ़ाइल सफलतापूर्वक सुरक्षित कर ली गई है।</p>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="text-slate-400 block mb-1">पूरा नाम (Full Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-slate-400 block mb-1">मोबाइल नंबर (Mobile Phone)</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>

            {/* Welder-specific fields */}
            {currentUser.role === 'welder' && (
              <>
                <div>
                  <label className="text-slate-400 block mb-1">वेल्डिंग वर्कशॉप / दुकान का नाम</label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="उदा. सोलंकी नेट कैफे एंड स्मार्ट प्रिंट व वेल्डिंग हब"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">दुकान का पूरा पता (Workshop Address)</label>
                  <input
                    type="text"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    placeholder="इंडस्ट्रियल एरिया, स्टेशन रोड"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">वेल्डिंग अनुभव (Years)</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">विशेषज्ञता (Welding Skills)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">प्रदान की जाने वाली सेवाएं (Services Offered)</label>
                  <input
                    type="text"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </>
            )}

            {/* Worker-specific fields */}
            {currentUser.role === 'worker' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">अनुभव (Years Experience)</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">हुनर / कारीगरी (Skills)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Location (City & State) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">शहर / जिला (City)</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">राज्य (State)</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile to Firestore</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
