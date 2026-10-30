import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-mono font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-orange-400 transition active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5 stroke-[3]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-mono font-bold text-cyan-300 hover:bg-cyan-500/20 transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Install WeldBro on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ol className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Tap the <strong>Share</strong> icon (box with arrow pointing up) in Safari bottom toolbar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Scroll down and select <strong>"Add to Home Screen"</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Tap <strong>Add</strong> in the top right corner. WeldBro will now launch like a native app with offline support.</span>
                </li>
              </ol>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-cyan-500 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Always show a quick install / PWA shortcut button for instant accessibility
  return (
    <button
      onClick={() => {
        if ('standalone' in window.navigator && !(window.navigator as any).standalone) {
          setShowIOSGuide(true);
        } else {
          alert('To install WeldBro:\n• On Chrome / Android: Tap the 3 dots menu -> "Install app" or "Add to Home screen"\n• On iPhone: Tap Share -> "Add to Home Screen"');
        }
      }}
      className={`flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition ${className}`}
      title="Install WeldBro PWA on device"
    >
      <Download className="w-3.5 h-3.5 text-amber-400" />
      <span>Install PWA</span>
    </button>
  );
};
