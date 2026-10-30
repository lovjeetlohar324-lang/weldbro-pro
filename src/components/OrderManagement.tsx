// Permanent Version - No Expiry
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { DynamicQrModal } from './DynamicQrModal';
import {
  FileText,
  Printer,
  Share2,
  CheckCircle,
  Clock,
  Plus,
  X,
  CreditCard,
  QrCode,
  Flame,
  AlertCircle,
  Truck,
  Wrench,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, recordOrderPayment, createOrder, adminSettings, currentUser, playSparkSound } = useApp();

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState<Order | null>(null);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [qrModalOrder, setQrModalOrder] = useState<Order | null>(null);
  const [quickQrOpen, setQuickQrOpen] = useState(false);
  const [invoiceQrDataUrl, setInvoiceQrDataUrl] = useState<string>('');

  // Payment Form state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'cash' | 'online_upi'>('online_upi');
  const [txnId, setTxnId] = useState('');

  // New Order Form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newDimensions, setNewDimensions] = useState('');
  const [newMaterial, setNewMaterial] = useState('Tata MS 50x50mm + 12mm Sariya');
  const [newMaterialCost, setNewMaterialCost] = useState<number>(18000);
  const [newLabour, setNewLabour] = useState<number>(5000);
  const [newInstall, setNewInstall] = useState<number>(2000);
  const [newTransport, setNewTransport] = useState<number>(1000);
  const [newAdvance, setNewAdvance] = useState<number>(10000);

  // Generate dynamic QR for the invoice
  useEffect(() => {
    if (!selectedReceiptOrder) return;
    const balance = selectedReceiptOrder.remainingBalance > 0
      ? selectedReceiptOrder.remainingBalance
      : selectedReceiptOrder.totalAmount;
    const upiId = adminSettings.ownerUpiId || 'lovejeetsolanki420@okhdfcbank';
    const payeeName = encodeURIComponent(selectedReceiptOrder.shopName || adminSettings.ownerName);
    const note = encodeURIComponent(`Invoice ${selectedReceiptOrder.receiptNumber}`);
    const upiUri = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${balance.toFixed(2)}&tn=${note}&cu=INR`;

    QRCode.toDataURL(upiUri, {
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' }
    })
      .then((url) => setInvoiceQrDataUrl(url))
      .catch((e) => console.error(e));
  }, [selectedReceiptOrder, adminSettings.ownerUpiId, adminSettings.ownerName]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new_order':
        return { label: 'New Order', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'quotation_sent':
        return { label: 'Quotation Sent', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'accepted':
        return { label: 'Accepted', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'work_started':
        return { label: 'Work Started', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      case 'in_progress':
        return { label: 'In Progress', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
      case 'completed':
        return { label: 'Completed', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      case 'payment_pending':
        return { label: 'Payment Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' };
      case 'paid':
        return { label: 'Paid in Full', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/30' };
      default:
        return { label: status, color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const handleOpenPaymentModal = (order: Order) => {
    setPaymentModalOrder(order);
    setPayAmount(order.remainingBalance);
    setTxnId(`UPI-TXN-${Date.now().toString().slice(-6)}`);
    playSparkSound();
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalOrder) return;
    playSparkSound();
    confetti({ particleCount: 50, spread: 70 });
    recordOrderPayment(paymentModalOrder.id, payAmount, payMethod, payMethod === 'online_upi' ? txnId : undefined);
    setPaymentModalOrder(null);
  };

  const handleCreateNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    playSparkSound();
    confetti({ particleCount: 40, spread: 60 });

    const totalAmt = newMaterialCost + newLabour + newInstall + newTransport;
    const remBal = Math.max(0, totalAmt - newAdvance);

    const created: Order = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      receiptNumber: `WB-REC-2026-${Date.now().toString().slice(-4)}`,
      customerId: `cust-${Date.now()}`,
      customerName: newCustName,
      customerPhone: newCustPhone,
      welderId: currentUser.id,
      shopName: currentUser.shopName || 'WeldBro Smart Hub',
      title: newTitle,
      items: [
        {
          id: `item-${Date.now()}`,
          name: newItemName || newTitle,
          dimensions: newDimensions || 'Custom site fabrication',
          quantity: 1,
          material: newMaterial,
          unitPrice: newMaterialCost + newLabour,
          totalPrice: newMaterialCost + newLabour
        }
      ],
      materialCost: newMaterialCost,
      labourCharges: newLabour,
      installationCharges: newInstall,
      transportCharges: newTransport,
      additionalCharges: 0,
      totalAmount: totalAmt,
      advancePayment: newAdvance,
      remainingBalance: remBal,
      status: remBal === 0 ? 'paid' : newAdvance > 0 ? 'in_progress' : 'new_order',
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      paymentMethod: newAdvance > 0 ? 'cash' : undefined
    };

    createOrder(created);
    setNewOrderModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareReceiptWhatsApp = (order: Order) => {
    const text = `*WELDBRO OFFICIAL RECEIPT*\nInvoice No: ${order.receiptNumber}\nShop: ${order.shopName}\nCustomer: ${order.customerName}\nItem: ${order.title}\nTotal Amount: ₹${order.totalAmount}\nAdvance Received: ₹${order.advancePayment}\nRemaining Balance: ₹${order.remainingBalance}\nStatus: ${order.remainingBalance === 0 ? 'PAID' : 'PENDING'}\n\nPay via UPI: ${adminSettings.ownerUpiId}\nPowered by WeldBro.in (Permanent Version - No Expiry)`;
    window.open(`https://api.whatsapp.com/send?phone=${order.customerPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Permanent Version Banner */}
      <div className="no-print mb-4 flex items-center justify-between px-4 py-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs font-mono text-emerald-400">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Permanent Version - No Expiry · Full Business &amp; QR Payments Active</span>
        </div>
        <span className="text-[11px] text-slate-400">Lifetime License</span>
      </div>

      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>FABRICATION WORKFLOW &amp; BILLING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide mt-1">
            ORDERS &amp; DYNAMIC QR PAYMENTS
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Track live fabrication jobs from quotation to completion, collect advance payments via UPI or cash, and generate dynamic scannable QR codes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Dynamic QR Button */}
          <button
            onClick={() => {
              setQuickQrOpen(true);
              playSparkSound();
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate UPI QR</span>
          </button>

          <button
            onClick={() => {
              setNewOrderModalOpen(true);
              playSparkSound();
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Order</span>
          </button>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Receipt / Job #</th>
                <th className="px-4 py-3">Customer Details</th>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3 text-right">Total (₹)</th>
                <th className="px-4 py-3 text-right">Advance (₹)</th>
                <th className="px-4 py-3 text-right">Balance (₹)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {orders.map((ord) => {
                const badge = getStatusBadge(ord.status);
                return (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {ord.receiptNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{ord.customerName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{ord.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-200 font-medium max-w-xs truncate">{ord.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Target: {ord.deliveryDate}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white whitespace-nowrap">
                      ₹{ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-400 whitespace-nowrap">
                      ₹{ord.advancePayment.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold whitespace-nowrap">
                      <span className={ord.remainingBalance > 0 ? 'text-amber-400 font-extrabold' : 'text-slate-500'}>
                        ₹{ord.remainingBalance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-mono px-2 py-1 rounded border ${badge.color} bg-slate-950 focus:outline-none`}
                      >
                        <option value="new_order">New Order</option>
                        <option value="quotation_sent">Quotation Sent</option>
                        <option value="accepted">Accepted</option>
                        <option value="work_started">Work Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="payment_pending">Payment Pending</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Dynamic QR Button for this order */}
                        <button
                          onClick={() => {
                            setQrModalOrder(ord);
                            playSparkSound();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1 border border-cyan-800"
                          title="Generate Dynamic UPI QR for this order balance"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR Pay</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedReceiptOrder(ord);
                            playSparkSound();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-medium flex items-center gap-1 border border-slate-700"
                          title="Generate Branded Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>

                        {ord.remainingBalance > 0 && (
                          <button
                            onClick={() => handleOpenPaymentModal(ord)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-medium border border-emerald-800"
                            title="Collect Payment"
                          >
                            <span>Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Branded PDF / Printable Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-950 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 print-page">
            
            {/* Modal Controls (Hidden in print) */}
            <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 shadow"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => handleShareReceiptWhatsApp(selectedReceiptOrder)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-500 shadow"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Branded Invoice Layout */}
            <div className="space-y-6">
              {/* Header Lockup */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-amber-400 shadow-md">
                    <Flame className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black font-heading text-slate-900 tracking-wider leading-none">
                      {adminSettings.appName.toUpperCase()}
                    </h2>
                    <p className="text-[11px] font-sans text-slate-600 font-medium">
                      {adminSettings.tagline}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      HQ: {adminSettings.businessAddress}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs uppercase tracking-widest text-slate-500 block">
                    TAX INVOICE / RECEIPT
                  </span>
                  <p className="text-base font-bold text-slate-900">
                    {selectedReceiptOrder.receiptNumber}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Date: {new Date(selectedReceiptOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Welder & Customer 2-Col Split */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                    FABRICATOR &amp; WORKSHOP DETAILS
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{selectedReceiptOrder.shopName}</p>
                  <p className="text-slate-700">Operator: {adminSettings.ownerName}</p>
                  <p className="text-slate-700">Phone: {adminSettings.ownerMobile}</p>
                  <p className="text-slate-500 font-mono text-[10px] mt-1">UPI: {adminSettings.ownerUpiId}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                    BILLED TO CUSTOMER
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{selectedReceiptOrder.customerName}</p>
                  <p className="text-slate-700">Phone: {selectedReceiptOrder.customerPhone}</p>
                  <p className="text-slate-700">Target Delivery: {selectedReceiptOrder.deliveryDate}</p>
                  <p className="text-slate-500 font-mono text-[10px] mt-1">
                    Status: {selectedReceiptOrder.remainingBalance === 0 ? 'COMPLETED / PAID' : 'PENDING'}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-mono text-[11px] text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2">Item Description &amp; Material</th>
                      <th className="px-4 py-2">Dimensions</th>
                      <th className="px-4 py-2 text-center">Qty</th>
                      <th className="px-4 py-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedReceiptOrder.items.map((it) => (
                      <tr key={it.id}>
                        <td className="px-4 py-2.5">
                          <p className="font-bold text-slate-900">{it.name}</p>
                          <p className="text-[11px] text-slate-500">{it.material}</p>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-700">
                          {it.dimensions}
                        </td>
                        <td className="px-4 py-2.5 text-center font-mono text-slate-700">
                          {it.quantity}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                          ₹{it.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="grid grid-cols-2 gap-6 items-end">
                {/* Genuine Scannable Dynamic QR Code */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                  <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shrink-0">
                    {invoiceQrDataUrl ? (
                      <img src={invoiceQrDataUrl} alt="UPI QR" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-14 h-14 text-slate-900" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <p className="font-bold text-slate-900">SCAN TO PAY VIA UPI</p>
                    <p className="font-mono text-[10px] text-slate-500 truncate max-w-[170px]">{adminSettings.ownerUpiId}</p>
                    <p className="text-[9px] text-emerald-700 font-bold mt-0.5">
                      Amount: ₹{selectedReceiptOrder.remainingBalance > 0 ? selectedReceiptOrder.remainingBalance.toLocaleString() : selectedReceiptOrder.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Google Pay · PhonePe · Paytm</p>
                  </div>
                </div>

                {/* Subtotals & Balance */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Raw Material Charges:</span>
                    <span>₹{selectedReceiptOrder.materialCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Fabrication &amp; Labour:</span>
                    <span>₹{selectedReceiptOrder.labourCharges.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Site Installation &amp; Transport:</span>
                    <span>₹{(selectedReceiptOrder.installationCharges + selectedReceiptOrder.transportCharges).toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-base font-bold text-slate-950">
                    <span>TOTAL AMOUNT:</span>
                    <span>₹{selectedReceiptOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Advance Received:</span>
                    <span>- ₹{selectedReceiptOrder.advancePayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-extrabold text-sm border-t border-slate-200 pt-1">
                    <span>REMAINING BALANCE:</span>
                    <span>₹{selectedReceiptOrder.remainingBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-mono">
                Thank you for choosing WeldBro Certified Fabrication. Permanent Version - No Expiry.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setPaymentModalOrder(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-1">
              RECORD PAYMENT
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Order: {paymentModalOrder.receiptNumber} · {paymentModalOrder.customerName}
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Amount to Collect (₹)</label>
                <input
                  type="number"
                  required
                  max={paymentModalOrder.remainingBalance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-lg font-mono font-bold text-amber-400"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Remaining balance due: ₹{paymentModalOrder.remainingBalance}
                </span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('online_upi')}
                    className={`py-2 rounded-xl text-xs font-bold text-center border ${
                      payMethod === 'online_upi'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Online UPI (GPay/PhonePe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('cash')}
                    className={`py-2 rounded-xl text-xs font-bold text-center border ${
                      payMethod === 'cash'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    Cash Payment
                  </button>
                </div>
              </div>

              {payMethod === 'online_upi' && (
                <div>
                  <label className="text-slate-400 block mb-1">UPI Transaction Reference ID</label>
                  <input
                    type="text"
                    required
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20"
              >
                Confirm Payment of ₹{payAmount}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {newOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setNewOrderModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-1">
              CREATE NEW ORDER / INVOICE
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter customer details and itemized fabrication charges.
            </p>

            <form onSubmit={handleCreateNewOrder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Rameshwar Gehlot"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Customer Mobile</label>
                  <input
                    type="text"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="+91 94142 55667"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Balcony Safety Grill (4 Units)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    placeholder="e.g. 6 ft x 4 ft"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Material Specification</label>
                  <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div>
                  <label className="text-slate-400 block mb-1 text-[10px]">Material (₹)</label>
                  <input
                    type="number"
                    value={newMaterialCost}
                    onChange={(e) => setNewMaterialCost(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[10px]">Labour (₹)</label>
                  <input
                    type="number"
                    value={newLabour}
                    onChange={(e) => setNewLabour(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[10px]">Install (₹)</label>
                  <input
                    type="number"
                    value={newInstall}
                    onChange={(e) => setNewInstall(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[10px]">Transport (₹)</label>
                  <input
                    type="number"
                    value={newTransport}
                    onChange={(e) => setNewTransport(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Advance Received (₹)</label>
                <input
                  type="number"
                  value={newAdvance}
                  onChange={(e) => setNewAdvance(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/20"
                >
                  Save &amp; Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic QR Payment Modal for Specific Order */}
      {qrModalOrder && (
        <DynamicQrModal
          isOpen={true}
          onClose={() => setQrModalOrder(null)}
          defaultUpiId={adminSettings.ownerUpiId}
          defaultPayeeName={qrModalOrder.shopName}
          defaultAmount={qrModalOrder.remainingBalance > 0 ? qrModalOrder.remainingBalance : qrModalOrder.totalAmount}
          orderNumber={qrModalOrder.receiptNumber}
          customerName={qrModalOrder.customerName}
          projectTitle={qrModalOrder.title}
        />
      )}

      {/* Quick Standalone UPI QR Modal */}
      {quickQrOpen && (
        <DynamicQrModal
          isOpen={true}
          onClose={() => setQuickQrOpen(false)}
          defaultUpiId={adminSettings.ownerUpiId}
          defaultPayeeName={currentUser.shopName || adminSettings.ownerName}
          defaultAmount={0}
          orderNumber={`WB-INSTANT-${Date.now().toString().slice(-4)}`}
          customerName="Counter Customer"
          projectTitle="Workshop Fabrication"
        />
      )}

    </div>
  );
};
