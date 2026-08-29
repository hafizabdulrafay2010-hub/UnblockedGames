import React from 'react';
import { 
  Compass, 
  Gamepad2, 
  Zap, 
  Puzzle, 
  History, 
  Trophy, 
  Brain, 
  Sparkles, 
  Heart,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Games', icon: Compass },
  { id: 'Favorites', label: 'Favorites', icon: Heart },
  { id: 'Arcade', label: 'Arcade', icon: Gamepad2 },
  { id: 'Action', label: 'Action', icon: Zap },
  { id: 'Puzzle', label: 'Puzzle', icon: Puzzle },
  { id: 'Retro', label: 'Retro', icon: History },
  { id: 'Sports', label: 'Sports', icon: Trophy },
  { id: 'Strategy', label: 'Strategy', icon: Brain },
  { id: 'Casual', label: 'Casual', icon: Sparkles },
  { id: 'Custom', label: 'Custom Iframes', icon: Bookmark },
];

export const CategoryBar = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  favoritesCount,
  categoryCounts = {}
}) => {
  return (
    <div className="w-full border-b border-[#FFFFFF1A] bg-black/80 py-2.5 backdrop-blur-md relative">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
        {/* Category Buttons with Gaming RGB Aesthetics */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'Favorites' 
              ? favoritesCount 
              : cat.id === 'All' 
                ? categoryCounts['total'] || 0
                : categoryCounts[cat.id] || 0;

            // Skip showing empty categories if custom has 0
            if (cat.id === 'Custom' && count === 0 && !isSelected) return null;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative flex items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-black text-white border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4),0_0_30px_rgba(255,0,128,0.2)]'
                    : 'bg-[#0d0d0d] text-[#888888] hover:bg-[#151515] hover:text-white border-[#FFFFFF1A] hover:border-[#00f0ff]/50'
                }`}
              >
                {/* Active RGB top indicator */}
                {isSelected && (
                  <div className="absolute -top-[1px] left-0 right-0 h-[2px] rgb-bg" />
                )}

                <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-[#00f0ff] drop-shadow-[0_0_6px_#00f0ff]' : 'text-[#666666] group-hover:text-[#ff0055]'}`} />
                <span className={isSelected ? 'font-black tracking-normal' : ''}>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                      isSelected
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40'
                        : 'bg-[#1a1a1a] text-[#777777] group-hover:text-white'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#888888]">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#00f0ff]" />
          <span className="hidden sm:inline text-[10px]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-[#FFFFFF22] bg-[#0c0c0c] px-2.5 py-1 text-[11px] font-mono text-white focus:border-[#00f0ff] focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] focus:outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="alpha">Alphabetical (A-Z)</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
};
