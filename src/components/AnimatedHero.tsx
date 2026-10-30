import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Briefcase,
  UserPlus,
  Users,
  Wrench,
  Building2,
  Network,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AnimatedHeroProps {
  onNavigate: (tab: string) => void;
  openAuthModal: () => void;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export const AnimatedHero: React.FC<AnimatedHeroProps> = ({
  onNavigate,
  openAuthModal
}) => {
  const { t, adminSettings, playSparkSound } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [activeMediaMode, setActiveMediaMode] = useState<'interactive' | 'video'>('interactive');

  // Interactive HTML5 Welding Arc & Sparks Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: SparkParticle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#FFD700', // Gold
      '#FF8C00', // Dark Orange
      '#FF4500', // Orange Red
      '#00BFFF', // Electric Arc Blue
      '#FFFFFF'  // Pure Hot Core
    ];

    const origin = {
      x: canvas.getBoundingClientRect().width / 2,
      y: canvas.getBoundingClientRect().height * 0.42
    };

    const spawnSparks = (count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.random() * Math.PI * 1.6) - (Math.PI * 0.8);
        const speed = Math.random() * 6 + 2;
        particles.push({
          x: origin.x + (Math.random() - 0.5) * 8,
          y: origin.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: Math.random() * 3 + 1,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.015,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    let tick = 0;
    const render = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      origin.x = w / 2;
      origin.y = h * 0.44;

      ctx.clearRect(0, 0, w, h);

      // Welding Arc Core Glow
      tick++;
      const flicker = Math.sin(tick * 0.4) * 0.2 + 0.8;
      const gradient = ctx.createRadialGradient(
        origin.x, origin.y, 2,
        origin.x, origin.y, 70 * flicker
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.2, 'rgba(56, 189, 248, 0.7)');
      gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, 70 * flicker, 0, Math.PI * 2);
      ctx.fill();

      // Emit sparks
      if (tick % 2 === 0) {
        spawnSparks(4);
      }

      // Update and draw sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // Gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Trail tail
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5);
        ctx.stroke();

        ctx.restore();
      }

      if (particles.length > 180) {
        particles.splice(0, particles.length - 180);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const modules = [
    {
      id: 'jobs',
      number: '1',
      title: 'Find Welding Jobs',
      desc: 'Browse high-paying fabrication, TIG, MIG & structural welding projects across India.',
      actionTab: 'jobs',
      icon: Briefcase,
      borderHover: 'hover:border-cyan-500/60'
    },
    {
      id: 'register',
      number: '2',
      title: 'Register as a Welder',
      desc: 'Create your digital shop profile, showcase previous work photos, and attract direct customer orders.',
      actionTab: 'welders',
      icon: UserPlus,
      borderHover: 'hover:border-amber-500/60'
    },
    {
      id: 'hire',
      number: '3',
      title: 'Hire Welding Workers',
      desc: 'Hire certified master welders, fitters, grinders, and helpers on daily or contract wage.',
      actionTab: 'jobs',
      icon: Users,
      borderHover: 'hover:border-blue-500/60'
    },
    {
      id: 'services',
      number: '4',
      title: 'Welding Services',
      desc: 'Explore custom gate fabrication, SS railings, balcony grills, doors, and industrial structures.',
      actionTab: 'welders',
      icon: Wrench,
      borderHover: 'hover:border-orange-500/60'
    },
    {
      id: 'directory',
      number: '5',
      title: 'Welding Business Directory',
      desc: 'Verified directory of welding workshops filtered by state, district, tehsil, and village.',
      actionTab: 'welders',
      icon: Building2,
      borderHover: 'hover:border-emerald-500/60'
    },
    {
      id: 'network',
      number: '6',
      title: 'Contractors Network',
      desc: 'Connect with turnkey fabrication contractors for large-scale sheds, factories & commercial buildings.',
      actionTab: 'welders',
      icon: Network,
      borderHover: 'hover:border-violet-500/60'
    },
    {
      id: 'community',
      number: '7',
      title: 'Welding Community',
      desc: 'Discuss electrode grades, machine settings, shielding gas flow, and daily steel mandi rates.',
      actionTab: 'jobs',
      icon: MessageSquare,
      borderHover: 'hover:border-yellow-500/60'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 pb-16">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Visual Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* Animated Introduction Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4 shadow-lg shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>ANIMATED HOMEPAGE AND INTRODUCTION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tight text-white uppercase leading-none max-w-4xl text-balance">
            WELCOME TO <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-200 bg-clip-text text-transparent drop-shadow">WELDBRO</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl font-sans text-balance">
            {t.taglineSub}
          </p>

          {/* Quick Stats Pill */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Fabricators</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Tape Diagram Generator</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              <span>3D Weight &amp; Cost Configurator</span>
            </span>
          </div>
        </div>

        {/* Central Welder Mascot & Video Experience Card */}
        <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden metallic-card border border-slate-800 shadow-2xl">
          {/* Top bar with media switch */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-400 text-[11px]">
                WELDBRO Mascot &amp; Interactive Spark Engine
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveMediaMode('interactive')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  activeMediaMode === 'interactive'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Interactive 3D Mascot
              </button>
              <button
                onClick={() => setActiveMediaMode('video')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  activeMediaMode === 'video'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>Original Video</span>
              </button>
            </div>
          </div>

          {/* Interactive Spark Canvas View */}
          {activeMediaMode === 'interactive' && (
            <div className="relative h-[340px] sm:h-[420px] w-full flex items-center justify-center bg-slate-950 overflow-hidden select-none">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              />

              {/* Welder Mascot Silhouette & Holographic Helmet */}
              <div className="relative z-0 flex flex-col items-center">
                {/* Metallic Welder Helmet Icon with Glowing Cyan Visor */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-2 group">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 p-1 shadow-2xl border border-slate-600">
                    <div className="w-full h-full rounded-[20px] bg-gradient-to-b from-slate-900 to-black flex flex-col items-center justify-center p-3">
                      {/* Helmet Top Brow Shield */}
                      <div className="w-16 h-3 bg-slate-700 rounded-t-md mb-2 shadow" />
                      {/* Cyan Glowing Auto-Darkening Visor */}
                      <div className="w-20 sm:w-24 h-8 rounded-lg bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.8)] border border-cyan-200 flex items-center justify-center">
                        <div className="w-12 h-1 bg-white/60 rounded-full" />
                      </div>
                      {/* Respirator Filter Grill */}
                      <div className="mt-2 flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600" />
                        <div className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600" />
                        <div className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Welder Holding Welding Electrode Stinger */}
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 text-xs font-mono shadow-lg">
                  <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                  <span>WELDING ELECTRODE 7018 ACTIVE</span>
                </div>
              </div>

              {/* Overlay CTA Action Buttons right on the Hero */}
              <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
                <button
                  onClick={() => {
                    playSparkSound();
                    onNavigate('jobs');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>FIND WELDING JOBS</span>
                </button>

                <button
                  onClick={() => {
                    playSparkSound();
                    onNavigate('welders');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>HIRE PROFESSIONAL WELDERS</span>
                </button>
              </div>
            </div>
          )}

          {/* Embedded User Video View */}
          {activeMediaMode === 'video' && (
            <div className="relative h-[420px] sm:h-[480px] w-full bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src="/public/assets/aistudio/Design_WELDBRO_homepage_59398bdb_a5097784.mp4"
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted
                playsInline
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (isVideoPlaying) {
                        videoRef.current.pause();
                      } else {
                        videoRef.current.play();
                      }
                      setIsVideoPlaying(!isVideoPlaying);
                    }
                  }}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isVideoPlaying ? 'Pause Video' : 'Play Video'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 7 Key Modules Section (Matching User Video and Instructions) */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Core Ecosystem Modules
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                EXPLORE WELDBRO MODULES
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 sm:mt-0 max-w-md">
              Everything needed to run, scale, and manage a professional fabrication business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    playSparkSound();
                    onNavigate(mod.actionTab);
                  }}
                  className={`cursor-pointer rounded-xl bg-slate-900/70 border border-slate-800 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:bg-slate-900 ${mod.borderHover} group`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-amber-400">
                      0{mod.number}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                    <span>{mod.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              );
            })}

            {/* Quick Access to Configurator Card */}
            <div
              onClick={() => {
                playSparkSound();
                onNavigate('configurator');
              }}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-sky-500/10 border border-amber-500/30 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-amber-400 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">PRO TOOL</span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>3D Material Configurator</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                Live 3D pipe &amp; rebar weight calculation with real-time thickness and quotes.
              </p>
            </div>
          </div>
        </div>

        {/* Official Community, Social Links & Business Owner Banner */}
        <div className="mt-12 rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Owner & Shop Credentials */}
            <div className="lg:col-span-1">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
                Official Head Office &amp; Operations
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                {adminSettings.ownerName}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {adminSettings.businessAddress}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={`tel:${adminSettings.ownerMobile}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{adminSettings.ownerMobile}</span>
                </a>
                <span className="text-xs text-slate-500 font-mono">
                  ID: WB-ADMIN-01
                </span>
              </div>
            </div>

            {/* Social & Community Links */}
            <div className="lg:col-span-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                Join WeldBro Community Channels
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <a
                  href={adminSettings.whatsappCommunityLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 hover:border-emerald-500 text-emerald-400 text-xs font-medium transition-all"
                >
                  <span>Join WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={adminSettings.telegramGroupLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-sky-950/30 border border-sky-800/40 hover:border-sky-500 text-sky-400 text-xs font-medium transition-all"
                >
                  <span>Join Telegram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={adminSettings.youtubeChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/30 border border-red-800/40 hover:border-red-500 text-red-400 text-xs font-medium transition-all"
                >
                  <span>YouTube Channel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://instagram.com/${adminSettings.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 hover:border-purple-500 text-purple-400 text-xs font-medium transition-all"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
