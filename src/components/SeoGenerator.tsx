import React, { useState } from 'react';
import { Hash, Sparkles, Copy, Check, FileText, Tag, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SeoData, LanguageMode } from '../types';
import { generateSeo } from '../services/api';

interface SeoGeneratorProps {
  language: LanguageMode;
  initialTitle?: string;
  initialTopic?: string;
}

export const SeoGenerator: React.FC<SeoGeneratorProps> = ({
  language,
  initialTitle = '',
  initialTopic = '',
}) => {
  const [title, setTitle] = useState(initialTitle || 'How to Use AI in 2026: Complete Guide');
  const [topic, setTopic] = useState(initialTopic || 'AI Tools and Automation');
  const [niche, setNiche] = useState('Technology & Productivity');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seo, setSeo] = useState<SeoData | null>(null);

  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please provide a topic or title.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await generateSeo({
        title,
        topic,
        language,
        niche,
      });
      setSeo(res.seo);
    } catch (err: any) {
      setError(err.message || 'SEO generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyTagsForStudio = () => {
    if (!seo) return;
    navigator.clipboard.writeText(seo.tagsCommaSeparated || seo.tags.join(', '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const copyDescription = () => {
    if (!seo) return;
    navigator.clipboard.writeText(seo.optimizedDescription);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const copyHashtags = () => {
    if (!seo) return;
    navigator.clipboard.writeText(seo.hashtags.join(' '));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Config */}
      <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Hash className="w-3.5 h-3.5" />
            <span>YouTube Studio Metadata Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SEO & Studio Tag Studio
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Generate high-ranking video descriptions, 1-click comma-separated tags ready for YouTube
            Studio, viral hashtags, and algorithmic category matching.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Video Title (Optional / Final Title)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How I Built an AI App in 24 Hours..."
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Main Keyword / Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. AI tools, web development, productivity..."
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-7 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-red-600/30 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Extracting High-Rank Keywords...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate YouTube Studio SEO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 rounded-lg p-2.5">
            {error}
          </div>
        )}
      </div>

      {/* SEO Results Area */}
      {seo && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 font-mono font-black text-xl">
                {seo.searchIntentScore}%
              </div>
              <div>
                <span className="text-xs uppercase font-mono text-zinc-400">Search Intent Score</span>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Rank #1 Search & Suggested Video Strategy
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">{seo.seoStrategy}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs text-zinc-400">Category:</span>
              <span className="text-xs font-semibold bg-zinc-800 text-zinc-200 px-3 py-1 rounded-lg border border-zinc-700">
                {seo.category}
              </span>
            </div>
          </div>

          {/* YouTube Studio Tags Box */}
          <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-red-500" />
                  YouTube Studio Tags (500 Character Limit)
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Click the button below to copy in comma-separated format for direct 1-click paste into YouTube Studio!
                </p>
              </div>

              <button
                onClick={copyTagsForStudio}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md shadow-red-600/30 shrink-0 cursor-pointer"
              >
                {copiedTags ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied for Studio!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All for YouTube Studio</span>
                  </>
                )}
              </button>
            </div>

            {/* Tag Badges Cloud */}
            <div className="flex flex-wrap gap-2 pt-1">
              {seo.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs px-2.5 py-1 rounded-lg"
                >
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            {/* Comma-separated preview */}
            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 text-[11px] font-mono text-zinc-400 break-words">
              {seo.tagsCommaSeparated || seo.tags.join(', ')}
            </div>
          </div>

          {/* Description & Hashtags Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Description Box */}
            <div className="lg:col-span-8 bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Full Video Description Template
                </h4>
                <button
                  onClick={copyDescription}
                  className="text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedDesc ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Description</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80">
                <pre className="text-xs text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {seo.optimizedDescription}
                </pre>
              </div>
            </div>

            {/* Hashtags & Checklist */}
            <div className="lg:col-span-4 space-y-6">
              {/* Hashtags */}
              <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-400" />
                    Hashtags
                  </h4>
                  <button
                    onClick={copyHashtags}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHashtags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {seo.hashtags.map((h, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-red-950/40 text-red-300 border border-red-800/40 px-2 py-0.5 rounded font-mono"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upload Checklist */}
              <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  YouTube Studio Upload Rules
                </h4>
                <ul className="space-y-2 text-xs text-zinc-400">
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">1.</span>
                    <span>Set video language & subtitles for extra 15% international reach.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span>Add 1 Card at the 4-minute mark teasing the next video.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <span>Pin an engaging question comment immediately upon publishing.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
