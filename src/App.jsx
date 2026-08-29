/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_GAMES } from './data/defaultGames';
import { Navbar, CLOAK_OPTIONS } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar.jsx';
import { MostPlayedSection } from './components/MostPlayedSection';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { JsonModal } from './components/JsonModal';
import { PanicScreen } from './components/PanicScreen';
import { 
  Flame, 
  Search, 
  Play,
  Heart
} from 'lucide-react';

const STORAGE_GAMES_KEY = 'unblocked_games_list_v1';
const STORAGE_FAVS_KEY = 'unblocked_games_favs_v1';
const STORAGE_RECENT_KEY = 'unblocked_games_recent_v1';

export default function App() {
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem(STORAGE_GAMES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved games:', e);
      }
    }
    return DEFAULT_GAMES;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(STORAGE_FAVS_KEY);
    return saved ? JSON.parse(saved) : ['snake-classic', 'game-2048', 'flappy-bird'];
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    const saved = localStorage.getItem(STORAGE_RECENT_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const [activeCloak, setActiveCloak] = useState('default');
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Save games to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(games));
  }, [games]);

  // Save favorites to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_FAVS_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Save recent to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Tab Cloaking logic
  useEffect(() => {
    const cloak = CLOAK_OPTIONS.find(c => c.id === activeCloak);
    if (cloak) {
      document.title = cloak.title;
      // Change favicon if needed
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      if (activeCloak === 'classroom') {
        link.href = 'https://ssl.gstatic.com/classroom/favicon.png';
      } else if (activeCloak === 'drive') {
        link.href = 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png';
      } else if (activeCloak === 'docs') {
        link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
      } else {
        link.href = '/favicon.ico';
      }
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [activeCloak]);

  // Keyboard shortcut `~` or `Escape` for Panic disguise
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`' || e.key === '~') {
        setIsPanicActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle favorite
  const handleToggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Launch Game
  const handleSelectGame = (game) => {
    setSelectedGame(game);
    // Update play count & recents
    setRecentlyPlayed(prev => [game.id, ...prev.filter(id => id !== game.id)].slice(0, 10));
    setGames(prev => prev.map(g => g.id === game.id ? { ...g, playsCount: (g.playsCount || 0) + 1 } : g));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add custom game
  const handleAddGame = (newGame) => {
    setGames(prev => [newGame, ...prev]);
    setSelectedGame(newGame);
  };

  // Delete custom game
  const handleDeleteCustomGame = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this custom game?')) {
      setGames(prev => prev.filter(g => g.id !== id));
      if (selectedGame?.id === id) setSelectedGame(null);
    }
  };

  // Import JSON list
  const handleImportJson = (newGames) => {
    setGames(newGames);
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    setGames(DEFAULT_GAMES);
    localStorage.removeItem(STORAGE_GAMES_KEY);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { total: games.length };
    games.forEach(g => {
      counts[g.category] = (counts[g.category] || 0) + 1;
      if (g.isCustom) counts['Custom'] = (counts['Custom'] || 0) + 1;
    });
    return counts;
  }, [games]);

  // Filtered and Sorted Games
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Search query filtering based on title (with tag and category fallback)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(g => 
        g.title.toLowerCase().includes(q) ||
        (g.tags && g.tags.some(t => t.toLowerCase().includes(q))) ||
        (g.category && g.category.toLowerCase().includes(q)) ||
        (g.description && g.description.toLowerCase().includes(q))
      );
      // Prioritize exact title matches first
      result.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q);
        const bTitle = b.title.toLowerCase().includes(q);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return 0;
      });
    }

    // Category filter
    if (selectedCategory === 'Favorites') {
      result = result.filter(g => favorites.includes(g.id));
    } else if (selectedCategory === 'Custom') {
      result = result.filter(g => g.isCustom);
    } else if (selectedCategory !== 'All') {
      result = result.filter(g => g.category === selectedCategory);
    }

    // Sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0));
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'recent') {
      // Prioritize recently played
      result.sort((a, b) => {
        const idxA = recentlyPlayed.indexOf(a.id);
        const idxB = recentlyPlayed.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });
    }

    return result;
  }, [games, searchQuery, selectedCategory, sortBy, favorites, recentlyPlayed]);

  // Featured game for top hero spotlight
  const featuredGame = useMemo(() => {
    return games.find(g => g.id === 'flappy-bird') || games[0];
  }, [games]);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col selection:bg-[#CBFB45] selection:text-black">
      {/* Panic Stealth Screen */}
      {isPanicActive && (
        <PanicScreen onDismiss={() => setIsPanicActive(false)} />
      )}

      {/* Main Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onTriggerPanic={() => setIsPanicActive(true)}
        activeCloak={activeCloak}
        onChangeCloak={setActiveCloak}
        favoritesCount={favorites.length}
        totalGamesCount={games.length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {selectedGame ? (
          /* Single Game Player Mode */
          <GamePlayer
            game={selectedGame}
            onBack={() => setSelectedGame(null)}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={handleToggleFavorite}
            onSelectRelated={handleSelectGame}
            relatedGames={games.filter(g => g.id !== selectedGame.id)}
          />
        ) : (
          /* Game Library / Catalog View */
          <div>
            {/* Category Filter & Sort Bar */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              favoritesCount={favorites.length}
              categoryCounts={categoryCounts}
            />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
              {/* Top Spotlight Banner (Shown when no search query and on 'All' category) */}
              {!searchQuery && selectedCategory === 'All' && featuredGame && (
                <div className="mb-8 relative overflow-hidden border border-[#00f0ff]/40 bg-[#0a0a0a] p-6 sm:p-8 shadow-[0_0_35px_rgba(0,240,255,0.15)] group">
                  {/* RGB Chroma ambient aura */}
                  <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ff0055] rounded-full blur-[150px] opacity-20 pointer-events-none" />
                  <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#00f0ff] rounded-full blur-[150px] opacity-20 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-48 h-48 border-r-2 border-t-2 border-[#00f0ff]/50 opacity-60 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 border-l-2 border-b-2 border-[#ff0055]/50 opacity-60 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-arcade-grid opacity-30 pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 border border-[#00f0ff] bg-[#00f0ff]/10 px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                          <Flame className="h-3.5 w-3.5 text-[#ff0055] animate-pulse" />
                          Armory Featured Pick
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f0ff]">
                          {featuredGame.playsCount?.toLocaleString()} Active Battles
                        </span>
                      </div>

                      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase text-white leading-[0.9] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        {featuredGame.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed max-w-xl">
                        {featuredGame.description}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleSelectGame(featuredGame)}
                          className="flex items-center gap-2 rgb-bg px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(0,240,255,0.5),0_0_40px_rgba(255,0,85,0.3)]"
                        >
                          <Play className="h-4 w-4 fill-current" />
                          <span>Enter Battle Range</span>
                        </button>
                        <button
                          onClick={(e) => handleToggleFavorite(featuredGame.id, e)}
                          className={`flex items-center gap-1.5 border px-4 py-3 text-xs font-mono uppercase tracking-wider transition-colors ${
                            favorites.includes(featuredGame.id)
                              ? 'border-[#ff0055] bg-[#ff0055] text-white font-bold shadow-[0_0_12px_rgba(255,0,85,0.4)]'
                              : 'border-[#FFFFFF22] bg-black text-[#CCCCCC] hover:border-[#00f0ff] hover:text-[#00f0ff]'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(featuredGame.id) ? 'fill-current' : ''}`} />
                          <span>Bookmark</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats Grid with RGB accents */}
                    <div className="hidden lg:grid grid-cols-2 gap-3 shrink-0">
                      <div className="p-4 border border-[#00f0ff]/30 bg-[#00f0ff]/5 min-w-[150px] shadow-[0_0_12px_rgba(0,240,255,0.1)]">
                        <div className="text-[9px] font-mono uppercase tracking-widest opacity-60 mb-1 text-white">Architecture</div>
                        <div className="text-xs font-mono font-bold text-[#00f0ff]">RGB Frame Range</div>
                        <div className="text-[9px] text-[#888888] mt-1 font-mono">100% Client-Side</div>
                      </div>
                      <div className="p-4 border border-[#39ff14]/30 bg-[#39ff14]/5 min-w-[150px] shadow-[0_0_12px_rgba(57,255,20,0.1)]">
                        <div className="text-[9px] font-mono uppercase tracking-widest opacity-60 mb-1 text-white">Status</div>
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#39ff14] animate-ping" />
                          <span className="text-[#39ff14]">UNBLOCKED</span>
                        </div>
                        <div className="text-[9px] text-[#888888] mt-1 font-mono">Bypasses Filters</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Most Played Games Section (Leaderboard) */}
              {!searchQuery && selectedCategory === 'All' && (
                <MostPlayedSection
                  games={games}
                  onSelectGame={handleSelectGame}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                  topCount={5}
                />
              )}

              {/* Section Title Header */}
              <div className="mb-4 flex items-center justify-between border-b border-[#FFFFFF1A] pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2.5">
                    <span>
                      {selectedCategory === 'All' 
                        ? (searchQuery ? `SEARCH ARCHIVE: "${searchQuery}"` : 'ARMORY ROSTER') 
                        : `${selectedCategory.toUpperCase()} ARCHIVE`}
                    </span>
                    <span className="border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-2 py-0.5 text-[10px] font-mono text-[#00f0ff]">
                      {filteredGames.length}
                    </span>
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-[#888888] mt-0.5 font-mono">
                    Instant Frame Injection Active &bull; Zero Lag Engine
                  </p>
                </div>
              </div>

              {/* Games Grid */}
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onSelect={handleSelectGame}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onDeleteCustom={handleDeleteCustomGame}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center border border-dashed border-[#00f0ff]/30 bg-[#0c0c0c] py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center border border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff] mb-3 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">No Archive Modules Found</h3>
                  <p className="mt-1 text-xs text-[#777777] max-w-sm font-mono">
                    {searchQuery 
                      ? `Query "${searchQuery}" returned zero matches in current directory.` 
                      : `No games currently indexed in this category.`}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="border border-[#FFFFFF22] bg-[#111111] px-4 py-2 text-xs font-mono uppercase text-white hover:border-[#00f0ff] hover:text-[#00f0ff]"
                      >
                        Reset Filter
                      </button>
                    )}
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="rgb-bg px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    >
                      + Inject Custom Module
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        onImportJson={handleImportJson}
        onResetDefaults={handleResetDefaults}
        games={games}
      />

      {/* Artistic Flair Marquee Ticker with RGB spectrum glow */}
      <div className="h-10 rgb-bg flex items-center overflow-hidden border-t-2 border-black shadow-[0_0_20px_rgba(0,240,255,0.3)]">
        <div className="animate-marquee text-black font-black uppercase text-[11px] tracking-tight py-1 items-center font-mono">
          <span className="mx-6">🎯 ELIMINATER_RANGE_ONLINE</span>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          <span className="mx-6">AIM_TARGET_ARMORY_LOADED</span>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          <span className="mx-6">⚡ RGB_CHROMA_GAMING_ACTIVE</span>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          <span className="mx-6">UNBLOCKED_AND_UNFILTERED</span>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          <span className="mx-6">LOAD_GAMES_FROM_GAMES.JSON</span>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          <span className="mx-6">INSTANT_FRAME_INJECTION_ACTIVE</span>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          <span className="mx-6">🎯 ELIMINATER_RANGE_ONLINE</span>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          <span className="mx-6">AIM_TARGET_ARMORY_LOADED</span>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          <span className="mx-6">⚡ RGB_CHROMA_GAMING_ACTIVE</span>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          <span className="mx-6">UNBLOCKED_AND_UNFILTERED</span>
        </div>
      </div>

      {/* Sub-Footer */}
      <footer className="border-t border-[#FFFFFF1A] bg-black py-6 text-xs text-[#777777]">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rgb-bg rotate-45" />
            <span className="font-bold uppercase tracking-wider text-white">ELIMINATER RANGE</span>
            <span className="font-mono text-[10px] text-[#555555]">&bull; Target Armory &amp; Standalone HTML5 Sandboxes</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[#888888]">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-[#00f0ff] underline decoration-[#444444] underline-offset-4"
            >
              Export games.json
            </button>
            <span>&bull;</span>
            <span>Panic: <kbd className="border border-[#FFFFFF22] bg-[#111111] px-1.5 py-0.5 text-[10px] text-[#00f0ff]">~</kbd></span>
            <span>&bull;</span>
            <span>Search: <kbd className="border border-[#FFFFFF22] bg-[#111111] px-1.5 py-0.5 text-[10px] text-[#00f0ff]">/</kbd></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
