// Permanent Version - No Expiry
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerPartyAccount } from '../types';
import { DynamicQrModal } from './DynamicQrModal';
import {
  BookOpen,
  Send,
  Plus,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  X,
  PhoneCall,
  History,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomerLedger: React.FC = () => {
  const { parties, addParty, recordPartyPayment, playSparkSound, adminSettings, currentUser } = useApp();

  const [selectedParty, setSelectedParty] = useState<CustomerPartyAccount | null>(null);
  const [paymentModalParty, setPaymentModalParty] = useState<CustomerPartyAccount | null>(null);
  const [newPartyModalOpen, setNewPartyModalOpen] = useState(false);
  const [qrParty, setQrParty] = useState<CustomerPartyAccount | null>(null);

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payNotes, setPayNotes] = useState('Payment settlement towards outstanding balance');

  // New Party Form state
  const [partyName, setPartyName] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [partyCity, setPartyCity] = useState('');
  const [initialBill, setInitialBill] = useState<number>(0);
  const [initialAdvance, setInitialAdvance] = useState<number>(0);

  const totalOutstanding = parties.reduce((acc, p) => acc + p.remainingBalance, 0);
  const totalCollected = parties.reduce((acc, p) => acc + p.totalReceived, 0);

  const handleSendReminderWhatsApp = (party: CustomerPartyAccount) => {
    playSparkSound();
    const upiLink = `upi://pay?pa=${adminSettings.ownerUpiId}&pn=${encodeURIComponent(currentUser.shopName || adminSettings.ownerName)}&am=${party.remainingBalance.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Khata Balance - ${party.partyName}`)}`;
    const message = `*PAYMENT REMINDER FROM WELDBRO*\nDear ${party.partyName},\n\nYour fabrication project payment of *₹${party.remainingBalance.toLocaleString()}* is pending at our workshop.\n\nTotal Billing: ₹${party.totalBilled.toLocaleString()}\nAmount Paid: ₹${party.totalReceived.toLocaleString()}\nRemaining Balance: *₹${party.remainingBalance.toLocaleString()}*\n\nPay immediately via UPI:\n${upiLink}\nUPI ID: ${adminSettings.ownerUpiId}\n\nPlease complete your payment at your earliest convenience.\n\nThank you,\n*${currentUser.shopName || 'WeldBro Smart Fabrication Hub'}*`;
    window.open(`https://api.whatsapp.com/send?phone=${party.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalParty) return;
    playSparkSound();
    confetti({ particleCount: 40, spread: 60 });
    recordPartyPayment(paymentModalParty.id, payAmount, payNotes);
    setPaymentModalParty(null);
  };

  const handleCreateParty = (e: React.FormEvent) => {
    e.preventDefault();
    playSparkSound();
    confetti({ particleCount: 30, spread: 50 });

    const newParty: CustomerPartyAccount = {
      id: `party-${Date.now()}`,
      partyName,
      phone: partyPhone,
      city: partyCity || 'Barmer',
      totalBilled: initialBill,
      totalReceived: initialAdvance,
      advancePayment: initialAdvance,
      remainingBalance: Math.max(0, initialBill - initialAdvance),
      lastPaymentDate: new Date().toISOString().split('T')[0],
      status: initialBill - initialAdvance === 0 ? 'paid' : initialAdvance > 0 ? 'partial' : 'pending',
      transactions: initialAdvance > 0 ? [
        {
          id: `txn-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: initialAdvance,
          type: 'advance',
          notes: 'Initial account opening advance'
        }
      ] : []
    };

    addParty(newParty);
    setNewPartyModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Permanent Version Banner */}
      <div className="mb-4 flex items-center justify-between px-4 py-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs font-mono text-emerald-400">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Permanent Version - No Expiry · Lifetime Digital Ledger &amp; Khata</span>
        </div>
        <span className="text-[11px] text-slate-400">Active</span>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>KHATA &amp; ACCOUNTS LEDGER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide mt-1">
            CUSTOMER &amp; PARTY PAYMENT KHATA
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Maintain accounts for every contractor, site client, and customer. Track advance deposits, generate dynamic UPI payment QR codes, and send WhatsApp reminders.
          </p>
        </div>

        <button
          onClick={() => {
            setNewPartyModalOpen(true);
            playSparkSound();
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Party Account</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400 block uppercase">Total Active Parties</span>
          <span className="text-2xl font-black font-mono text-white mt-1 block">
            {parties.length} Clients
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400 block uppercase">Total Payments Collected</span>
          <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">
            ₹{totalCollected.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-mono text-slate-400 block uppercase">Total Outstanding Balance</span>
          <span className="text-2xl font-black font-mono text-rose-400 mt-1 block">
            ₹{totalOutstanding.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Parties Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Party Name &amp; Contact</th>
                <th className="px-4 py-3 text-right">Total Billing (₹)</th>
                <th className="px-4 py-3 text-right">Received (₹)</th>
                <th className="px-4 py-3 text-right">Outstanding (₹)</th>
                <th className="px-4 py-3">Last Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {parties.map((party) => (
                <tr key={party.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-white text-sm">{party.partyName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{party.phone} · {party.city}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-white whitespace-nowrap">
                    ₹{party.totalBilled.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-400 whitespace-nowrap">
                    ₹{party.totalReceived.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold whitespace-nowrap">
                    <span className={party.remainingBalance > 0 ? 'text-rose-400 font-extrabold' : 'text-slate-500'}>
                      ₹{party.remainingBalance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                    {party.lastPaymentDate || 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                      party.status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : party.status === 'partial'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {party.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Dynamic QR Pay for this Party */}
                      {party.remainingBalance > 0 && (
                        <button
                          onClick={() => {
                            setQrParty(party);
                            playSparkSound();
                          }}
                          className="px-2 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1 border border-cyan-800"
                          title="Generate Dynamic UPI QR Code for party balance"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR</span>
                        </button>
                      )}

                      {party.remainingBalance > 0 && (
                        <button
                          onClick={() => handleSendReminderWhatsApp(party)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 text-xs font-medium flex items-center gap-1 border border-emerald-800"
                          title="Send WhatsApp Payment Reminder"
                        >
                          <Send className="w-3 h-3" />
                          <span>Remind</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setPaymentModalParty(party);
                          setPayAmount(party.remainingBalance);
                          playSparkSound();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium border border-slate-700"
                        title="Record Payment"
                      >
                        <span>Add Payment</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedParty(party);
                          playSparkSound();
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Transaction History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Party History Modal */}
      {selectedParty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedParty(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-1">
              LEDGER STATEMENT: {selectedParty.partyName.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Phone: {selectedParty.phone} · Outstanding: ₹{selectedParty.remainingBalance.toLocaleString()}
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedParty.transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{txn.notes}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Date: {txn.date} · Type: {txn.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    +₹{txn.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {paymentModalParty && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setPaymentModalParty(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-1">
              RECORD KHATA PAYMENT
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Party: {paymentModalParty.partyName} · Balance: ₹{paymentModalParty.remainingBalance}
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Amount Received (₹)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-lg font-mono font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notes / Bank / Cash</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20"
              >
                Record Payment of ₹{payAmount}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Party Modal */}
      {newPartyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setNewPartyModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-1">
              NEW PARTY ACCOUNT
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Create a dedicated ledger account for a client or builder.
            </p>

            <form onSubmit={handleCreateParty} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Party / Contractor Name</label>
                <input
                  type="text"
                  required
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="e.g. Choudhary Hardware & Builders"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={partyPhone}
                  onChange={(e) => setPartyPhone(e.target.value)}
                  placeholder="+91 94145 99001"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">City / Tehsil</label>
                <input
                  type="text"
                  value={partyCity}
                  onChange={(e) => setPartyCity(e.target.value)}
                  placeholder="e.g. Balotra, Rajasthan"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Initial Project Bill (₹)</label>
                  <input
                    type="number"
                    value={initialBill}
                    onChange={(e) => setInitialBill(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Advance Received (₹)</label>
                  <input
                    type="number"
                    value={initialAdvance}
                    onChange={(e) => setInitialAdvance(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
                >
                  Create Party Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic QR Payment Modal for Party */}
      {qrParty && (
        <DynamicQrModal
          isOpen={true}
          onClose={() => setQrParty(null)}
          defaultUpiId={adminSettings.ownerUpiId}
          defaultPayeeName={currentUser.shopName || adminSettings.ownerName}
          defaultAmount={qrParty.remainingBalance}
          orderNumber={`KHATA-${qrParty.id.toUpperCase()}`}
          customerName={qrParty.partyName}
          projectTitle="Khata Outstanding Settlement"
        />
      )}

    </div>
  );
};
