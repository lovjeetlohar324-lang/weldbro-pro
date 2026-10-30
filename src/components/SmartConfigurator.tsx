import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MaterialProfile, InventoryItem } from '../types';
import {
  RotateCcw,
  PlusCircle,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Flame,
  Warehouse,
  AlertTriangle,
  Package,
  TrendingDown,
  Plus,
  Minus,
  Search,
  Filter,
  Share2,
  Trash2,
  ArrowRight,
  Sliders,
  Sparkles,
  PhoneCall,
  ExternalLink,
  ShieldAlert,
  Boxes
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartConfigurator: React.FC = () => {
  const {
    t,
    playSparkSound,
    createOrder,
    currentUser,
    adminSettings,
    inventory,
    updateInventoryStock,
    setInventoryItemStock,
    addInventoryItem,
    deleteInventoryItem,
    lowStockAlerts,
    lowStockCount
  } = useApp();

  const [activeTab, setActiveTab] = useState<'configurator' | 'inventory'>('configurator');
  const [inventoryFilter, setInventoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [profile, setProfile] = useState<MaterialProfile>('round_pipe');
  const [thicknessMm, setThicknessMm] = useState<number>(6.0);
  const [lengthMm, setLengthMm] = useState<number>(1200);
  const [outerDimMm, setOuterDimMm] = useState<number>(60); // OD for round, width for square
  const [quantity, setQuantity] = useState<number>(1);
  const [materialType, setMaterialType] = useState<'mild_steel' | 'stainless_steel' | 'iron' | 'aluminium' | 'copper'>('mild_steel');
  const [grade, setGrade] = useState<string>('Mild Steel (FE550)');
  const [density, setDensity] = useState<number>(7850); // kg/m^3

  // Rates in INR (editable)
  const [ratePerKg, setRatePerKg] = useState<number>(76);
  const [labourRatePerUnit, setLabourRatePerUnit] = useState<number>(350);
  const [transportCost, setTransportCost] = useState<number>(600);
  const [installationCost, setInstallationCost] = useState<number>(800);
  const [weldingRodPackets, setWeldingRodPackets] = useState<number>(1);
  const [weldingRodRate, setWeldingRodRate] = useState<number>(450);

  const [notification, setNotification] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Exact volume & weight calculation:
  // Density = 7850 kg/m^3 = 7.85e-6 kg/mm^3
  const calculateSinglePieceWeight = (): number => {
    let volumeMm3 = 0;
    const L = lengthMm;
    const t = thicknessMm;
    const D = outerDimMm;

    if (profile === 'round_pipe') {
      // Hollow cylinder: pi * (R_outer^2 - R_inner^2) * L
      const rOuter = D / 2;
      const rInner = Math.max(0, rOuter - t);
      const area = Math.PI * (rOuter * rOuter - rInner * rInner);
      volumeMm3 = area * L;
    } else if (profile === 'square_pipe') {
      // Hollow square: (W_outer^2 - W_inner^2) * L
      const wInner = Math.max(0, D - 2 * t);
      const area = (D * D) - (wInner * wInner);
      volumeMm3 = area * L;
    } else if (profile === 'sariya') {
      // Solid ribbed rebar: ~ pi * r^2 * L * 1.05 (for ribs)
      const r = D / 2;
      const area = Math.PI * r * r * 1.04;
      volumeMm3 = area * L;
    } else if (profile === 'flat_bar') {
      // Width x Thickness x Length
      volumeMm3 = D * t * L;
    } else if (profile === 'angle') {
      // L shaped angle iron: 2 legs of width D minus corner
      const area = (2 * D - t) * t;
      volumeMm3 = area * L;
    } else if (profile === 'sheet') {
      // Flat sheet: D (width mm) x 1000mm standard section x thickness
      volumeMm3 = D * L * t;
    }

    // Convert mm^3 to m^3
    const volumeM3 = volumeMm3 / 1e9;
    return volumeM3 * density;
  };

  const singleWeightKg = calculateSinglePieceWeight();
  const totalWeightKg = singleWeightKg * quantity;
  const weightLbs = totalWeightKg * 2.20462;

  const rawMaterialCost = Math.round(totalWeightKg * ratePerKg);
  const totalLabour = labourRatePerUnit * quantity;
  const totalWeldingRods = weldingRodPackets * weldingRodRate;
  const totalProjectCost =
    rawMaterialCost + totalLabour + totalWeldingRods + transportCost + installationCost;

  // 3D Canvas Live Preview Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotationAngle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Cyber / metallic grid background
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const centerX = w / 2;
      const centerY = h / 2;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Subtle slow rotation or tilt
      rotationAngle += 0.005;
      const tilt = Math.sin(rotationAngle) * 0.08 - 0.25;

      if (profile === 'round_pipe') {
        // Draw 3D Metallic Round Tube
        const radius = Math.min(65, outerDimMm * 0.9);
        const innerRadius = Math.max(10, radius - thicknessMm * 3.5);
        const tubeLength = 220;

        // Tube Body Gradient
        const grad = ctx.createLinearGradient(0, -radius, 0, radius);
        grad.addColorStop(0, '#64748B');
        grad.addColorStop(0.3, '#CBD5E1');
        grad.addColorStop(0.5, '#F8FAFC');
        grad.addColorStop(0.8, '#475569');
        grad.addColorStop(1, '#1E293B');

        // Cylinder side projection
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(-tubeLength / 2, 0, radius * 0.35, radius, tilt, Math.PI / 2, -Math.PI / 2);
        ctx.lineTo(tubeLength / 2, -radius);
        ctx.ellipse(tubeLength / 2, 0, radius * 0.35, radius, tilt, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(-tubeLength / 2, radius);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Front Face Outer Ellipse
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.ellipse(-tubeLength / 2, 0, radius * 0.35, radius, tilt, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner Bore Hollow Ellipse
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.ellipse(-tubeLength / 2, 0, innerRadius * 0.35, innerRadius, tilt, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Wall Thickness Indicator Dimension Line
        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-tubeLength / 2, -radius);
        ctx.lineTo(-tubeLength / 2, -innerRadius);
        ctx.stroke();

        ctx.fillStyle = '#FB923C';
        ctx.font = '10px monospace';
        ctx.fillText(`t=${thicknessMm}mm`, -tubeLength / 2 + 10, -radius + 8);
      } else if (profile === 'square_pipe') {
        // Draw 3D Square Box Pipe
        const size = Math.min(100, outerDimMm * 1.5);
        const innerSize = Math.max(15, size - thicknessMm * 6);
        const length = 200;

        // Front face (Hollow Square)
        ctx.save();
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;

        const fx = -length / 2 - 30;
        const fy = -size / 2;

        // Outer square
        ctx.fillRect(fx, fy, size * 0.7, size);
        ctx.strokeRect(fx, fy, size * 0.7, size);

        // Inner hollow cut
        ctx.fillStyle = '#020617';
        ctx.fillRect(fx + (thicknessMm * 3), fy + (thicknessMm * 3), (size * 0.7) - (thicknessMm * 6), size - (thicknessMm * 6));
        ctx.strokeStyle = '#0284C7';
        ctx.strokeRect(fx + (thicknessMm * 3), fy + (thicknessMm * 3), (size * 0.7) - (thicknessMm * 6), size - (thicknessMm * 6));

        // Top extruded side
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + length * 0.8, fy - 35);
        ctx.lineTo(fx + (size * 0.7) + length * 0.8, fy - 35);
        ctx.lineTo(fx + (size * 0.7), fy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#64748B';
        ctx.stroke();

        // Right side extruded
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(fx + (size * 0.7), fy);
        ctx.lineTo(fx + (size * 0.7) + length * 0.8, fy - 35);
        ctx.lineTo(fx + (size * 0.7) + length * 0.8, fy - 35 + size);
        ctx.lineTo(fx + (size * 0.7), fy + size);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.stroke();

        ctx.restore();
      } else {
        // Sariya (Deformed Rebar Bar)
        const radius = Math.min(35, outerDimMm * 0.7);
        const length = 260;

        // Core Bar Gradient
        const rebarGrad = ctx.createLinearGradient(0, -radius, 0, radius);
        rebarGrad.addColorStop(0, '#475569');
        rebarGrad.addColorStop(0.3, '#94A3B8');
        rebarGrad.addColorStop(0.6, '#334155');
        rebarGrad.addColorStop(1, '#0F172A');

        ctx.fillStyle = rebarGrad;
        ctx.fillRect(-length / 2, -radius, length, radius * 2);

        // Circular end
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.ellipse(-length / 2, 0, radius * 0.4, radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38BDF8';
        ctx.stroke();

        // Rebar Ribs (Transverse deformations)
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3.5;
        for (let rx = -length / 2 + 25; rx < length / 2 - 15; rx += 18) {
          ctx.beginPath();
          ctx.arc(rx, 0, radius, -Math.PI / 2.2, Math.PI / 2.2);
          ctx.stroke();
        }

        // Longitudinal Ribs
        ctx.strokeStyle = '#F1F5F9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-length / 2, -radius * 0.4);
        ctx.lineTo(length / 2, -radius * 0.4);
        ctx.stroke();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [profile, thicknessMm, outerDimMm, lengthMm]);

  const handleReset = () => {
    setProfile('round_pipe');
    setThicknessMm(6.0);
    setLengthMm(1200);
    setOuterDimMm(60);
    setQuantity(1);
    playSparkSound();
  };

  const handleAddToQuote = () => {
    playSparkSound();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      receiptNumber: `WB-QUOTE-${Date.now().toString().slice(-4)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      welderId: 'weld-01',
      shopName: currentUser.shopName || 'WeldBro Smart Fabrication Hub',
      title: `Custom ${profile.toUpperCase().replace('_', ' ')} Fabrication (${lengthMm}mm × ${thicknessMm}mm)`,
      items: [
        {
          id: `item-${Date.now()}`,
          name: `${profile.toUpperCase().replace('_', ' ')} (${grade})`,
          dimensions: `Len: ${lengthMm}mm, Dim: ${outerDimMm}mm, Thk: ${thicknessMm}mm`,
          quantity,
          material: grade,
          unitPrice: Math.round(singleWeightKg * ratePerKg + labourRatePerUnit),
          totalPrice: rawMaterialCost + totalLabour
        }
      ],
      materialCost: rawMaterialCost,
      labourCharges: totalLabour,
      installationCharges: installationCost,
      transportCharges: transportCost,
      additionalCharges: totalWeldingRods,
      totalAmount: totalProjectCost,
      advancePayment: Math.round(totalProjectCost * 0.5),
      remainingBalance: Math.round(totalProjectCost * 0.5),
      status: 'quotation_sent' as const,
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      notes: `Configured via 3D Configurator. Total est. weight: ${totalWeightKg.toFixed(2)} kg.`
    };

    createOrder(newOrder);
    setNotification('Configured item added to Orders & Quotation list successfully!');
    setTimeout(() => setNotification(null), 4000);
  };

  // Find matching inventory item for currently selected configurator profile
  const matchingInventoryItem =
    inventory.find(
      item =>
        item.profile === profile &&
        (materialType === 'stainless_steel'
          ? item.materialType === 'stainless_steel'
          : item.materialType === 'mild_steel')
    ) || inventory.find(item => item.profile === profile);

  // New inventory profile modal form state
  const [newItem, setNewItem] = useState<{
    name: string;
    profile: MaterialProfile | 'rod' | 'hardware';
    materialType: 'mild_steel' | 'stainless_steel' | 'iron' | 'aluminium' | 'copper' | 'consumable';
    dimensionSummary: string;
    stockQuantity: number;
    unit: 'pipes' | 'bars' | 'sheets' | 'packets' | 'kg' | 'units';
    minThreshold: number;
    weightPerUnitKg: number;
    costPerUnit: number;
    rackLocation: string;
    supplierName: string;
    notes: string;
  }>({
    name: '',
    profile: 'round_pipe',
    materialType: 'mild_steel',
    dimensionSummary: '',
    stockQuantity: 10,
    unit: 'pipes',
    minThreshold: 5,
    weightPerUnitKg: 15,
    costPerUnit: 1200,
    rackLocation: 'Rack A-1 (Main Yard)',
    supplierName: 'Jindal Steel Pipes Depot',
    notes: ''
  });

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const created: InventoryItem = {
      ...newItem,
      id: `inv-${Date.now().toString().slice(-4)}`,
      lastRestockedDate: new Date().toISOString().split('T')[0]
    };

    addInventoryItem(created);
    setShowAddModal(false);
    playSparkSound();
    setNotification(`New steel profile "${created.name}" added to workshop stock!`);
    setTimeout(() => setNotification(null), 4000);

    // Reset form
    setNewItem({
      name: '',
      profile: 'round_pipe',
      materialType: 'mild_steel',
      dimensionSummary: '',
      stockQuantity: 10,
      unit: 'pipes',
      minThreshold: 5,
      weightPerUnitKg: 15,
      costPerUnit: 1200,
      rackLocation: 'Rack A-1 (Main Yard)',
      supplierName: '',
      notes: ''
    });
  };

  const handleQuickDeductCurrentProfile = () => {
    if (!matchingInventoryItem) return;
    updateInventoryStock(matchingInventoryItem.id, -quantity);
    playSparkSound();
    setNotification(
      `Deducted ${quantity} ${matchingInventoryItem.unit} of "${matchingInventoryItem.name}" from inventory stock!`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const totalWeightInStock = inventory.reduce(
    (acc, item) => acc + item.stockQuantity * item.weightPerUnitKg,
    0
  );
  const totalValueInStock = inventory.reduce(
    (acc, item) => acc + item.stockQuantity * item.costPerUnit,
    0
  );

  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dimensionSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rackLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.supplierName && item.supplierName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (inventoryFilter === 'low_stock') return item.stockQuantity <= item.minThreshold;
    if (inventoryFilter === 'round_pipe') return item.profile === 'round_pipe';
    if (inventoryFilter === 'square_pipe') return item.profile === 'square_pipe';
    if (inventoryFilter === 'sariya') return item.profile === 'sariya';
    if (inventoryFilter === 'angle_flat') return item.profile === 'angle' || item.profile === 'flat_bar';
    if (inventoryFilter === 'rod') return item.profile === 'rod';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{t.nextLevelConfigurator}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide mt-1">
            CUSTOM STEEL &amp; PIPE CONFIGURATOR
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Precision engineering calculations with live 3D thickness preview, mass density &amp; cost estimation.
          </p>
        </div>

        {/* Live Steel Market Ticker */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono">
          <span className="text-slate-400">Current Steel Mandi Rate:</span>
          <span className="text-amber-400 font-bold">₹{ratePerKg} / kg</span>
          <button
            onClick={() => {
              const newRate = prompt('Enter new raw steel rate (₹/kg):', ratePerKg.toString());
              if (newRate && !isNaN(Number(newRate))) {
                setRatePerKg(Number(newRate));
              }
            }}
            className="text-[11px] text-cyan-400 underline ml-1 hover:text-cyan-300"
          >
            Edit
          </button>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <span className="text-xs font-mono">Order Saved</span>
        </div>
      )}

      {/* Mode Switcher Tabs & Auto-Alert Indicator */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('configurator');
              playSparkSound();
            }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'configurator'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>3D Configurator &amp; Mass Calculator</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('inventory');
              playSparkSound();
            }}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all relative ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Material Inventory Tracker</span>
            {lowStockCount > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black animate-pulse flex items-center gap-1 shadow-sm">
                <AlertTriangle className="w-3 h-3 stroke-[3]" />
                <span>{lowStockCount} Low Alert{lowStockCount > 1 ? 's' : ''}</span>
              </span>
            )}
          </button>
        </div>

        {activeTab === 'inventory' ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Steel Profile</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setActiveTab('inventory');
              setInventoryFilter('low_stock');
            }}
            className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              lowStockCount > 0
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lowStockCount > 0 ? `${lowStockCount} Profiles Low on Stock` : 'All Supplies Nominal'}</span>
          </button>
        )}
      </div>

      {activeTab === 'configurator' ? (
        /* Main Split Grid (3D Preview on Left, HUD Configurator on Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Col: 3D Live Preview Screen (Matching Image) */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-950 border border-cyan-500/40 p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden">
          {/* Blueprint corner markers */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

          {/* Top Canvas HUD overlay */}
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold">3D</span>
              <span>·</span>
              <span className="text-slate-300">REAL-TIME THICKNESS VIEWPORT</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Tolerance: ±0.1mm
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="relative my-4 flex-1 min-h-[300px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={320}
              className="w-full h-full max-h-[340px] rounded-lg"
            />

            {/* In-canvas Dimension Badges */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-300 space-y-0.5 backdrop-blur">
              <div>Profile: <span className="text-cyan-400 font-bold uppercase">{profile.replace('_', ' ')}</span></div>
              <div>Wall: <span className="text-amber-400 font-bold">{thicknessMm} mm</span></div>
              <div>Length: <span className="text-slate-200">{lengthMm} mm</span></div>
            </div>
          </div>

          {/* Bottom Specs Strip */}
          <div className="pt-3 border-t border-cyan-500/20 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
            <span>Material: <strong className="text-slate-200">{grade}</strong></span>
            <span>Density: <strong className="text-slate-200">{density} kg/m³</strong></span>
            <span>Unit: <strong className="text-cyan-400">Metric (ISO)</strong></span>
          </div>

          {/* Live Workshop Stock Level & Quick Deduct */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  matchingInventoryItem && matchingInventoryItem.stockQuantity <= matchingInventoryItem.minThreshold
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                }`}
              >
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase text-slate-400">Workshop Inventory:</span>
                  {matchingInventoryItem && matchingInventoryItem.stockQuantity <= matchingInventoryItem.minThreshold ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40 animate-pulse flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Low Supply
                    </span>
                  ) : matchingInventoryItem ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                      ✓ In Stock
                    </span>
                  ) : null}
                </div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">
                  {matchingInventoryItem ? (
                    <span>
                      {matchingInventoryItem.name}:{' '}
                      <strong className={matchingInventoryItem.stockQuantity <= matchingInventoryItem.minThreshold ? 'text-amber-400' : 'text-cyan-400'}>
                        {matchingInventoryItem.stockQuantity} {matchingInventoryItem.unit}
                      </strong>{' '}
                      available
                    </span>
                  ) : (
                    <span className="text-slate-400">Profile stock not logged in warehouse</span>
                  )}
                </div>
                {matchingInventoryItem && (
                  <div className="text-[10px] font-mono text-slate-500">
                    Location: {matchingInventoryItem.rackLocation} · Min Alert: {matchingInventoryItem.minThreshold} {matchingInventoryItem.unit}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {matchingInventoryItem && (
                <button
                  type="button"
                  onClick={handleQuickDeductCurrentProfile}
                  title="Deduct configured units from workshop stock"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold border border-slate-700 active:scale-95 transition-all"
                >
                  Deduct {quantity} {matchingInventoryItem.unit}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('inventory');
                  playSparkSound();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30 flex items-center gap-1 transition-all"
              >
                <span>Stock Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Custom Configurator Controls (Matching Image HUD) */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                    PARAMETRIC CONTROLS
                  </span>
                  <h3 className="text-xl font-bold font-heading text-white">
                    SELECT PROFILE &amp; DIMENSIONS
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">
                LAVPRINTHUB.IN
              </span>
            </div>

            {/* Material Metal Selector */}
            <div className="mb-4">
              <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
                1. Select Material Metal (धातु चुनें):
              </label>
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono">
                {[
                  { id: 'mild_steel', label: 'Mild Steel', grade: 'Mild Steel (FE550)', density: 7850, rate: 76 },
                  { id: 'stainless_steel', label: 'SS-304', grade: 'Stainless Steel (SS-304)', density: 8000, rate: 220 },
                  { id: 'iron', label: 'Iron (लोहा)', grade: 'Cast Iron / Wrought Iron', density: 7870, rate: 72 },
                  { id: 'aluminium', label: 'Aluminium', grade: 'Aluminium 6061', density: 2700, rate: 280 },
                  { id: 'copper', label: 'Copper (तांबा)', grade: 'Pure Electrolytic Copper', density: 8960, rate: 780 }
                ].map((mat) => (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => {
                      setMaterialType(mat.id as typeof materialType);
                      setGrade(mat.grade);
                      setDensity(mat.density);
                      setRatePerKg(mat.rate);
                      playSparkSound();
                    }}
                    className={`py-1.5 px-1 rounded-lg text-center font-bold transition-all truncate ${
                      materialType === mat.id
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {mat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Selector Tabs */}
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
              2. Select Structural Profile (प्रोफ़ाइल आकार):
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800 mb-6">
              <button
                onClick={() => {
                  setProfile('round_pipe');
                  setOuterDimMm(60);
                  playSparkSound();
                }}
                className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
                  profile === 'round_pipe'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                ROUND PIPE
              </button>
              <button
                onClick={() => {
                  setProfile('square_pipe');
                  setOuterDimMm(50);
                  playSparkSound();
                }}
                className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
                  profile === 'square_pipe'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                SQUARE PIPE
              </button>
              <button
                onClick={() => {
                  setProfile('sariya');
                  setOuterDimMm(16);
                  setThicknessMm(16);
                  playSparkSound();
                }}
                className={`py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
                  profile === 'sariya'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                SARIYA (REBAR)
              </button>
            </div>

            {/* Slider 1: Thickness (mm) */}
            <div className="mb-5 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-slate-400">
                  {t.thickness} (mm)
                </label>
                <span className="text-2xl font-black font-mono text-cyan-400 tracking-tight">
                  {thicknessMm.toFixed(1)} <span className="text-xs text-slate-400 font-normal">mm</span>
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="25.0"
                step="0.2"
                value={thicknessMm}
                onChange={(e) => setThicknessMm(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0.8 mm (Thin Gauge)</span>
                <span>6.0 mm (Structural)</span>
                <span>25.0 mm (Heavy Plate)</span>
              </div>
            </div>

            {/* Slider 2: Length (mm) */}
            <div className="mb-5 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-slate-400">
                  {t.length} (mm)
                </label>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-cyan-400 tracking-tight">
                    {lengthMm} <span className="text-xs text-slate-400 font-normal">mm</span>
                  </span>
                  <span className="block text-[11px] text-slate-400 font-mono">
                    ≈ {(lengthMm / 304.8).toFixed(2)} feet
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="100"
                max="6000"
                step="50"
                value={lengthMm}
                onChange={(e) => setLengthMm(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>100 mm (Cut Piece)</span>
                <span>1200 mm (~4 ft)</span>
                <span>6000 mm (Full 20ft Bar)</span>
              </div>
            </div>

            {/* Slider 3: Outer Diameter / Width */}
            <div className="mb-6 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-slate-400">
                  Outer Dimension / Pipe Size (mm)
                </label>
                <span className="text-xl font-bold font-mono text-white">
                  {outerDimMm} <span className="text-xs text-slate-400 font-normal">mm</span>
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="2"
                value={outerDimMm}
                onChange={(e) => setOuterDimMm(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-6 px-1">
              <span className="text-xs font-mono text-slate-300">Number of Units (Quantity):</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center font-mono font-bold text-white text-base">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Weight & Cost Display (Matching HUD) */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="text-center py-3 bg-slate-950 rounded-xl border border-cyan-500/20 mb-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                {t.weightAutoCalc}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-cyan-400 mt-1">
                Weight: {totalWeightKg.toFixed(2)} kg
              </div>
              <span className="text-xs font-mono text-slate-400">
                ≈ {weightLbs.toFixed(2)} lbs · Est. Mass
              </span>
            </div>

            {/* Itemized Project Cost Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs font-mono">
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Material</span>
                <span className="text-white font-bold">₹{rawMaterialCost}</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Labor</span>
                <span className="text-white font-bold">₹{totalLabour}</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Electrodes</span>
                <span className="text-white font-bold">₹{totalWeldingRods}</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Total Est.</span>
                <span className="text-amber-400 font-bold">₹{totalProjectCost}</span>
              </div>
            </div>

            {/* Action Buttons: RESET & ADD TO QUOTE (Exact match from image) */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.reset}</span>
              </button>

              <button
                onClick={handleAddToQuote}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
              >
                <span>{t.addToQuote}</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

      </div>
      ) : (
        /* ================= MATERIAL INVENTORY TRACKER VIEW ================= */
        <div className="space-y-6">
          {/* Critical Low Stock Auto-Alerts Banner */}
          {lowStockAlerts.length > 0 && (
            <div className="rounded-2xl bg-amber-950/40 border-2 border-amber-500/60 p-5 shadow-2xl backdrop-blur relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 animate-pulse">
                    <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                        CRITICAL STOCK AUTO-ALERT SYSTEM
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                        {lowStockCount} Shortage{lowStockCount > 1 ? 's' : ''}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold font-heading text-white">
                      Workshop Steel Supply Running Below Safety Threshold
                    </h3>
                  </div>
                </div>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `*WeldBro Workshop Urgent Restock Alert*\n\n` +
                    `The following profiles are below safety threshold:\n` +
                    lowStockAlerts.map(a => `• ${a.name} (Current: ${a.stockQuantity} ${a.unit}, Min: ${a.minThreshold})`).join('\n') +
                    `\n\nPlease share availability and quote for immediate delivery.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all shrink-0 active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send WhatsApp RFQ to Suppliers</span>
                </a>
              </div>

              {/* Alert Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockAlerts.map((alertItem) => (
                  <div
                    key={alertItem.id}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-amber-400 block truncate font-bold">
                        {alertItem.rackLocation}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">
                        {alertItem.name}
                      </h4>
                      <div className="text-[11px] font-mono text-slate-300 mt-1 flex items-center gap-2">
                        <span>Current: <strong className="text-amber-400">{alertItem.stockQuantity} {alertItem.unit}</strong></span>
                        <span className="text-slate-500">|</span>
                        <span>Safety Min: <strong>{alertItem.minThreshold}</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => {
                          updateInventoryStock(alertItem.id, 5);
                          playSparkSound();
                        }}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30 transition-all"
                      >
                        +5 Restock
                      </button>
                      <button
                        onClick={() => {
                          updateInventoryStock(alertItem.id, 10);
                          playSparkSound();
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono font-bold border border-slate-700 transition-all"
                      >
                        +10 Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workshop Stock Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Total Steel Profiles</span>
                <span className="text-xl sm:text-2xl font-bold text-white">{inventory.length} Logged</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Total Metal Mass</span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {(totalWeightInStock).toFixed(0)} <span className="text-xs text-slate-400 font-normal">kg ({(totalWeightInStock / 1000).toFixed(2)} T)</span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Inventory Value</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                  ₹{Math.round(totalValueInStock).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
              lowStockCount > 0 ? 'bg-amber-950/30 border-amber-500/40' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                lowStockCount > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block tracking-wider">Supply Alerts</span>
                <span className={`text-xl sm:text-2xl font-bold ${lowStockCount > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                  {lowStockCount} {lowStockCount === 1 ? 'Alert' : 'Alerts'}
                </span>
              </div>
            </div>
          </div>

          {/* Search, Filter Pills & Add Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by profile, size, rack location, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              {[
                { id: 'all', label: `All (${inventory.length})` },
                { id: 'low_stock', label: `⚠️ Low Stock (${lowStockCount})` },
                { id: 'round_pipe', label: 'Round Pipes' },
                { id: 'square_pipe', label: 'Square Pipes' },
                { id: 'sariya', label: 'Sariya (Rebar)' },
                { id: 'angle_flat', label: 'Angle / Patti' },
                { id: 'rod', label: 'Welding Rods' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setInventoryFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    inventoryFilter === f.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Items Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item) => {
              const isLow = item.stockQuantity <= item.minThreshold;
              const isCriticallyEmpty = item.stockQuantity === 0;
              const fillPercent = Math.min(100, Math.round((item.stockQuantity / Math.max(item.minThreshold * 2, 1)) * 100));

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isCriticallyEmpty
                      ? 'bg-red-950/20 border-red-500/40 shadow-lg shadow-red-950/20'
                      : isLow
                      ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-950/20'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top Row: Location & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                        <span>📍</span>
                        <span>{item.rackLocation}</span>
                      </span>

                      {isCriticallyEmpty ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Low Supply
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ✓ Optimal
                        </span>
                      )}
                    </div>

                    {/* Profile Title & Specs */}
                    <h4 className="text-sm font-bold text-white font-heading leading-tight mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs font-mono text-cyan-400 mb-2">
                      {item.dimensionSummary}
                    </p>

                    {/* Stock Counter Controls */}
                    <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">Current Stock</span>
                        <div className="text-2xl font-black font-mono text-white flex items-baseline gap-1">
                          <span className={isLow ? 'text-amber-400' : 'text-cyan-400'}>{item.stockQuantity}</span>
                          <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
                        </div>
                      </div>

                      {/* Stepper Buttons & Manual Input */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            updateInventoryStock(item.id, -1);
                            playSparkSound();
                          }}
                          disabled={item.stockQuantity <= 0}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold flex items-center justify-center transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            const val = prompt(`Enter new stock count for ${item.name}:`, item.stockQuantity.toString());
                            if (val !== null && !isNaN(Number(val))) {
                              setInventoryItemStock(item.id, Number(val));
                              playSparkSound();
                            }
                          }}
                          className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            updateInventoryStock(item.id, 1);
                            playSparkSound();
                          }}
                          className="w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center justify-center transition-all shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    {/* Safety Margin Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Threshold Margin ({item.minThreshold} {item.unit})</span>
                        <span className={isLow ? 'text-amber-400 font-bold' : 'text-slate-300'}>{fillPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCriticallyEmpty ? 'bg-red-500' : isLow ? 'bg-amber-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial & Weight Data */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 mb-3">
                      <div>
                        <span className="block text-[10px] text-slate-500">Unit Weight:</span>
                        <span className="text-slate-200 font-bold">{item.weightPerUnitKg} kg</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">Stock Weight:</span>
                        <span className="text-slate-200 font-bold">{(item.stockQuantity * item.weightPerUnitKg).toFixed(1)} kg</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">Rate / Unit:</span>
                        <span className="text-slate-200 font-bold">₹{item.costPerUnit}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">Stock Value:</span>
                        <span className="text-emerald-400 font-bold">₹{Math.round(item.stockQuantity * item.costPerUnit).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {item.supplierName && (
                      <div className="text-[10px] font-mono text-slate-400 truncate mb-1">
                        Supplier: <strong className="text-slate-200">{item.supplierName}</strong>
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Namaste! Need quotation/restock for *${item.name}* (${item.dimensionSummary}). ` +
                        `Current workshop stock: ${item.stockQuantity} ${item.unit}. ` +
                        `Please share price per unit and earliest delivery to Barmer.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp Order</span>
                    </a>

                    <button
                      onClick={() => {
                        if (confirm(`Remove "${item.name}" from workshop inventory?`)) {
                          deleteInventoryItem(item.id);
                        }
                      }}
                      title="Delete profile"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredInventory.length === 0 && (
            <div className="py-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-mono">
              <Boxes className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm">No steel profiles matched your filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setInventoryFilter('all');
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= ADD NEW STEEL PROFILE MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    Add Steel Profile to Inventory
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Log stock levels, location &amp; automatic low-supply alerts
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Profile Name / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MS Round Pipe 3.0 Inch Heavy Duty"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Profile Category</label>
                  <select
                    value={newItem.profile}
                    onChange={(e) => setNewItem({ ...newItem, profile: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="round_pipe">Round Pipe (Circular)</option>
                    <option value="square_pipe">Square Pipe (Box)</option>
                    <option value="sariya">Sariya (TMT Rebar)</option>
                    <option value="angle">Angle Iron (L-Shape)</option>
                    <option value="flat_bar">Flat Patti / Bar</option>
                    <option value="sheet">MS / GI Sheet</option>
                    <option value="rod">Welding Electrodes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Material Metal</label>
                  <select
                    value={newItem.materialType}
                    onChange={(e) => setNewItem({ ...newItem, materialType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="mild_steel">Mild Steel (MS)</option>
                    <option value="stainless_steel">Stainless Steel (SS-304)</option>
                    <option value="iron">Iron / Wrought Iron</option>
                    <option value="aluminium">Aluminium</option>
                    <option value="copper">Copper / Brass</option>
                    <option value="consumable">Consumable / Rod</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Dimension Summary &amp; Standard Length</label>
                <input
                  type="text"
                  placeholder="e.g. OD: 75mm × Thk: 3.0mm × 6.0m (20ft)"
                  value={newItem.dimensionSummary}
                  onChange={(e) => setNewItem({ ...newItem, dimensionSummary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Current Stock *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newItem.stockQuantity}
                    onChange={(e) => setNewItem({ ...newItem, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="pipes">pipes</option>
                    <option value="bars">bars</option>
                    <option value="sheets">sheets</option>
                    <option value="packets">packets</option>
                    <option value="kg">kg</option>
                    <option value="units">units</option>
                  </select>
                </div>

                <div>
                  <label className="block text-amber-400 mb-1">Min Alert Threshold *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItem.minThreshold}
                    onChange={(e) => setNewItem({ ...newItem, minThreshold: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Weight per Piece / Unit (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newItem.weightPerUnitKg}
                    onChange={(e) => setNewItem({ ...newItem, weightPerUnitKg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Cost per Unit (₹)</label>
                  <input
                    type="number"
                    value={newItem.costPerUnit}
                    onChange={(e) => setNewItem({ ...newItem, costPerUnit: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Rack / Bay Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Rack A-4 (Yard)"
                    value={newItem.rackLocation}
                    onChange={(e) => setNewItem({ ...newItem, rackLocation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jindal Steel Pipes Depot"
                    value={newItem.supplierName}
                    onChange={(e) => setNewItem({ ...newItem, supplierName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
                >
                  Save Profile to Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
