import React, { useState } from 'react';
import { Search, Youtube, Play, Sparkles, Award, Clock, ArrowRight, MessageCircle, BarChart3, ShieldCheck, Flame, Copy, Check, ExternalLink } from 'lucide-react';
import { VideoAnalysis, VideoMetadata, LanguageMode } from '../types';
import { analyzeVideo } from '../services/api';

interface VideoAnalyzerProps {
  language: LanguageMode;
  onSelectTopicForScript?: (topic: string) => void;
}

export const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({
  language,
  onSelectTopicForScript,
}) => {
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    analysis: VideoAnalysis;
    meta: VideoMetadata | null;
    videoId: string | null;
  } | null>(null);

  const [copiedChapter, setCopiedChapter] = useState(false);

  // Preset curated YouTube videos for 1-click test
  const presets = [
    {
      title: 'MrBeast: $1 vs $250,000,000 Private Island',
      url: 'https://www.youtube.com/watch?v=48h57PspBec',
      topic: 'Extreme scale comparison challenge video',
      channel: 'MrBeast',
    },
    {
      title: 'MKBHD: The Future of AI Hardware',
      url: 'https://www.youtube.com/watch?v=9g0n6s_d6l8',
      topic: 'Deep tech hardware & AI critique review',
      channel: 'Marques Brownlee',
    },
    {
      title: 'Ali Abdaal: How to Learn Anything Faster',
      url: 'https://www.youtube.com/watch?v=kpvKzXj0v-4',
      topic: 'Evergreen productivity & learning framework',
      channel: 'Ali Abdaal',
    },
    {
      title: 'Tech Burner: Crazy Future Gadgets You Need',
      url: 'https://www.youtube.com/watch?v=3g8Q9qW3s7g',
      topic: 'High-energy humorous tech review & gadget testing',
      channel: 'Tech Burner',
    },
  ];

  const handleAnalyze = async (presetUrl?: string, presetTopic?: string) => {
    const targetUrl = presetUrl !== undefined ? presetUrl : url;
    const targetTopic = presetTopic !== undefined ? presetTopic : topic;

    if (!targetUrl.trim() && !targetTopic.trim()) {
      setError('Please paste a YouTube URL or enter a video topic.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeVideo({
        url: targetUrl || undefined,
        topic: targetTopic || undefined,
        language,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please check the link or topic.');
    } finally {
      setLoading(false);
    }
  };

  const copyChapters = () => {
    if (!result?.analysis?.chapters) return;
    const text = result.analysis.chapters
      .map((c) => `${c.timestamp} - ${c.title}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedChapter(true);
    setTimeout(() => setCopiedChapter(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner / Input Section */}
      <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Youtube className="w-3.5 h-3.5" />
            <span>AI Algorithm & Retention Auditor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analyze Any YouTube Video or Trend
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Paste any YouTube URL or concept to reverse-engineer why it works: 3-second hook retention,
            pacing, timestamp chapter breakdown, and next video ideas.
          </p>
        </div>

        {/* Input Form */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Youtube className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=... or youtu.be/...)"
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="sm:w-64">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Or enter topic/niche..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-red-600/30 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Audit</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 rounded-lg p-2.5">
            {error}
          </div>
        )}

        {/* Preset Samples */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80">
          <div className="text-xs text-zinc-400 font-medium mb-2 flex items-center gap-1.5">
            <Play className="w-3 h-3 text-red-500 fill-red-500" /> Or audit one of these viral presets in 1-click:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUrl(p.url);
                  setTopic(p.topic);
                  handleAnalyze(p.url, p.topic);
                }}
                disabled={loading}
                className="text-left p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="font-semibold text-white group-hover:text-red-400 truncate w-full">
                  {p.title}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                  <span>{p.channel}</span>
                  <span className="text-red-400 text-[10px] uppercase font-mono">Test →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="space-y-6">
          {/* Header Card with Thumbnail & Retention Score */}
          <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Thumbnail Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
              {result.videoId ? (
                <img
                  src={`https://img.youtube.com/vi/${result.videoId}/hqdefault.jpg`}
                  alt="YouTube Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 p-4 text-center">
                  <Youtube className="w-12 h-12 text-zinc-700 mb-2" />
                  <span className="text-xs font-mono">Video Concept Analyzed</span>
                </div>
              )}
              {result.videoId && (
                <a
                  href={`https://www.youtube.com/watch?v=${result.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium space-x-1"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Title & Core Overview */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-red-400 font-semibold">
                {result.meta?.author_name || 'Audited Content'}
              </span>
              <h3 className="text-lg font-bold text-white leading-snug">
                {result.meta?.title || topic || 'YouTube Video Breakdown'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {result.analysis.summary}
              </p>
              <div className="text-xs text-zinc-400 pt-1">
                <span className="text-zinc-300 font-semibold">Target Audience:</span>{' '}
                {result.analysis.targetAudience}
              </div>
            </div>

            {/* Retention Score Ring */}
            <div className="flex flex-col items-center justify-center bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl text-center">
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-zinc-800 bg-zinc-950">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-red-500 to-amber-400">
                  {result.analysis.retentionScore}
                </span>
                <span className="absolute bottom-3 text-[10px] text-zinc-400 font-mono">/100</span>
              </div>
              <span className="text-xs font-bold text-zinc-200 mt-2 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Retention Grade
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5">
                {result.analysis.retentionScore > 85 ? 'Viral Potential: Extreme 🚀' : 'Viral Potential: Strong 🔥'}
              </span>
            </div>
          </div>

          {/* 3-Second Hook Deep Dive */}
          <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-red-500" />
                <h4 className="text-base font-bold text-white">The 3-Second Hook Audit</h4>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                Formula: {result.analysis.hookAnalysis.hookFormula}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Why It Works / Retention Driver:
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {result.analysis.hookAnalysis.effectiveness}
                </p>
              </div>
              <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-xl">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Agent Recommendation:
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {result.analysis.hookAnalysis.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Chapters & Timestamps with Retention Tactics */}
          <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h4 className="text-base font-bold text-white">Chapter Markers & Retention Pacing</h4>
              </div>
              <button
                onClick={copyChapters}
                className="text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedChapter ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Timestamps</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {result.analysis.chapters.map((ch, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all text-xs"
                >
                  <div className="flex items-center space-x-3 mb-1 sm:mb-0">
                    <span className="font-mono text-red-400 bg-red-950/40 border border-red-800/40 px-2 py-0.5 rounded font-bold">
                      {ch.timestamp}
                    </span>
                    <span className="font-semibold text-white">{ch.title}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-zinc-400">
                    <span className="text-[11px] text-zinc-500">Pacing Tactic:</span>
                    <span className="text-zinc-300 font-medium bg-zinc-800 px-2 py-0.5 rounded">
                      {ch.retentionTactic}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Viral Factors & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Highlights */}
            <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white">Algorithmic Highlights</h4>
              </div>
              <ul className="space-y-2.5">
                {result.analysis.keyHighlights.map((kh, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                    <span>{kh}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Video Angles (Sequels & Opposites) */}
            <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-bold text-white">Inspired Next Video Angles</h4>
              </div>
              <div className="space-y-2.5">
                {result.analysis.nextVideoAngles.map((angle, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between group"
                  >
                    <span className="text-xs font-semibold text-zinc-200 pr-2">{angle}</span>
                    {onSelectTopicForScript && (
                      <button
                        onClick={() => onSelectTopicForScript(angle)}
                        className="shrink-0 text-[11px] text-red-400 hover:text-white bg-red-950/40 hover:bg-red-600 px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>Write Script</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pin-Worthy Comment Prompts */}
          <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
              <MessageCircle className="w-5 h-5 text-sky-400" />
              <h4 className="text-base font-bold text-white">Pin-Worthy Comments to Skyrocket Engagement</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.analysis.topCommentSuggestions.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
                  <div className="text-[11px] font-mono text-sky-400 uppercase font-semibold mb-1">
                    {c.type}
                  </div>
                  <p className="text-zinc-200 italic mb-2">"{c.comment}"</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(c.comment);
                    }}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy Comment
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
