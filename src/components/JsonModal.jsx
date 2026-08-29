import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  FileCode, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const JsonModal = ({
  isOpen,
  onClose,
  games = [],
  onImportJson,
  onResetDefaults
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('view');

  if (!isOpen) return null;

  // Clean JSON export organizing categories and their respective games
  const exportableGames = games.map(g => ({
    id: g.id,
    title: g.title,
    category: g.category,
    description: g.description,
    iframeUrl: g.iframeUrl || 'about:blank',
    embedHtml: g.embedHtml ? '[Standalone Embedded HTML5 Iframe Engine]' : undefined,
    aspectRatio: g.aspectRatio || '16/9',
    controls: g.controls,
    tags: g.tags,
    featured: g.featured || false,
    playsCount: g.playsCount || 0
  }));

  // Categories list and grouped games
  const allCategoryNames = Array.from(new Set(games.map(g => g.category)));
  const categoryGroups = allCategoryNames.map(cat => ({
    id: cat,
    name: cat,
    gamesCount: games.filter(g => g.category === cat).length,
    games: exportableGames.filter(g => g.category === cat)
  }));

  // Top Most Played games
  const mostPlayedList = [...exportableGames]
    .sort((a, b) => (b.playsCount || 0) - (a.playsCount || 0))
    .slice(0, 5);

  const jsonStructuredData = {
    version: '2.0.0',
    database: 'EliminaterRangeArmory',
    lastExport: new Date().toISOString(),
    totalGames: games.length,
    totalPlays: games.reduce((acc, g) => acc + (g.playsCount || 0), 0),
    categories: categoryGroups,
    mostPlayed: mostPlayedList,
    games: exportableGames
  };

  const jsonString = JSON.stringify(jsonStructuredData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        setImportText(text);
        processJson(text);
      } catch (err) {
        setImportStatus('error');
        setErrorMessage('Failed to read file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const processJson = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      let list = [];

      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (Array.isArray(parsed.games)) {
        list = parsed.games;
      } else if (Array.isArray(parsed.categories)) {
        // Flatten games from category structure
        list = parsed.categories.flatMap((c) => 
          Array.isArray(c.games) ? c.games.map((g) => ({ ...g, category: g.category || c.name || c.id })) : []
        );
      }

      if (!Array.isArray(list) || list.length === 0) {
        throw new Error('No valid games or category games found in JSON.');
      }

      // Validate items
      const validGames = list.map((item, idx) => ({
        id: item.id || `custom-${Date.now()}-${idx}`,
        title: item.title || 'Untitled Game',
        category: item.category || 'Arcade',
        description: item.description || 'Custom unblocked game',
        iframeUrl: item.iframeUrl,
        embedHtml: item.embedHtml,
        controls: item.controls || 'Keyboard / Mouse',
        tags: Array.isArray(item.tags) ? item.tags : ['Unblocked'],
        gradient: item.gradient || 'from-indigo-600 to-purple-950',
        iconName: item.iconName || 'Gamepad2',
        isCustom: true,
        playsCount: typeof item.playsCount === 'number' ? item.playsCount : 0,
        aspectRatio: item.aspectRatio || '16/9'
      }));

      onImportJson(validGames);
      setImportStatus('success');
      setTimeout(() => {
        onClose();
        setImportStatus('idle');
      }, 1200);
    } catch (err) {
      setImportStatus('error');
      setErrorMessage(err.message || 'Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl border border-[#FFFFFF33] bg-[#0d0d0d] shadow-2xl my-8">
        {/* Corner Tech Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff] pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff0055] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FFFFFF1A] p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center border border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <FileCode className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">games.json Protocol Database</h2>
              <p className="text-[10px] font-mono uppercase text-[#777777]">Iframe Schema Storage Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border border-[#FFFFFF22] p-1 text-[#888888] hover:border-white hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#FFFFFF1A] px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('view')}
            className={`border px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'view'
                ? 'border-[#00f0ff] bg-[#00f0ff] text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            Export JSON Architecture
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`border px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'import'
                ? 'border-[#00f0ff] bg-[#00f0ff] text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'border-transparent text-[#888888] hover:text-white'
            }`}
          >
            Import JSON Payload
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'view' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#888888]">
                  {games.length} modules registered in payload
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 border border-[#FFFFFF22] bg-black px-3 py-1.5 text-xs font-mono uppercase text-[#CCCCCC] hover:border-white hover:text-white"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-[#00f0ff]" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 rgb-bg px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download games.json</span>
                  </button>
                </div>
              </div>

              <div className="relative max-h-96 overflow-y-auto border border-[#FFFFFF1A] bg-black p-4 font-mono text-xs text-[#00FF66]">
                <pre className="whitespace-pre-wrap">{jsonString}</pre>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    if (confirm('Reset to default curated unblocked games?')) {
                      onResetDefaults();
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#666666] hover:text-red-400 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restore Factory Defaults</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {importStatus === 'success' && (
                <div className="flex items-center gap-2 border border-[#CBFB45] bg-[#CBFB45]/10 p-3 text-xs font-mono text-[#CBFB45]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>PAYLOAD INTEGRATED SUCCESSFULLY INTO LOCAL VAULT</span>
                </div>
              )}
              {importStatus === 'error' && (
                <div className="flex items-center gap-2 border border-red-500 bg-red-950/60 p-3 text-xs font-mono text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888] mb-2">
                  Upload .json File
                </label>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs font-mono text-[#AAAAAA] file:mr-4 file:border-0 file:bg-[#CBFB45] file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:text-black hover:file:bg-[#d8ff5e] cursor-pointer"
                />
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#FFFFFF1A]"></div>
                <span className="flex-shrink mx-4 text-[10px] font-mono uppercase tracking-widest text-[#666666]">Or Paste Raw JSON Payload</span>
                <div className="flex-grow border-t border-[#FFFFFF1A]"></div>
              </div>

              <div>
                <textarea
                  rows={8}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='Paste JSON containing {"games": [...]} or array of games...'
                  className="w-full border border-[#FFFFFF22] bg-black p-3 text-xs font-mono text-white placeholder-[#555555] focus:border-[#CBFB45] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#FFFFFF1A]">
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-[#FFFFFF22] bg-black px-4 py-2 text-xs font-mono uppercase text-[#AAAAAA] hover:border-white hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => processJson(importText)}
                  disabled={!importText.trim()}
                  className="flex items-center gap-1.5 rgb-bg px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_12px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4" />
                  <span>Execute Import</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
