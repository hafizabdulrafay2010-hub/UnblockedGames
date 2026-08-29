import React, { useState } from 'react';
import { X, Plus, Play, Sparkles, AlertCircle, Code } from 'lucide-react';

const CATEGORIES = [
  'Arcade',
  'Action',
  'Puzzle',
  'Retro',
  'Sports',
  'Strategy',
  'Casual'
];

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [iframeInput, setIframeInput] = useState('');
  const [controls, setControls] = useState('Mouse or Keyboard controls');
  const [tagsInput, setTagsInput] = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Extract clean URL or HTML embed
  const parseEmbed = (input) => {
    const trimmed = (input || '').trim();
    if (!trimmed) return {};

    // Check if input is standard iframe HTML tag
    if (trimmed.toLowerCase().startsWith('<iframe')) {
      const match = trimmed.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        return { iframeUrl: match[1] };
      }
      return { embedHtml: trimmed };
    }

    // Check if it looks like standard HTML or script
    if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html') || trimmed.includes('<canvas') || trimmed.includes('<script>')) {
      return { embedHtml: trimmed };
    }

    // Otherwise treat as URL
    return { iframeUrl: trimmed };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a title for the game.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please provide an iframe embed URL or HTML code.');
      return;
    }

    const { iframeUrl, embedHtml } = parseEmbed(iframeInput);
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (tags.length === 0) tags.push(category, 'Custom');

    const newGame = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      category,
      description: description.trim() || 'Custom iframe unblocked game added by user.',
      iframeUrl,
      embedHtml,
      controls: controls.trim() || 'Mouse & Keyboard controls',
      tags,
      gradient: 'from-violet-700 to-indigo-950',
      iconName: 'Gamepad2',
      isCustom: true,
      playsCount: 1,
      aspectRatio: '16/9'
    };

    onAddGame(newGame);
    onClose();
    // Reset form
    setTitle('');
    setIframeInput('');
    setDescription('');
    setTagsInput('');
    setPreviewActive(false);
  };

  const parsed = parseEmbed(iframeInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl border border-[#FFFFFF33] bg-[#0d0d0d] shadow-2xl my-8">
        {/* Corner Tech Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff] pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff0055] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#FFFFFF1A] p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center border border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <Plus className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Inject Custom Iframe Module</h2>
          </div>
          <button
            onClick={onClose}
            className="border border-[#FFFFFF22] p-1 text-[#888888] hover:border-white hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 border border-red-500/50 bg-red-950/40 p-3 text-xs font-mono text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] mb-1.5">
              Module Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Slope Unblocked, Bitlife, Moto X3M..."
              className="w-full border border-[#FFFFFF22] bg-black px-3.5 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#CBFB45] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#FFFFFF22] bg-black px-3.5 py-2 text-xs font-mono text-white focus:border-[#CBFB45] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="action, 3d, unblocked"
                className="w-full border border-[#FFFFFF22] bg-black px-3.5 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#CBFB45] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888]">
                Iframe URL or Embed Code *
              </label>
              <button
                type="button"
                onClick={() => setPreviewActive(!previewActive)}
                className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#CBFB45] hover:underline"
              >
                {previewActive ? '[Hide Preview]' : '[Test Preview Stage]'}
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              placeholder="Paste iframe URL (e.g. https://... or <iframe src='...'></iframe>)"
              className="w-full border border-[#FFFFFF22] bg-black px-3.5 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#CBFB45] focus:outline-none"
            />
          </div>

          {/* Live Preview Box */}
          {previewActive && (parsed.iframeUrl || parsed.embedHtml) && (
            <div className="border border-[#CBFB45]/40 bg-black p-2">
              <div className="text-[10px] font-mono font-bold uppercase text-[#CBFB45] mb-1 px-1">
                Live Sandbox Output:
              </div>
              <div className="h-44 w-full overflow-hidden border border-[#FFFFFF22] bg-black">
                <iframe
                  srcDoc={parsed.embedHtml}
                  src={!parsed.embedHtml ? parsed.iframeUrl : undefined}
                  title="Test Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  className="h-full w-full border-0"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] mb-1.5">
              Controls Guide
            </label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="e.g. Arrow keys to steer, Space to jump"
              className="w-full border border-[#FFFFFF22] bg-black px-3.5 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#CBFB45] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the game rules and gameplay..."
              className="w-full border border-[#FFFFFF22] bg-black px-3.5 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#CBFB45] focus:outline-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FFFFFF1A]">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#FFFFFF22] bg-black px-4 py-2 text-xs font-mono uppercase text-[#AAAAAA] hover:border-white hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rgb-bg px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <Plus className="h-4 w-4" />
              <span>Commit to Armory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
