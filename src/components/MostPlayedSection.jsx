import React, { useState } from 'react';
import { Flame, Play, Trophy, Heart, TrendingUp, Sparkles, ChevronRight, BarChart3 } from 'lucide-react';

export const MostPlayedSection = ({
  games = [],
  onSelectGame,
  onToggleFavorite,
  favorites = [],
  topCount = 5
}) => {
  const [displayCount, setDisplayCount] = useState(topCount);

  // Sort games by playsCount descending to determine leaderboard
  const sortedGames = [...games].sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0));
  const topGames = sortedGames.slice(0, displayCount);
  const totalPlays = games.reduce((acc, g) => acc + (g.playsCount || 0), 0);

  if (topGames.length === 0) return null;

  return (
    <section className="mb-10 relative">
      {/* Section Title Header */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#FFFFFF1A] pb-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                Most Played Games
              </h2>
              <span className="rgb-bg px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                RGB_LEADERBOARD
              </span>
            </div>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#888888] mt-0.5">
              Ranked by battle activity &bull; {totalPlays.toLocaleString()} total sessions recorded
            </p>
          </div>
        </div>

        {/* Top N Toggle Selector */}
        <div className="flex items-center gap-1.5 bg-[#0e0e0e] border border-[#FFFFFF1A] p-1 text-[10px] font-mono uppercase">
          <span className="px-2 text-[#666666] hidden sm:inline">Show:</span>
          {[3, 5, 10].map((n) => (
            <button
              key={n}
              onClick={() => setDisplayCount(n)}
              className={`px-2.5 py-0.5 font-bold transition-all ${
                displayCount === n
                  ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Top {n}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Top N Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {topGames.map((game, index) => {
          const rank = index + 1;
          const isFavorite = favorites.includes(game.id);

          // Custom rank badge stylings
          const rankBadgeStyle = 
            rank === 1 ? 'rgb-bg text-black border-none font-black shadow-[0_0_15px_rgba(0,240,255,0.5)]' :
            rank === 2 ? 'bg-[#00f0ff] text-black border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)]' :
            rank === 3 ? 'bg-[#ff0055] text-white border-[#ff0055] shadow-[0_0_10px_rgba(255,0,85,0.3)]' :
            'bg-[#1a1a1a] text-[#888888] border-[#FFFFFF22]';

          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="group relative flex flex-col justify-between border border-[#FFFFFF1A] bg-[#0c0c0c] p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-[#00f0ff] hover:bg-[#121212] hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] cursor-pointer overflow-hidden rgb-hover-card"
            >
              {/* Corner accent for #1 */}
              {rank === 1 && (
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#00f0ff] z-10 pointer-events-none" />
              )}

              {/* Top Row: Rank Badge & Category & Plays */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`flex h-6 w-6 items-center justify-center text-xs font-mono font-black border ${rankBadgeStyle}`}>
                      #{rank}
                    </span>
                    <span className="border border-[#FFFFFF15] bg-[#161616] px-1.5 py-0.5 text-[9px] font-mono uppercase text-[#AAAAAA]">
                      {game.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => onToggleFavorite(game.id, e)}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    className={`flex h-6 w-6 items-center justify-center border transition-all ${
                      isFavorite
                        ? 'border-[#ff0055] bg-[#ff0055] text-white shadow-[0_0_10px_rgba(255,0,85,0.4)]'
                        : 'border-[#FFFFFF1A] bg-black text-[#666666] hover:text-[#00f0ff] hover:border-[#00f0ff]'
                    }`}
                  >
                    <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Game Title */}
                <h3 className="font-bold text-sm uppercase tracking-tight text-white group-hover:text-[#00f0ff] transition-colors line-clamp-1">
                  {game.title}
                </h3>

                {/* Description snippet */}
                <p className="mt-1 text-[11px] text-[#777777] line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Bottom Row: Play Counter & Play CTA */}
              <div className="mt-4 pt-3 border-t border-[#FFFFFF15] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#00f0ff]">
                  <Flame className="h-3.5 w-3.5 text-[#ff0055] animate-pulse" />
                  <span>{(game.playsCount || 0).toLocaleString()} plays</span>
                </div>

                <div className="flex items-center gap-1 bg-[#161616] group-hover:bg-[#00f0ff] group-hover:text-black border border-[#FFFFFF15] px-2 py-1 text-[10px] font-mono font-bold uppercase transition-all text-[#AAAAAA] group-hover:shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                  <Play className="h-3 w-3 fill-current" />
                  <span>Play</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
