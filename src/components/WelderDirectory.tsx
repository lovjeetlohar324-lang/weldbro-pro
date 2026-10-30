import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WelderProfile } from '../types';
import {
  Search,
  MapPin,
  Star,
  CheckCircle,
  Phone,
  MessageCircle,
  Clock,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  X,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WelderDirectory: React.FC = () => {
  const { welders, playSparkSound, createOrder, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedWelder, setSelectedWelder] = useState<WelderProfile | null>(null);

  // Quote Request Form Modal state
  const [quoteModalWelder, setQuoteModalWelder] = useState<WelderProfile | null>(null);
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteDimensions, setQuoteDimensions] = useState('');
  const [quoteBudget, setQuoteBudget] = useState('');
  const [quoteSentNotice, setQuoteSentNotice] = useState(false);

  // Filter welders
  const filteredWelders = welders.filter((w) => {
    const query = searchQuery.toLowerCase();
    const matchQuery =
      w.name.toLowerCase().includes(query) ||
      w.shopName?.toLowerCase().includes(query) ||
      w.phone.includes(query) ||
      w.city?.toLowerCase().includes(query) ||
      w.district?.toLowerCase().includes(query);

    const matchState = selectedState === 'all' || w.state === selectedState;
    const matchCity = selectedCity === 'all' || w.city === selectedCity || w.workingLocations.includes(selectedCity);
    const matchService =
      selectedService === 'all' || w.services.some((s) => s.toLowerCase().includes(selectedService.toLowerCase()));

    return matchQuery && matchState && matchCity && matchService;
  });

  const handleOpenQuoteModal = (welder: WelderProfile) => {
    setQuoteModalWelder(welder);
    setQuoteTitle(`Custom Fabrication Request for ${welder.shopName}`);
    playSparkSound();
  };

  const handleSendQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalWelder) return;

    playSparkSound();
    confetti({ particleCount: 40, spread: 60 });

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      receiptNumber: `WB-REQ-${Date.now().toString().slice(-4)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      welderId: quoteModalWelder.id,
      shopName: quoteModalWelder.shopName || 'WeldBro Workshop',
      title: quoteTitle,
      items: [
        {
          id: `item-${Date.now()}`,
          name: quoteTitle,
          dimensions: quoteDimensions || 'Custom specifications attached',
          quantity: 1,
          material: 'As per workshop recommendations',
          unitPrice: parseInt(quoteBudget) || 15000,
          totalPrice: parseInt(quoteBudget) || 15000
        }
      ],
      materialCost: Math.round((parseInt(quoteBudget) || 15000) * 0.7),
      labourCharges: Math.round((parseInt(quoteBudget) || 15000) * 0.2),
      installationCharges: 1500,
      transportCharges: 800,
      additionalCharges: 0,
      totalAmount: parseInt(quoteBudget) || 15000,
      advancePayment: 0,
      remainingBalance: parseInt(quoteBudget) || 15000,
      status: 'new_order' as const,
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      notes: `Direct quotation request from customer ${currentUser.name} (${currentUser.phone}).`
    };

    createOrder(newOrder);
    setQuoteSentNotice(true);
    setTimeout(() => {
      setQuoteSentNotice(false);
      setQuoteModalWelder(null);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>VERIFIED FABRICATION NETWORK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide mt-1">
            SMART SEARCH &amp; FIND WELDERS
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Locate certified master welders and fabrication workshops across Rajasthan, Gujarat, and pan-India with public verified portfolios.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Active Workshops: <strong className="text-amber-400 font-bold">{welders.length}</strong></span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 mb-8 shadow-xl space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by welder name, shop name, phone number, city, or district..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Badges Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-amber-400 font-mono"
          >
            <option value="all">All States (राज्य)</option>
            <option value="Rajasthan">Rajasthan (राजस्थान)</option>
            <option value="Gujarat">Gujarat (गुजरात)</option>
            <option value="Delhi">Delhi NCR</option>
          </select>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-amber-400 font-mono"
          >
            <option value="all">All Cities &amp; Districts</option>
            <option value="Barmer">Barmer (बाड़मेर)</option>
            <option value="Jaipur">Jaipur (जयपुर)</option>
            <option value="Jodhpur">Jodhpur (जोधपुर)</option>
            <option value="Ahmedabad">Ahmedabad (अहमदाबाद)</option>
            <option value="Udaipur">Udaipur (उदयपुर)</option>
            <option value="Balotra">Balotra (बालोतरा)</option>
          </select>

          {/* Service Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-amber-400 font-mono"
          >
            <option value="all">All Services (सेवाएं)</option>
            <option value="Gate">Main Gate &amp; Sliding Doors</option>
            <option value="Grill">Balcony &amp; Window Grills</option>
            <option value="Railing">Stainless Steel Railings</option>
            <option value="TIG">Aluminium &amp; TIG Welding</option>
            <option value="Shed">Industrial Shed &amp; Truss</option>
          </select>

          {(selectedState !== 'all' || selectedCity !== 'all' || selectedService !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedState('all');
                setSelectedCity('all');
                setSelectedService('all');
                setSearchQuery('');
              }}
              className="text-amber-400 underline ml-auto text-xs"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Welders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWelders.map((welder) => (
          <div
            key={welder.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-5 shadow-xl transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Top Row: Shop Name & Verified Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-amber-400 transition-colors">
                      {welder.shopName}
                    </h3>
                  </div>
                  <p className="text-xs text-amber-400 font-mono font-medium">
                    {welder.name} · {welder.experienceYears} Yrs Exp
                  </p>
                </div>
                {welder.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    <span>VERIFIED</span>
                  </span>
                )}
              </div>

              {/* Location & Coverage */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">
                  {welder.shopAddress}, {welder.city}, {welder.state}
                </span>
              </div>

              {/* Multiple Working Locations Badge */}
              {welder.workingLocations.length > 0 && (
                <div className="mb-3 text-[11px] text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono uppercase block text-[9px]">
                    Also Serves Locations:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {welder.workingLocations.map((loc) => (
                      <span
                        key={loc}
                        className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating & Completed Jobs */}
              <div className="flex items-center justify-between text-xs font-mono py-2 border-y border-slate-800/80 mb-3 text-slate-300">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{welder.rating.toFixed(1)}</span>
                  <span className="text-slate-500 text-[11px]">({welder.reviewsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{welder.completedJobsCount} Jobs Done</span>
                </div>
              </div>

              {/* Services Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {welder.services.slice(0, 3).map((srv) => (
                  <span
                    key={srv}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300"
                  >
                    {srv}
                  </span>
                ))}
                {welder.services.length > 3 && (
                  <span className="text-[10px] text-slate-500 px-1 py-0.5">
                    +{welder.services.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${welder.phone}`}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Shop</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?phone=${welder.phone.replace(/[^0-9]/g, '')}&text=Hello%20${encodeURIComponent(welder.name)},%20I%20found%20your%20workshop%20on%20WeldBro.%20I%20would%20like%20a%20quotation.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedWelder(welder);
                    playSparkSound();
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800"
                >
                  View Full Profile
                </button>
                <button
                  onClick={() => handleOpenQuoteModal(welder)}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 transition-all"
                >
                  <span>Request Quote</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWelders.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">No welders found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedState('all');
              setSelectedCity('all');
              setSelectedService('all');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Full Profile Modal */}
      {selectedWelder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedWelder(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-2xl font-heading shadow-lg">
                {selectedWelder.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading text-white">
                  {selectedWelder.shopName}
                </h3>
                <p className="text-sm text-amber-400 font-mono">
                  {selectedWelder.name} · {selectedWelder.experienceYears} Years Experience
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  ID: {selectedWelder.welderId} · {selectedWelder.city}, {selectedWelder.state}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
                  About Workshop &amp; Specialization
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedWelder.about}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
                  Working Hours &amp; Rates
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">Hours:</span>
                    <span className="text-slate-200">{selectedWelder.workingHours}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block">Daily Master Rate:</span>
                    <span className="text-amber-400 font-bold font-mono">₹{selectedWelder.dailyRate} / day</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
                  Services Offered
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWelder.services.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
                  Serving Districts &amp; Multiple Work Locations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWelder.workingLocations.map((loc) => (
                    <span
                      key={loc}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono"
                    >
                      📍 {loc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <a
                  href={`tel:${selectedWelder.phone}`}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-center"
                >
                  Call {selectedWelder.phone}
                </a>
                <button
                  onClick={() => {
                    setSelectedWelder(null);
                    handleOpenQuoteModal(selectedWelder);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-center"
                >
                  Request Official Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      {quoteModalWelder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setQuoteModalWelder(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                Direct Work Order / Quotation Request
              </span>
              <h3 className="text-xl font-bold font-heading text-white">
                Send Request to {quoteModalWelder.shopName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Fabricator: {quoteModalWelder.name} ({quoteModalWelder.phone})
              </p>
            </div>

            {quoteSentNotice ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Quotation Request Sent!</h4>
                <p className="text-xs text-slate-400">
                  Order added to Orders pipeline. The fabricator has been notified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuoteRequest} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Product / Project Name</label>
                  <input
                    type="text"
                    required
                    value={quoteTitle}
                    onChange={(e) => setQuoteTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Dimensions &amp; Materials</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 ft width x 6 ft height in SS-304 square pipe"
                    value={quoteDimensions}
                    onChange={(e) => setQuoteDimensions(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Estimated Budget (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={quoteBudget}
                    onChange={(e) => setQuoteBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Quotation Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
