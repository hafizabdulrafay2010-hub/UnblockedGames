import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Maximize2, 
  RotateCcw, 
  ExternalLink, 
  Heart, 
  Tv, 
  Keyboard, 
  Gamepad2
} from 'lucide-react';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  onSelectRelated,
  relatedGames = []
}) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const playerContainerRef = useRef(null);
  const iframeRef = useRef(null);

  // Focus iframe on mount so keyboard events work immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      iframeRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, [game?.id, reloadKey]);

  // Fullscreen trigger
  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.warn('Fullscreen request error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Cloaked About:Blank Popout
  const handleAboutBlankPopout = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Popups may be blocked. Please allow popups to open cloaked game tab.');
      return;
    }
    win.document.title = (game?.title || 'Game') + ' - Classroom';
    
    // Inject iframe into about:blank
    const iframe = win.document.createElement('iframe');
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.overflow = 'hidden';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'fullscreen; autoplay; gamepad');

    if (game?.embedHtml) {
      iframe.srcdoc = game.embedHtml;
    } else if (game?.iframeUrl) {
      iframe.src = game.iframeUrl;
    }

    win.document.body.style.margin = '0';
    win.document.body.style.overflow = 'hidden';
    win.document.body.style.backgroundColor = '#000';
    win.document.body.appendChild(iframe);
  };

  // Reload iframe
  const handleReload = () => {
    setReloadKey(k => k + 1);
  };

  // Share Game
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!game) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Top Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 border border-[#00f0ff]/40 bg-[#111111] px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white transition-all hover:border-[#00f0ff] hover:text-[#00f0ff] hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
        >
          <ArrowLeft className="h-4 w-4 text-[#00f0ff]" />
          <span>&lt; Return to Eliminater Range</span>
        </button>

        {/* Action Toolbars */}
        <div className="flex items-center gap-2">
          {/* Reload Game */}
          <button
            onClick={handleReload}
            title="Restart / Reload Game"
            className="flex h-9 w-9 items-center justify-center border border-[#FFFFFF22] bg-[#111111] text-[#AAAAAA] transition-colors hover:border-[#00f0ff] hover:text-[#00f0ff]"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Theater Mode */}
          <button
            onClick={() => setIsTheater(!isTheater)}
            title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
            className={`flex h-9 items-center gap-1.5 border px-3 text-xs font-mono uppercase tracking-wider transition-colors ${
              isTheater
                ? 'border-[#00f0ff] bg-[#00f0ff] text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'border-[#FFFFFF22] bg-[#111111] text-[#CCCCCC] hover:border-[#00f0ff] hover:text-[#00f0ff]'
            }`}
          >
            <Tv className="h-4 w-4" />
            <span className="hidden sm:inline">{isTheater ? 'Compact' : 'Theater'}</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            title="Fullscreen Mode"
            className="flex h-9 items-center gap-1.5 border border-[#FFFFFF22] bg-[#111111] px-3 text-xs font-mono uppercase tracking-wider text-[#CCCCCC] transition-colors hover:border-[#00f0ff] hover:text-[#00f0ff]"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>

          {/* Open in Cloaked Tab */}
          <button
            onClick={handleAboutBlankPopout}
            title="Open in about:blank cloaked tab (bypasses history)"
            className="flex h-9 items-center gap-1.5 border border-[#00f0ff]/50 bg-[#00f0ff]/10 px-3 text-xs font-mono font-bold uppercase tracking-wider text-[#00f0ff] transition-all hover:bg-[#00f0ff] hover:text-black shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cloak Popout</span>
          </button>

          {/* Favorite */}
          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`flex h-9 w-9 items-center justify-center border transition-all ${
              isFavorite
                ? 'border-[#ff0055] bg-[#ff0055] text-white font-bold shadow-[0_0_15px_rgba(255,0,85,0.5)]'
                : 'border-[#FFFFFF22] bg-[#111111] text-[#AAAAAA] hover:border-[#00f0ff] hover:text-[#00f0ff]'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Iframe Player Stage with Ambient RGB LED Backlighting */}
      <div className="relative group">
        {/* RGB Ambient Halo Glow */}
        <div className="absolute -inset-1 rgb-bg opacity-30 blur-lg rounded-none -z-10 group-hover:opacity-60 transition-opacity duration-500" />

        <div
          ref={playerContainerRef}
          className={`relative overflow-hidden border border-[#00f0ff]/50 bg-black shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all ${
            isTheater ? 'w-full aspect-[16/9] min-h-[640px]' : 'w-full aspect-[16/10] max-h-[720px]'
          }`}
        >
          {/* Corner Cyberpunk Brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff] z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff0055] z-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#39ff14] z-20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#b829ff] z-20 pointer-events-none" />

          <iframe
            ref={iframeRef}
            key={reloadKey}
            srcDoc={game.embedHtml}
            src={!game.embedHtml ? game.iframeUrl : undefined}
            title={game.title}
            allow="fullscreen; autoplay; gamepad"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
            className="h-full w-full border-0 bg-black"
          />
        </div>
      </div>

      {/* Game Details & Controls Breakdown */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Info & Controls */}
        <div className="space-y-6 lg:col-span-2">
          <div className="border border-[#FFFFFF1A] bg-[#0c0c0c] p-6 relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white sm:text-4xl">
                    {game.title}
                  </h1>
                  <span className="border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-2.5 py-0.5 text-xs font-mono font-bold uppercase text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                    {game.category}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#AAAAAA]">
                  {game.description}
                </p>
              </div>
            </div>

            {/* Controls Box */}
            <div className="mt-5 border border-[#00f0ff]/30 bg-[#00f0ff]/5 p-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#00f0ff]">
                <Keyboard className="h-4 w-4" />
                <span>Control Protocol & Keybindings</span>
              </div>
              <p className="mt-2 text-sm font-mono text-white">
                {game.controls}
              </p>
            </div>

            {/* Tags & Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#888888]">Metadata Tags:</span>
              {game.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="border border-[#FFFFFF15] bg-black px-2 py-0.5 text-xs font-mono text-[#CCCCCC]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Suggested Games */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] rgb-text">
            Trending In Armory
          </h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {relatedGames.slice(0, 4).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectRelated(rel)}
                className="group flex items-center gap-3 border border-[#FFFFFF1A] bg-[#0c0c0c] p-3 transition-all hover:border-[#00f0ff] hover:bg-[#141414] cursor-pointer rgb-hover-card"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center bg-gradient-to-br ${rel.gradient || 'from-indigo-600 to-purple-900'} text-white border border-[#FFFFFF22]`}>
                  <Gamepad2 className="h-5 w-5 text-[#00f0ff]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold uppercase text-white group-hover:text-[#00f0ff] transition-colors truncate">
                    {rel.title}
                  </h3>
                  <p className="text-[10px] font-mono uppercase text-[#777777] truncate">
                    {rel.category} &bull; {rel.tags?.[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
