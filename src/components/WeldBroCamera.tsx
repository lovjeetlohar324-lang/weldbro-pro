import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  Download,
  Share2,
  RefreshCw,
  Sliders,
  CheckCircle,
  Flame,
  Shield,
  Upload,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WeldBroCamera: React.FC = () => {
  const { currentUser, playSparkSound } = useApp();

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>('/public/assets/aistudio/IMG-20261030-WA3750_a2b6a8aa.jpg');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [watermarkPos, setWatermarkPos] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'center'>('bottom-right');
  const [projectName, setProjectName] = useState('SS Balcony Railing Installation');
  const [workerName, setWorkerName] = useState('Kailash Suthar');
  const [opacity, setOpacity] = useState(0.9);
  const [watermarkApplied, setWatermarkApplied] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      playSparkSound();
    } catch {
      // Fallback if camera permission is denied or device has no camera
      alert('Camera access not available. You can also upload any image directly from your gallery!');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture photo from live video feed
  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
    stopCamera();
    playSparkSound();
  };

  // Render watermark on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !capturedImage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = capturedImage;

    img.onload = () => {
      canvas.width = img.width || 1280;
      canvas.height = img.height || 720;

      // Draw base photo
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Render official watermark box
      ctx.save();
      ctx.globalAlpha = opacity;

      const pad = 24;
      const boxWidth = Math.min(canvas.width * 0.55, 460);
      const boxHeight = 110;
      let bx = canvas.width - boxWidth - pad;
      let by = canvas.height - boxHeight - pad;

      if (watermarkPos === 'bottom-left') {
        bx = pad;
        by = canvas.height - boxHeight - pad;
      } else if (watermarkPos === 'top-right') {
        bx = canvas.width - boxWidth - pad;
        by = pad;
      } else if (watermarkPos === 'center') {
        bx = (canvas.width - boxWidth) / 2;
        by = (canvas.height - boxHeight) / 2;
      }

      // Metallic badge background with chamfered look
      const grad = ctx.createLinearGradient(bx, by, bx + boxWidth, by + boxHeight);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.92)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.96)');

      ctx.fillStyle = grad;
      ctx.fillRect(bx, by, boxWidth, boxHeight);

      // Border with orange accent
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(bx, by, boxWidth, boxHeight);

      // Top Header inside watermark
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px "Barlow Condensed", sans-serif';
      ctx.fillText('WELDBRO CERTIFIED WORKMANSHIP', bx + 16, by + 26);

      // Welder Name & ID
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FBBF24';
      ctx.fillText(
        `FABRICATOR: ${currentUser.name.toUpperCase()} (ID: ${currentUser.id.toUpperCase()})`,
        bx + 16,
        by + 48
      );

      // Shop Name
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText(
        `SHOP: ${currentUser.shopName || 'SOLANKI SMART WELDING HUB'}`,
        bx + 16,
        by + 68
      );

      // Project & Timestamp
      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(
        `PROJ: ${projectName.toUpperCase()} · BY: ${workerName}`,
        bx + 16,
        by + 86
      );

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`GEO-TIMESTAMP: ${dateStr} ${timeStr} · VERIFIED`, bx + 16, by + 102);

      ctx.restore();
      setWatermarkApplied(true);
    };
  }, [capturedImage, watermarkPos, projectName, workerName, opacity, currentUser]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playSparkSound();
    const link = document.createElement('a');
    link.download = `WeldBro-Watermarked-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleShareWhatsApp = () => {
    playSparkSound();
    const message = `*WELDBRO CERTIFIED FABRICATION PHOTOGRAPH*\nProject: ${projectName}\nFabricated by: ${currentUser.name}\nShop: ${currentUser.shopName || 'Solanki Smart Welding'}\nWorker: ${workerName}\nDate: ${new Date().toLocaleDateString()}\n\nWatermark protected by WeldBro.in`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
          playSparkSound();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
          <Camera className="w-4 h-4 text-amber-400" />
          <span>TAMPER-PROOF BRANDING ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide mt-1">
          SMART WELDBRO CAMERA &amp; WATERMARK
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Capture site progress or finished gates with official digital branding: Welder ID, Shop Name, Worker Name, Date &amp; Time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Camera & Canvas View */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>OFFICIAL WATERMARKED OUTPUT</span>
            </span>
            <span className="text-slate-400">
              {watermarkApplied ? 'Watermark Applied' : 'Rendering...'}
            </span>
          </div>

          {/* Live Video Camera or Canvas Output */}
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            )}

            {/* Live Camera Shutter Overlay */}
            {cameraActive && (
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 z-20">
                <button
                  onClick={captureFrame}
                  className="w-16 h-16 rounded-full bg-white border-4 border-amber-500 shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500" />
                </button>
                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/80 text-xs text-white border border-slate-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Camera Trigger Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Device Camera</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
                    startCamera();
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Flip Lens</span>
                </button>
              )}

              <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 cursor-pointer flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download Watermarked</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Share2 className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Watermark Metadata Customizer */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>WATERMARK SETTINGS</span>
            </h3>
            <span className="text-xs font-mono text-amber-400">OFFICIAL STAMP</span>
          </div>

          {/* Project Title */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Project / Job Title
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Assigned Worker */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Fabricator / Worker Name
            </label>
            <input
              type="text"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Watermark Position */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Watermark Position on Photo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bottom-right', label: 'Bottom Right' },
                { id: 'bottom-left', label: 'Bottom Left' },
                { id: 'top-right', label: 'Top Right' },
                { id: 'center', label: 'Center Banner' }
              ].map(pos => (
                <button
                  key={pos.id}
                  onClick={() => {
                    setWatermarkPos(pos.id as typeof watermarkPos);
                    playSparkSound();
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-colors ${
                    watermarkPos === pos.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>Stamp Opacity</span>
              <span className="text-white font-bold">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Locked Welder Credentials preview */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
            <p className="text-slate-400 text-[10px] uppercase">Branded Identity Credentials:</p>
            <p className="text-amber-400 font-bold">{currentUser.name}</p>
            <p className="text-slate-300">{currentUser.shopName || 'Solanki Smart Welding'}</p>
            <p className="text-slate-500 text-[11px]">Welder ID: {currentUser.id.toUpperCase()}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
