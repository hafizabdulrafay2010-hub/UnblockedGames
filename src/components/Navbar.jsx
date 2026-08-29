import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  Search, 
  Plus, 
  FileCode, 
  Eye, 
  ShieldAlert, 
  Sparkles, 
  X, 
  Heart, 
  BookOpen, 
  Folder,
  Crosshair,
  Target,
  Flame
} from 'lucide-react';

export const CLOAK_OPTIONS = [
  { id: 'default', name: 'Standard (Eliminater Range)', title: 'Eliminater Range', icon: '🎯' },
  { id: 'classroom', name: 'Google Classroom', title: 'Classes - Google Classroom', icon: '🏫' },
  { id: 'drive', name: 'Google Drive', title: 'My Drive - Google Drive', icon: '📁' },
  { id: 'docs', name: 'Google Docs', title: 'Untitled document - Google Docs', icon: '📄' },
  { id: 'calculator', name: 'Desmos Calculator', title: 'Desmos | Scientific Calculator', icon: '🧮' },
  { id: 'canvas', name: 'Canvas LMS', title: 'Dashboard | Canvas', icon: '📚' }
];

export const Navbar = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenJsonModal,
  onTriggerPanic,
  activeCloak,
  onChangeCloak,
  favoritesCount,
  totalGamesCount
}) => {
  const [showCloakDropdown, setShowCloakDropdown] = useState(false);
  const searchInputRef = useRef(null);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#FFFFFF1A] bg-black/90 backdrop-blur-md">
      {/* Top RGB Gaming Chroma Strip */}
      <div className="h-[2px] w-full rgb-bg" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo: Aim Crosshair + Gun Range RGB Gaming Battlestation */}
        <div className="flex items-center gap-3">
          {/* Aim Crosshair RGB Emblem */}
          <div className="relative flex h-11 w-11 items-center justify-center border-2 border-[#00f0ff] bg-[#0c0c0c] shadow-[0_0_20px_rgba(0,240,255,0.4),0_0_40px_rgba(255,0,128,0.2)] rgb-glow shrink-0 group cursor-pointer">
            {/* Animated RGB Chroma corner borders */}
            <div className="absolute -inset-[2px] rgb-bg opacity-40 blur-[2px] -z-10 group-hover:opacity-100 transition-opacity" />
            
            <Crosshair className="h-6 w-6 text-[#00f0ff] stroke-[2.5] transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
            
            {/* Red Laser Aim Target Dot */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ff0055] animate-ping" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ff0055] shadow-[0_0_8px_#ff0055]" />
            
            {/* Corner Tech Brackets */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-[#39ff14] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-[#ff0055] pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tighter uppercase sm:text-xl flex items-center gap-1.5">
                <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">ELIMINATER</span>
                <span className="rgb-text font-black tracking-tight drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]">RANGE</span>
              </span>
              <span className="hidden items-center gap-1 border border-[#00f0ff]/50 bg-[#00f0ff]/10 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)] sm:inline-flex">
                <Target className="h-3 w-3 text-[#ff0055] animate-pulse" />
                <span>RGB_ARMORY</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#AAAAAA] hidden sm:flex">
              <span className="rgb-text font-black">🎯 GUN & AIM TARGET</span>
              <span className="text-[#444444]">&bull;</span>
              <span className="text-[#00f0ff] font-bold">{totalGamesCount} Games Online</span>
            </div>
          </div>
        </div>

        {/* Search Input with RGB Focus Glow */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#00f0ff]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH ELIMINATER RANGE... (PRESS '/')"
            className="h-9 w-full border border-[#FFFFFF22] bg-[#0c0c0c] pl-9 pr-8 text-xs font-mono tracking-wide text-white placeholder-[#FFFFFF44] transition-all focus:border-[#00f0ff] focus:bg-black focus:outline-none focus:ring-1 focus:ring-[#00f0ff] focus:shadow-[0_0_15px_rgba(0,240,255,0.35)]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#FFFFFF66] hover:text-[#ff0055]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Active players telemetry with RGB pulse */}
          <div className="hidden xl:flex items-center gap-2 border border-[#39ff14]/40 px-3 py-1.5 bg-[#39ff14]/10 text-[10px] font-mono tracking-widest uppercase text-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.2)]">
            <span className="h-2 w-2 rounded-full bg-[#39ff14] animate-ping"></span>
            <span>1,402 IN BATTLE</span>
          </div>

          {/* Tab Cloaker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCloakDropdown(!showCloakDropdown)}
              title="Disguise browser tab (Cloaker)"
              className="flex h-9 items-center gap-1.5 border border-[#FFFFFF22] bg-[#111111] px-2.5 text-xs font-medium text-[#CCCCCC] transition-colors hover:border-[#00f0ff] hover:text-white hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
            >
              <Eye className="h-3.5 w-3.5 text-[#00f0ff]" />
              <span className="hidden md:inline uppercase text-[10px] tracking-wider font-bold">Cloak</span>
            </button>

            {showCloakDropdown && (
              <div className="absolute right-0 mt-2 w-56 border border-[#FFFFFF22] bg-[#0c0c0c] p-1.5 shadow-2xl z-50">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00f0ff]">
                  Tab Disguise
                </div>
                {CLOAK_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onChangeCloak(opt.id);
                      setShowCloakDropdown(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 text-left text-xs transition-colors ${
                      activeCloak === opt.id
                        ? 'bg-[#00f0ff] text-black font-bold'
                        : 'text-zinc-300 hover:bg-[#1a1a1a] hover:text-white'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span className="truncate text-xs font-mono">{opt.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Panic Key / Emergency Disguise */}
          <button
            onClick={onTriggerPanic}
            title="Panic key (Disguise screen immediately)"
            className="flex h-9 items-center gap-1.5 border border-red-500/40 bg-red-950/20 px-2.5 text-xs font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-900/40 hover:text-red-200"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
            <span className="hidden lg:inline text-[10px]">Panic [~]</span>
          </button>

          {/* JSON File Manager */}
          <button
            onClick={onOpenJsonModal}
            title="View & Edit games.json file"
            className="flex h-9 items-center gap-1.5 border border-[#FFFFFF22] bg-[#111111] px-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#00f0ff] hover:text-[#00f0ff]"
          >
            <FileCode className="h-3.5 w-3.5 text-[#00f0ff]" />
            <span className="hidden sm:inline text-[10px]">JSON Vault</span>
          </button>

          {/* Add Game */}
          <button
            onClick={onOpenAddModal}
            className="flex h-9 items-center gap-1.5 rgb-bg px-3.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
