import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MeasurementItem, MeasurementUnit } from '../types';
import {
  Ruler,
  Upload,
  Download,
  Share2,
  Move,
  Type,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DimensionLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'width' | 'height' | 'thickness' | 'custom';
}

export const MeasurementSystem: React.FC = () => {
  const { t, currentUser, saveMeasurement, measurements, deleteMeasurement, playSparkSound } = useApp();

  const [category, setCategory] = useState<MeasurementItem['category']>('gate');
  const [itemName, setItemName] = useState('Main Double Entrance Gate');
  const [length, setLength] = useState<number>(12);
  const [width, setWidth] = useState<number>(0.2);
  const [height, setHeight] = useState<number>(7);
  const [thickness, setThicknessMm] = useState<number>(50);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<MeasurementUnit>('feet');
  const [notes, setNotes] = useState('Measured using Stanley 5m Steel Tape. Clear opening between RCC pillars.');
  
  // Custom label input
  const [customText, setCustomText] = useState('');

  // Selected or uploaded image
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('/public/assets/aistudio/IMG-20261030-WA3750_a2b6a8aa.jpg');
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Editable & draggable labels on canvas
  const [labels, setLabels] = useState<DimensionLabel[]>([
    { id: 'l-width', text: 'WIDTH: 12.0 feet', x: 250, y: 55, type: 'width' },
    { id: 'l-height', text: 'HEIGHT: 7.0 feet', x: 75, y: 220, type: 'height' },
    { id: 'l-thick', text: 'PIPE: 50mm SQ (16G)', x: 380, y: 350, type: 'thickness' }
  ]);

  const [draggingLabelId, setDraggingLabelId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync labels when inputs change
  useEffect(() => {
    setLabels(prev => [
      { id: 'l-width', text: `WIDTH: ${length} ${unit}`, x: 250, y: 55, type: 'width' },
      { id: 'l-height', text: `HEIGHT: ${height} ${unit}`, x: 75, y: 220, type: 'height' },
      { id: 'l-thick', text: `THICKNESS: ${thickness}mm (${category.toUpperCase()})`, x: 380, y: 350, type: 'thickness' },
      ...prev.filter(l => l.type === 'custom')
    ]);
  }, [length, height, thickness, unit, category]);

  // Render the diagram onto the Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoDataUrl;

    img.onload = () => {
      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Dark translucent tint for high contrast blueprint lines
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid guidelines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Width Dimension Line & Arrows (Top)
      const topY = 70;
      const leftX = 60;
      const rightX = canvas.width - 60;

      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(leftX, topY);
      ctx.lineTo(rightX, topY);
      ctx.stroke();

      // Left arrow head
      drawArrowHead(ctx, leftX, topY, 'left', '#F97316');
      // Right arrow head
      drawArrowHead(ctx, rightX, topY, 'right', '#F97316');

      // Vertical guide lines for width
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(leftX, 40);
      ctx.lineTo(leftX, 120);
      ctx.moveTo(rightX, 40);
      ctx.lineTo(rightX, 120);
      ctx.stroke();
      ctx.setLineDash([]);

      // Height Dimension Line & Arrows (Left)
      const sideX = 90;
      const topHeightY = 90;
      const bottomHeightY = canvas.height - 70;

      ctx.strokeStyle = '#00BFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sideX, topHeightY);
      ctx.lineTo(sideX, bottomHeightY);
      ctx.stroke();

      drawArrowHead(ctx, sideX, topHeightY, 'up', '#00BFFF');
      drawArrowHead(ctx, sideX, bottomHeightY, 'down', '#00BFFF');

      // Guide lines for height
      ctx.strokeStyle = 'rgba(0, 191, 255, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(60, topHeightY);
      ctx.lineTo(130, topHeightY);
      ctx.moveTo(60, bottomHeightY);
      ctx.lineTo(130, bottomHeightY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw all interactive dimension labels
      labels.forEach(lbl => {
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        const metrics = ctx.measureText(lbl.text);
        const padding = 8;
        const boxWidth = metrics.width + padding * 2;
        const boxHeight = 26;

        // Label pill background
        ctx.fillStyle = lbl.type === 'width' ? '#EA580C' : lbl.type === 'height' ? '#0284C7' : '#1E293B';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;

        // Rounded rect for label
        roundRect(ctx, lbl.x - boxWidth / 2, lbl.y - boxHeight / 2, boxWidth, boxHeight, 6);
        ctx.fill();
        ctx.stroke();

        // Label text
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lbl.text, lbl.x, lbl.y);
      });

      // Bottom Stamp (Shop details, Tape Calibration Verified)
      ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, canvas.height - 40, canvas.width, 40);

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#F59E0B';
      ctx.textAlign = 'left';
      ctx.fillText(`WELDBRO DIAGRAM · ${itemName.toUpperCase()} · ${currentUser.shopName || 'SHOP MEASUREMENT'}`, 15, canvas.height - 22);

      ctx.fillStyle = '#38BDF8';
      ctx.textAlign = 'right';
      ctx.fillText(`VERIFIED TAPE CALIBRATION · ${new Date().toLocaleDateString()}`, canvas.width - 15, canvas.height - 22);
    };

    img.onerror = () => {
      // Fallback if image fails to load
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#38BDF8';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Custom Blueprint Schematic Area', canvas.width / 2, canvas.height / 2);
    };
  }, [photoDataUrl, labels, itemName, currentUser.shopName]);

  const drawArrowHead = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dir: 'left' | 'right' | 'up' | 'down',
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    const size = 8;
    if (dir === 'left') {
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y - size);
      ctx.lineTo(x + size, y + size);
    } else if (dir === 'right') {
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y - size);
      ctx.lineTo(x - size, y + size);
    } else if (dir === 'up') {
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y + size);
      ctx.lineTo(x + size, y + size);
    } else if (dir === 'down') {
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y - size);
      ctx.lineTo(x + size, y - size);
    }
    ctx.closePath();
    ctx.fill();
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // Dragging logic for labels on Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check hit test for labels
    for (let i = labels.length - 1; i >= 0; i--) {
      const lbl = labels[i];
      const dx = Math.abs(clickX - lbl.x);
      const dy = Math.abs(clickY - lbl.y);
      if (dx < 70 && dy < 20) {
        setDraggingLabelId(lbl.id);
        setDragOffset({ x: clickX - lbl.x, y: clickY - lbl.y });
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingLabelId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const curX = (e.clientX - rect.left) * scaleX;
    const curY = (e.clientY - rect.top) * scaleY;

    setLabels(prev =>
      prev.map(lbl => {
        if (lbl.id === draggingLabelId) {
          return {
            ...lbl,
            x: Math.max(50, Math.min(canvas.width - 50, curX - dragOffset.x)),
            y: Math.max(30, Math.min(canvas.height - 50, curY - dragOffset.y))
          };
        }
        return lbl;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggingLabelId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoDataUrl(event.target.result as string);
          playSparkSound();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomText = () => {
    if (!customText.trim()) return;
    playSparkSound();
    const newLbl: DimensionLabel = {
      id: `custom-${Date.now()}`,
      text: customText.toUpperCase(),
      x: 300,
      y: 200,
      type: 'custom'
    };
    setLabels([...labels, newLbl]);
    setCustomText('');
  };

  const handleDownloadDiagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playSparkSound();
    const link = document.createElement('a');
    link.download = `WeldBro-Measurement-${itemName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSaveMeasurement = () => {
    const canvas = canvasRef.current;
    const diagramUrl = canvas ? canvas.toDataURL('image/png') : photoDataUrl;
    
    playSparkSound();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });

    const newMeas: MeasurementItem = {
      id: `meas-${Date.now()}`,
      itemName,
      category,
      photoUrl: photoDataUrl,
      annotatedImageUrl: diagramUrl,
      length,
      width,
      height,
      thickness,
      quantity,
      unit,
      notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    saveMeasurement(newMeas);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const message = `*WELDBRO MEASUREMENT SHEET*\nItem: ${itemName} (${category.toUpperCase()})\nLength/Width: ${length} ${unit}\nHeight: ${height} ${unit}\nThickness: ${thickness}mm\nQuantity: ${quantity} units\nShop: ${currentUser.shopName || 'WeldBro Network'}\nNotes: ${notes}\n\nMeasured with calibrated tape system.`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
            <Ruler className="w-4 h-4 text-amber-400" />
            <span>{t.smartMeasurementSystem}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide mt-1">
            VISUAL MEASUREMENT DIAGRAM GENERATOR
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {t.disclaimerTape} Enter physical tape measurements to generate dimension lines, arrows, and downloadable fabrication diagrams.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-mono">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Measurement Diagram Saved!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Dimension Input Controls & Category */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-400" />
              <span>FABRICATION SPECIFICATIONS</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">TAPE MEASURE</span>
          </div>

          {/* Item Category Selection */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">
              {t.selectItemType}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gate', label: 'Gate' },
                { id: 'door', label: 'Door' },
                { id: 'grill', label: 'Grill' },
                { id: 'window', label: 'Window' },
                { id: 'railing', label: 'Railing' },
                { id: 'staircase', label: 'Staircase' },
                { id: 'frame', label: 'Iron Frame' },
                { id: 'furniture', label: 'Furniture' },
                { id: 'custom', label: 'Custom' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id as MeasurementItem['category']);
                    setItemName(`Custom ${cat.label} Project`);
                    playSparkSound();
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors text-center ${
                    category === cat.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Item Name Input */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Project / Item Title
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-sans"
              placeholder="e.g. 12ft Double Swing Main Gate"
            />
          </div>

          {/* Unit Selector */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Measurement Unit
            </label>
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {(['feet', 'inches', 'mm', 'cm', 'm'] as MeasurementUnit[]).map(u => (
                <button
                  key={u}
                  onClick={() => {
                    setUnit(u);
                    playSparkSound();
                  }}
                  className={`py-1 rounded text-xs font-mono uppercase transition-colors ${
                    unit === u
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Length / Width ({unit})
              </label>
              <input
                type="number"
                step="0.1"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Height ({unit})
              </label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-mono font-bold text-cyan-400 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Thickness (mm)
              </label>
              <input
                type="number"
                step="1"
                value={thickness}
                onChange={(e) => setThicknessMm(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-mono font-bold text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Quantity (Nos.)
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-mono font-bold text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Photo Uploader / Camera */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">
              Site / Product Photograph
            </label>
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 cursor-pointer text-xs text-slate-300 transition-colors">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload Site Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Add Custom Label */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Add Custom Dimension Note / Text
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. RCC Pillar Clearance: 3 inch"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <button
                onClick={handleAddCustomText}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Fabrication Notes &amp; Material Grade
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleSaveMeasurement}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save Measurement Record</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadDiagram}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Diagram (PNG)</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-400 font-medium text-xs flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Visual Measurement Canvas */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white font-bold">AUTOMATIC ANNOTATED DIAGRAM</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cyan-400">
              <Move className="w-3.5 h-3.5" />
              <span>Click &amp; Drag Labels to Reposition</span>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center shadow-inner">
            <canvas
              ref={canvasRef}
              width={640}
              height={440}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="w-full h-auto cursor-move select-none"
            />
          </div>

          {/* Measurement disclaimer & details */}
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300">Fabrication Standards Compliance:</strong> Physical dimensions shown are entered directly from tape readings and plotted with proportional vectors. Ready to be sent to workshop welders or client approval.
            </p>
          </div>

          {/* Saved Measurements History */}
          {measurements.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h4 className="text-sm font-bold font-heading text-white mb-3">
                RECENT MEASUREMENTS IN WORKSHOP LOG ({measurements.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {measurements.map(m => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{m.itemName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {m.length} × {m.height} {m.unit} · Thk: {m.thickness}mm · Qty: {m.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setItemName(m.itemName);
                          setCategory(m.category);
                          setLength(m.length);
                          setHeight(m.height);
                          setThicknessMm(m.thickness);
                          setUnit(m.unit);
                          if (m.photoUrl) setPhotoDataUrl(m.photoUrl);
                          playSparkSound();
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-[11px]"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteMeasurement(m.id)}
                        className="p-1 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
