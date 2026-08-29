import React from 'react';
import { 
  Play, 
  Heart, 
  Sparkles, 
  Gamepad2, 
  Zap, 
  Puzzle, 
  History, 
  Trophy, 
  Brain, 
  Grid,
  Boxes,
  Disc,
  Crosshair,
  Layers,
  Target,
  Swords,
  Eye,
  Hexagon,
  Trash2
} from 'lucide-react';

const ICON_MAP = {
  Gamepad2,
  Zap,
  Puzzle,
  History,
  Trophy,
  Brain,
  Sparkles,
  Grid,
  Boxes,
  Disc,
  Crosshair,
  Layers,
  Target,
  Swords,
  Eye,
  Hexagon
};

export const GameCard = ({
  game,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onDeleteCustom
}) => {
  const IconComponent = (game.iconName && ICON_MAP[game.iconName]) || Gamepad2;
  const gradientClass = game.gradient || 'from-indigo-600 to-purple-950';

  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative flex flex-col overflow-hidden border border-[#FFFFFF1A] bg-[#0e0e0e] transition-all duration-200 hover:-translate-y-1 hover:border-[#00f0ff] hover:bg-[#141414] hover:shadow-[0_0_20px_rgba(0,240,255,0.3),0_0_35px_rgba(255,0,85,0.15)] cursor-pointer rgb-hover-card"
    >
      {/* Corner Tech Accent */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity z-20" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff0055] opacity-0 group-hover:opacity-100 transition-opacity z-20" />

      {/* Thumbnail Banner */}
      <div className={`relative flex h-36 w-full items-center justify-center overflow-hidden bg-gradient-to-br ${gradientClass} border-b border-[#FFFFFF1A]`}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-arcade-grid opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Large Decorative Center Icon */}
        <div className="relative transform transition-transform duration-300 group-hover:scale-110">
          <div className="flex h-14 w-14 items-center justify-center bg-black/60 backdrop-blur-md border border-[#FFFFFF22] shadow-2xl group-hover:border-[#00f0ff]">
            <IconComponent className="h-7 w-7 text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]" />
          </div>
        </div>

        {/* Play Overlay Button with RGB glow */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rgb-bg text-black shadow-[0_0_20px_rgba(0,240,255,0.8)] transition-transform duration-200 group-hover:scale-110">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-[#ff0055] text-white shadow-[0_0_10px_rgba(255,0,85,0.6)]' 
              : 'bg-black/70 text-white/80 hover:bg-black hover:text-[#00f0ff] border border-[#FFFFFF22]'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Custom Game Delete button */}
        {game.isCustom && onDeleteCustom && (
          <button
            onClick={(e) => onDeleteCustom(game.id, e)}
            title="Delete custom game"
            className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center bg-black/60 text-red-400 backdrop-blur-md transition-all hover:bg-red-600 hover:text-white border border-red-500/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Category Tag */}
        <div className="absolute bottom-2 left-2.5 border border-[#00f0ff]/40 bg-black/85 px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase text-[#00f0ff] backdrop-blur-md">
          {game.category}
        </div>

        {/* Plays count */}
        {game.playsCount && (
          <div className="absolute bottom-2 right-2.5 border border-[#FFFFFF22] bg-black/80 px-2 py-0.5 text-[9px] font-mono text-[#CCCCCC] backdrop-blur-md">
            {game.playsCount.toLocaleString()} PLAYS
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4 bg-[#0a0a0a]">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm tracking-tight text-white uppercase group-hover:text-[#00f0ff] transition-colors line-clamp-1">
            {game.title}
          </h3>
        </div>

        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[#888888] line-clamp-2">
          {game.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {game.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="border border-[#FFFFFF11] bg-[#111111] px-1.5 py-0.5 text-[9px] font-mono text-[#777777] uppercase"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
