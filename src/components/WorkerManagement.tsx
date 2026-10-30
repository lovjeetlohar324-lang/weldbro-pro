import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShopWorker } from '../types';
import {
  Users,
  Plus,
  Calendar,
  DollarSign,
  Phone,
  CheckCircle,
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkerManagement: React.FC = () => {
  const { workers, addWorker, recordWorkerPayment, recordWorkerAttendance, playSparkSound } = useApp();

  const [selectedWorker, setSelectedWorker] = useState<ShopWorker | null>(null);
  const [payModalWorker, setPayModalWorker] = useState<ShopWorker | null>(null);
  const [newWorkerModalOpen, setNewWorkerModalOpen] = useState(false);

  // Wage payout form
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'cash' | 'upi'>('cash');
  const [payNotes, setPayNotes] = useState('Weekly wage payout');

  // New worker form
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerRole, setWorkerRole] = useState<ShopWorker['role']>('Master Welder');
  const [dailyWage, setDailyWage] = useState<number>(850);

  const totalPayrollDue = workers.reduce((acc, w) => acc + w.balanceDue, 0);

  const handlePayWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalWorker) return;
    playSparkSound();
    confetti({ particleCount: 30, spread: 50 });
    recordWorkerPayment(payModalWorker.id, payAmount, payNotes, payMethod);
    setPayModalWorker(null);
  };

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    playSparkSound();
    const newW: ShopWorker = {
      id: `worker-${Date.now()}`,
      name: workerName,
      phone: workerPhone,
      role: workerRole,
      dailyWage,
      daysWorked: 0,
      advanceTaken: 0,
      balanceDue: 0,
      attendanceThisMonth: 0,
      payments: []
    };
    addWorker(newW);
    setNewWorkerModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span>WORKSHOP CREW &amp; PAYROLL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide mt-1">
            WORKER ATTENDANCE &amp; WAGES LOG
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Track daily attendance for master welders, grinders, and helpers. Manage daily wage calculations, advances, and payouts.
          </p>
        </div>

        <button
          onClick={() => {
            setNewWorkerModalOpen(true);
            playSparkSound();
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Workshop Worker</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 block uppercase">Total Active Crew</span>
            <span className="text-2xl font-black font-mono text-white mt-1 block">
              {workers.length} Craftsmen
            </span>
          </div>
          <Users className="w-8 h-8 text-purple-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 block uppercase">Total Wages Payable</span>
            <span className="text-2xl font-black font-mono text-amber-400 mt-1 block">
              ₹{totalPayrollDue.toLocaleString()}
            </span>
          </div>
          <DollarSign className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      {/* Workers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">{worker.name}</h3>
                  <span className="text-xs font-mono text-purple-400 font-semibold">{worker.role}</span>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{worker.phone}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block font-mono">Daily Wage</span>
                  <span className="text-base font-bold font-mono text-white">₹{worker.dailyWage}</span>
                </div>
              </div>

              {/* Attendance Tracker */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Days Worked This Month:</span>
                  <span className="text-amber-400 font-bold text-sm">{worker.daysWorked} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => recordWorkerAttendance(worker.id, -1)}
                    className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                  >
                    - 1 Day
                  </button>
                  <button
                    onClick={() => {
                      recordWorkerAttendance(worker.id, 1);
                      playSparkSound();
                    }}
                    className="flex-1 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-xs font-bold text-emerald-400"
                  >
                    + 1 Day Present
                  </button>
                </div>
              </div>

              {/* Wage Balance */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Advance Taken</span>
                  <span className="text-rose-400 font-bold">₹{worker.advanceTaken.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Net Payable</span>
                  <span className="text-emerald-400 font-bold">₹{worker.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => {
                  setPayModalWorker(worker);
                  setPayAmount(worker.balanceDue > 0 ? worker.balanceDue : 1000);
                  playSparkSound();
                }}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
              >
                Pay Wages / Advance
              </button>

              <button
                onClick={() => {
                  setSelectedWorker(worker);
                  playSparkSound();
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                History
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pay Worker Modal */}
      {payModalWorker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setPayModalWorker(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-1">
              DISBURSE WAGES / ADVANCE
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Worker: {payModalWorker.name} ({payModalWorker.role})
            </p>

            <form onSubmit={handlePayWorker} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-lg font-mono font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('cash')}
                    className={`py-2 rounded-xl text-xs font-bold text-center border ${
                      payMethod === 'cash' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('upi')}
                    className={`py-2 rounded-xl text-xs font-bold text-center border ${
                      payMethod === 'upi' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Direct UPI Transfer
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notes / Reason</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20"
              >
                Disburse ₹{payAmount}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Worker Modal */}
      {newWorkerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setNewWorkerModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-1">
              ADD WORKSHOP WORKER
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Register a team member, welder, or assistant.
            </p>

            <form onSubmit={handleAddWorker} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  placeholder="e.g. Dinesh Meghwal"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={workerPhone}
                  onChange={(e) => setWorkerPhone(e.target.value)}
                  placeholder="+91 97831 00000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Craftsmanship Role</label>
                <select
                  value={workerRole}
                  onChange={(e) => setWorkerRole(e.target.value as ShopWorker['role'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Master Welder">Master Welder (TIG / ARC)</option>
                  <option value="Assistant Fabricator">Assistant Fabricator</option>
                  <option value="Helper / Grinder">Helper / Grinder</option>
                  <option value="Fitter">Structural Fitter</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Agreed Daily Wage Rate (₹ / Day)</label>
                <input
                  type="number"
                  required
                  value={dailyWage}
                  onChange={(e) => setDailyWage(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20"
                >
                  Register Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedWorker(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-1">
              PAYMENT HISTORY: {selectedWorker.name.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Total Payments Made: {selectedWorker.payments.length}
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedWorker.payments.length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">No payment transactions recorded yet.</p>
              ) : (
                selectedWorker.payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{p.notes}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Date: {p.date} · Mode: {p.method.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-purple-400 text-sm">
                      ₹{p.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
