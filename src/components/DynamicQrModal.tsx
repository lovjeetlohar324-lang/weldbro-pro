// Permanent Version - No Expiry
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import {
  QrCode,
  Download,
  Share2,
  Printer,
  X,
  Check,
  Edit2,
  Copy,
  DollarSign,
  ShieldCheck,
  Flame,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DynamicQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUpiId?: string;
  defaultPayeeName?: string;
  defaultAmount?: number;
  orderNumber?: string;
  customerName?: string;
  projectTitle?: string;
}

export const DynamicQrModal: React.FC<DynamicQrModalProps> = ({
  isOpen,
  onClose,
  defaultUpiId,
  defaultPayeeName,
  defaultAmount = 0,
  orderNumber = 'WB-ORDER',
  customerName = 'Valued Customer',
  projectTitle = 'Fabrication Order'
}) => {
  const { adminSettings, currentUser, playSparkSound } = useApp();

  const [upiId, setUpiId] = useState(
    defaultUpiId || currentUser.shopName ? adminSettings.ownerUpiId : 'lovejeetsolanki420@okhdfcbank'
  );
  const [payeeName, setPayeeName] = useState(
    defaultPayeeName || currentUser.shopName || adminSettings.ownerName
  );
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [note, setNote] = useState(`${orderNumber} - ${projectTitle}`);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultUpiId) setUpiId(defaultUpiId);
    if (defaultPayeeName) setPayeeName(defaultPayeeName);
    if (defaultAmount !== undefined) setAmount(defaultAmount);
    if (orderNumber) setNote(`${orderNumber} - ${projectTitle}`);
  }, [defaultUpiId, defaultPayeeName, defaultAmount, orderNumber, projectTitle]);

  // Generate UPI URI:
  // upi://pay?pa=address@bank&pn=PayeeName&am=1500.00&cu=INR&tn=OrderNote
  const generateUpiUri = () => {
    const cleanUpi = upiId.trim();
    const cleanName = encodeURIComponent(payeeName.trim() || 'WeldBro Shop');
    const cleanNote = encodeURIComponent(note.trim() || 'Fabrication Payment');
    const amtStr = amount > 0 ? `&am=${amount.toFixed(2)}` : '';
    return `upi://pay?pa=${cleanUpi}&pn=${cleanName}${amtStr}&tn=${cleanNote}&cu=INR`;
  };

  useEffect(() => {
    if (!isOpen) return;

    const uri = generateUpiUri();
    QRCode.toDataURL(uri, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
  }, [isOpen, upiId, payeeName, amount, note]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    playSparkSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    playSparkSound();
    const link = document.createElement('a');
    link.download = `WeldBro-UPI-QR-${orderNumber}-${amount || 'any'}.png`;
    link.href = qrDataUrl;
    link.click();
    confetti({ particleCount: 30, spread: 50 });
  };

  const handlePrintStandee = () => {
    playSparkSound();
    window.print();
  };

  const handleShareWhatsApp = () => {
    playSparkSound();
    const uri = generateUpiUri();
    const text = `*WELDBRO DYNAMIC UPI PAYMENT REQUEST*\n\nShop / Payee: *${payeeName}*\nOrder / Ref: *${orderNumber}*\nCustomer: *${customerName}*\nAmount Due: *₹${amount.toLocaleString()}*\nUPI ID: *${upiId}*\n\nClick to Pay directly via any UPI app:\n${uri}\n\nScan QR code or pay using Google Pay, PhonePe, Paytm, BHIM.\n_Permanent Version - No Expiry_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-8">
        
        {/* Header Close */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="no-print mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>DYNAMIC QR PAYMENT GENERATOR</span>
          </div>
          <h3 className="text-2xl font-black font-heading text-white mt-1">
            INSTANT CUSTOMER UPI PAYMENT
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time scannable QR code generated for exact order balance.
          </p>
        </div>

        {/* UPI Handle & Amount Input Controls (No-Print) */}
        <div className="no-print mb-5 space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 font-bold">
              Shop Payment Configuration
            </span>
            <button
              onClick={() => setIsEditingDetails(!isEditingDetails)}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingDetails ? 'Done' : 'Change UPI ID'}</span>
            </button>
          </div>

          {isEditingDetails ? (
            <div className="space-y-2 pt-1 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Shop UPI Handle / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@okhdfcbank"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Payee / Business Name</label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="e.g. Solanki Smart Welding"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase">Current Shop UPI ID</p>
                <p className="text-xs font-mono font-bold text-amber-400">{upiId}</p>
                <p className="text-[11px] text-slate-300">{payeeName}</p>
              </div>
              <button
                onClick={handleCopyUpi}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}

          {/* Editable Amount for this Payment */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Order Balance to Pay (₹)
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-base font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Payment Reference Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Printable & Scannable QR Standee Card */}
        <div
          ref={printRef}
          className="bg-white text-slate-950 p-6 rounded-3xl shadow-xl border-4 border-slate-950 flex flex-col items-center text-center print-page relative overflow-hidden"
        >
          {/* Top Brand Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black font-heading text-slate-950 tracking-wider">
              {adminSettings.appName.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono uppercase bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
              PAY
            </span>
          </div>

          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {payeeName}
          </p>

          <p className="text-[11px] text-slate-500 font-mono mb-3">
            Order Ref: {orderNumber} · Customer: {customerName}
          </p>

          {/* Amount Badge */}
          <div className="mb-3 px-5 py-2 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-mono">
            <span className="text-[11px] font-bold block uppercase tracking-wider text-emerald-700">
              Amount Payable
            </span>
            <span className="text-3xl font-black tracking-tight text-emerald-800">
              ₹{amount.toLocaleString()}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="relative p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-inner mb-3">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Dynamic UPI QR Code"
                className="w-52 h-52 object-contain"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400 font-mono text-xs">
                Generating QR...
              </div>
            )}
            {/* Center WeldBro Stamp */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shadow">
                <Flame className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Supported Apps Strip */}
          <div className="w-full flex items-center justify-center gap-3 text-[10px] font-bold text-slate-600 mb-2 font-mono uppercase">
            <span>GPay</span>
            <span>·</span>
            <span>PhonePe</span>
            <span>·</span>
            <span>Paytm</span>
            <span>·</span>
            <span>BHIM</span>
            <span>·</span>
            <span>Any UPI</span>
          </div>

          <div className="w-full pt-2 border-t border-slate-200 text-center text-[10px] text-slate-500 font-mono">
            <p>Scan with any UPI app to transfer instantly to:</p>
            <p className="font-bold text-slate-900">{upiId}</p>
          </div>
        </div>

        {/* Action Controls (No-Print) */}
        <div className="no-print mt-5 grid grid-cols-3 gap-2">
          <button
            onClick={handleDownloadQr}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Save Image</span>
          </button>

          <button
            onClick={handlePrintStandee}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Standee</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Permanent Version Notice */}
        <div className="no-print mt-4 text-center">
          <span className="text-[10px] font-mono text-emerald-400/80">
            ✓ Permanent Version - No Expiry · Unlimited QR Code Generations
          </span>
        </div>

      </div>
    </div>
  );
};
