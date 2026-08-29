import React from 'react';
import { BookOpen, CheckCircle, FileText, Share2, MoreVertical, Search, ArrowLeft } from 'lucide-react';

export const PanicScreen = ({ onDismiss }) => {
  return (
    <div 
      className="fixed inset-0 z-50 bg-[#f8f9fa] text-[#3c4043] font-sans overflow-auto select-none"
      onClick={onDismiss}
    >
      {/* Top Classroom Bar */}
      <div className="flex h-16 items-center justify-between border-b border-[#dadce0] bg-white px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#137333] text-white font-bold text-lg">
            AP
          </div>
          <div>
            <h1 className="text-lg font-medium text-[#202124]">
              AP European History &bull; Period 4
            </h1>
            <p className="text-xs text-[#5f6368]">
              Assignment: Primary Source Document Analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Exit Disguise (Click Anywhere)
          </button>
        </div>
      </div>

      {/* Main Homework Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-xl border border-[#dadce0] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e8eaed] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#137333]">
                Due Tomorrow, 11:59 PM
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[#202124]">
                Unit 4: Scientific Revolution & Enlightenment Thought
              </h2>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-[#137333]">100 points</span>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#3c4043]">
            <p>
              <strong>Instructions:</strong> Read the excerpts below from Francis Bacon's <em>Novum Organum</em> (1620) and René Descartes' <em>Discourse on the Method</em> (1637). Answer the analytical prompts regarding deductive vs. inductive reasoning in paragraph format.
            </p>

            <div className="rounded-lg bg-[#f1f3f4] p-4 font-serif text-xs italic text-[#202124] border-l-4 border-[#137333]">
              "There are and can be only two ways of searching into and discovering truth. The one flies from the senses and particulars to the most general axioms... The other derives axioms from the senses and particulars, rising by a gradual and unbroken ascent, so that it arrives at the most general axioms last of all. This is the true way, but as yet untried."
            </div>

            <h3 className="pt-2 font-bold text-[#202124]">Response Questions:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-[#5f6368]">
              <li>How does Bacon's empirical method challenge traditional scholasticism?</li>
              <li>Compare Descartes' rationalist skepticism with Bacon's observation-based approach.</li>
              <li>Assess the societal impact of the Royal Society of London during the late 17th century.</li>
            </ol>

            <div className="mt-6 rounded-lg border border-dashed border-[#bdc1c6] p-4 text-center">
              <p className="text-xs text-[#5f6368]">Your work has been saved to Google Drive.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
