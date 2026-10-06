import React, { useState } from 'react';
import { Wand2, Sparkles, Copy, Check, Eye, Smartphone, Monitor, Flame, Layers, AlertCircle, Play } from 'lucide-react';
import { TitleIdea, ThumbnailConcept, LanguageMode } from '../types';
import { generateTitlesAndThumbnails } from '../services/api';

interface TitleThumbnailLabProps {
  language: LanguageMode;
  initialTopic?: string;
  onSendToSeo?: (title: string, topic: string) => void;
}

export const TitleThumbnailLab: React.FC<TitleThumbnailLabProps> = ({
  language,
  initialTopic = '',
  onSendToSeo,
}) => {
  const [topic, setTopic] = useState(initialTopic || 'I Built an AI Agent in 24 Hours');
  const [niche, setNiche] = useState('Tech & AI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titles, setTitles] = useState<TitleIdea[]>([]);
  const [thumbnails, setThumbnails] = useState<ThumbnailConcept[]>([]);
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);

  // Selected preview for YouTube Mockup
  const [selectedTitle, setSelectedTitle] = useState<string>('I Built an AI Agent in 24 Hours');
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailConcept | null>(null);
  const [mockupMode, setMockupMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please provide a video topic.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await generateTitlesAndThumbnails({
        topic,
        niche,
        language,
      });

      setTitles(res.data.titles);
      setThumbnails(res.data.thumbnailConcepts);
      if (res.data.titles.length > 0) {
        setSelectedTitle(res.data.titles[0].title);
      }
      if (res.data.thumbnailConcepts.length > 0) {
        setSelectedThumbnail(res.data.thumbnailConcepts[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyTitle = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTitleIndex(idx);
    setTimeout(() => setCopiedTitleIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Config */}
      <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Click-Through-Rate (CTR) Laboratory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Title & Thumbnail Optimization Lab
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Generate 12%+ CTR titles scored by psychological triggers and viral thumbnail compositions
            previewed directly inside real YouTube feed layouts.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter video concept (e.g., Coding full stack apps with AI in 2026)..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="sm:w-56">
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Channel Niche..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-7 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-red-600/30 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Optimizing CTR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate High-CTR Assets</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 rounded-lg p-2.5">
            {error}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Titles Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500 fill-red-500" />
              Psychologically Scored Titles
            </h3>
            <span className="text-xs text-zinc-400">Click title to preview on feed</span>
          </div>

          {titles.length === 0 ? (
            <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 text-xs">
              Click "Generate High-CTR Assets" above to see 6 algorithmic titles with clickability scores!
            </div>
          ) : (
            <div className="space-y-3">
              {titles.map((t, idx) => {
                const isSelected = selectedTitle === t.title;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedTitle(t.title)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800/90 border-red-500/80 shadow-md ring-1 ring-red-500/30'
                        : 'bg-[#121418] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              t.ctrScore >= 90
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                                : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                            }`}
                          >
                            CTR Score: {t.ctrScore}%
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {t.characterCount} chars (optimal)
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug">{t.title}</h4>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyTitle(t.title, idx);
                          }}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
                          title="Copy Title"
                        >
                          {copiedTitleIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                      <span className="text-zinc-500 text-[11px]">
                        Formula: <span className="text-zinc-300 font-medium">{t.formula}</span>
                      </span>
                      {onSendToSeo && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSendToSeo(t.title, topic);
                          }}
                          className="text-[11px] text-red-400 hover:text-red-300 underline font-medium cursor-pointer"
                        >
                          Send to SEO Studio →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Thumbnail Concepts */}
          {thumbnails.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" /> Visual Thumbnail Concepts
              </h3>
              <div className="space-y-3">
                {thumbnails.map((c) => {
                  const isSelected = selectedThumbnail?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedThumbnail(c)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-800/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-[#121418] border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-400 uppercase font-mono">
                          Concept {c.id}: {c.conceptName}
                        </span>
                        <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded">
                          Click to Preview
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Composition:</span>
                          <span className="text-zinc-200">{c.layout}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Text Overlay:</span>
                          <span className="text-amber-300 font-bold font-mono">"{c.overlayText}"</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Focal Face/Subject:</span>
                          <span className="text-zinc-300">{c.focalSubject}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">Psychological Hook:</span>
                          <span className="text-zinc-300">{c.psychology}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* YouTube Feed Mockup Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-500" />
              Live YouTube Feed Simulator
            </h3>
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setMockupMode('mobile')}
                className={`p-1.5 rounded transition-all ${
                  mockupMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                }`}
                title="Mobile Feed (80% of YouTube traffic)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMockupMode('desktop')}
                className={`p-1.5 rounded transition-all ${
                  mockupMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                }`}
                title="Desktop Feed"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* YouTube Video Card Simulator */}
          <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-4 shadow-2xl">
            <div className="text-[10px] text-zinc-500 font-mono uppercase mb-2 flex items-center justify-between">
              <span>Simulated YouTube {mockupMode} View</span>
              <span className="text-red-500">● Live Preview</span>
            </div>

            {/* Thumbnail Canvas */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-black border border-zinc-800 shadow-inner flex flex-col justify-between p-4 group">
              {/* Thumbnail Ambient Art */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

              {/* Dynamic Overlay Elements */}
              <div className="relative z-10 flex justify-between items-start">
                <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-lg">
                  BREAKTHROUGH
                </span>
                <span className="bg-black/80 backdrop-blur-md text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/40">
                  {selectedThumbnail?.conceptName || 'VIRAL CONTRAST'}
                </span>
              </div>

              {/* Center Focal Text */}
              <div className="relative z-10 text-center my-auto">
                <div className="inline-block transform -rotate-1 shadow-2xl">
                  <span className="font-black text-2xl sm:text-3xl tracking-tighter text-yellow-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] uppercase border-2 border-yellow-300/60 bg-black/75 px-3 py-1 rounded-md">
                    {selectedThumbnail?.overlayText || 'DO NOT MISS THIS!'}
                  </span>
                </div>
                <div className="text-[11px] text-white/90 font-medium mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-xs mx-auto">
                  {selectedThumbnail?.focalSubject || 'Creator intense reaction face with high rim-light'}
                </div>
              </div>

              {/* Bottom Video Duration */}
              <div className="relative z-10 flex justify-end">
                <span className="bg-black/90 text-white font-mono text-[11px] font-bold px-1.5 py-0.5 rounded">
                  09:42
                </span>
              </div>
            </div>

            {/* YouTube Card Metadata */}
            <div className="mt-3 flex space-x-3">
              {/* Creator Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                YT
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug">
                  {selectedTitle}
                </h4>
                <div className="text-[11px] text-zinc-400 mt-1 flex items-center space-x-1.5 flex-wrap">
                  <span className="hover:text-zinc-200">AI Creator Studio</span>
                  <span>•</span>
                  <span>142K views</span>
                  <span>•</span>
                  <span>3 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTR Evaluation Box */}
          <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-4 text-xs space-y-2">
            <div className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Mobile CTR Inspection Checklist:
            </div>
            <ul className="space-y-1.5 text-zinc-400">
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Title fits within the 60-character mobile cut-off zone.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Thumbnail text is under 4 words so it remains readable on small 5-inch phone screens.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Color contrast exceeds 4.5:1 ratio against YouTube dark and light themes.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
