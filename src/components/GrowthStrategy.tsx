import React, { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, Users, Award, ShieldAlert, Zap, Compass, CheckCircle } from 'lucide-react';
import { LanguageMode } from '../types';

interface GrowthStrategyProps {
  language: LanguageMode;
  onSelectTopic?: (topic: string) => void;
}

export const GrowthStrategy: React.FC<GrowthStrategyProps> = ({ language, onSelectTopic }) => {
  // Retention & RPM Calculator State
  const [views, setViews] = useState(50000);
  const [nicheRpm, setNicheRpm] = useState(4.5); // USD per 1000 views
  const [clickThroughRate, setClickThroughRate] = useState(8.5); // %

  const estimatedEarnings = ((views / 1000) * nicheRpm).toFixed(2);
  const estimatedImpressions = Math.round(views / (clickThroughRate / 100));
  const estimatedSubscribers = Math.round(views * 0.012); // ~1.2% conversion

  const viralBlueprints = [
    {
      name: 'The MrBeast "Extreme Escalation" Formula',
      creator: 'Jimmy Donaldson (MrBeast)',
      retentionTarget: '75%+ at 30 seconds',
      rules: [
        'State the premise and show the visual climax in the first 2 seconds.',
        'Escalate the stakes every 90 seconds ($1 -> $100 -> $10,000 -> $1,000,000).',
        'Cut every sentence that does not directly advance the goal.',
        'Thumbnail must have max 3 visual elements: Face, Object, Bright Contrast.',
      ],
      bestFor: 'Challenges, Entertainment, Tech Unboxings, High-energy reviews',
    },
    {
      name: 'The Ali Abdaal "Evidence & Systems" Framework',
      creator: 'Ali Abdaal (Productivity)',
      retentionTarget: '65%+ evergreen long-tail',
      rules: [
        'Hook with a painful relatable friction point ("I used to waste 4 hours every morning").',
        'Present 3 actionable, numbered steps with personal honest testing.',
        'Use soft, high-quality audio (warm condenser mic, gentle lofi).',
        'End with an evergreen book or system recommendation.',
      ],
      bestFor: 'Productivity, Self-Improvement, Coding, Finance, Career tutorials',
    },
    {
      name: 'The Veritasium "Counter-Intuitive Truth" Model',
      creator: 'Derek Muller (Veritasium)',
      retentionTarget: '80%+ intellectual immersion',
      rules: [
        'Ask a question where everyone’s intuition is 100% wrong.',
        'Show people failing the intuition test in street interviews or live experiments.',
        'Reveal the deep underlying physics / mathematical / algorithmic reality.',
        'Deliver a philosophical "aha!" moment in the final 60 seconds.',
      ],
      bestFor: 'Science, Deep Tech, Coding architecture, AI breakdowns, History',
    },
    {
      name: 'The Hinglish "Hyper-Relatable" Indian Creator Wave',
      creator: 'Tech Burner / Dhruv Rathee / Ishan Sharma style',
      retentionTarget: '70%+ fast dopamine retention',
      rules: [
        'Mix colloquial Hindi with English technical terms ("Sabse crazy feature ye hai...").',
        'Sound effects every 4 seconds (funny meme pop-ups, animated arrows, zooms).',
        'Price-to-value comparison focus (Indian audiences love value for money).',
        'Friendly big-brother or peer advisory tone.',
      ],
      bestFor: 'Tech gadgets, Software, Daily AI hacks, Study tips, Career growth in India',
    },
  ];

  const thirtyDaySprint = [
    {
      phase: 'Phase 1 (Days 1-7)',
      title: 'Audience Gap & Competitive Forensics',
      tasks: [
        'Identify 5 creator channels in your niche and sort their videos by "Most Popular".',
        'Notice what topics broke their average view count by 5x.',
        'Draft 20 provocative titles and thumbnail sketches before writing a single word of script.',
      ],
    },
    {
      phase: 'Phase 2 (Days 8-14)',
      title: 'Retention Scripting & Hook Engineering',
      tasks: [
        'Use the YouTube AI Agent Scriptwriter to format 4 long-form and 8 YouTube Shorts scripts.',
        'Record 10 facial expressions for thumbnails in daylight/studio lights before shooting.',
        'Script verbal pattern interrupts every 30-45 seconds.',
      ],
    },
    {
      phase: 'Phase 3 (Days 15-22)',
      title: 'Fast Filming & Dynamic Edit Sprints',
      tasks: [
        'Batch film 2 long-form videos in one dedicated studio session.',
        'Edit with J-cuts and L-cuts to remove breath pauses and dead audio air.',
        'Export audio at -14 LUFS loudness standard for crisp YouTube volume.',
      ],
    },
    {
      phase: 'Phase 4 (Days 23-30)',
      title: 'Publishing, Studio SEO & Binge Loops',
      tasks: [
        'Upload with optimized Studio Tags (use our SEO Studio tool for 1-click tags).',
        'Pin an open-ended provocative question in the comment section within 2 minutes of release.',
        'Post 2 companion Shorts linking to the long-form video to seed the initial algorithm surge.',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Channel Scaling & Monetization Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            YouTube Algorithm Secrets & Growth Playbook
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Proven viral formulas, retention architecture, niche RPM monetization modeling, and a 30-day
            execution sprint roadmap to scale from 0 to 100K subscribers.
          </p>
        </div>
      </div>

      {/* Interactive YouTube Revenue & Metrics Simulator */}
      <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            YouTube Algorithm Revenue & Reach Calculator
          </h3>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60">
            2026 AdSense Estimates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sliders */}
          <div className="space-y-4 md:col-span-2">
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Target Video Views:</span>
                <span className="font-mono font-bold text-white">{views.toLocaleString()} views</span>
              </div>
              <input
                type="range"
                min="5000"
                max="1000000"
                step="5000"
                value={views}
                onChange={(e) => setViews(Number(e.target.value))}
                className="w-full accent-red-600 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Niche RPM (Revenue Per 1,000 Views in USD):</span>
                <span className="font-mono font-bold text-emerald-400">${nicheRpm.toFixed(1)} / 1K views</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25.0"
                step="0.5"
                value={nicheRpm}
                onChange={(e) => setNicheRpm(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>Gaming/Vlogs ($1-$3)</span>
                <span>Tech/Coding ($4-$8)</span>
                <span>Finance/Crypto ($12-$25)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Click-Through Rate (CTR):</span>
                <span className="font-mono font-bold text-amber-400">{clickThroughRate}%</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="18.0"
                step="0.5"
                value={clickThroughRate}
                onChange={(e) => setClickThroughRate(Number(e.target.value))}
                className="w-full accent-amber-500 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-zinc-500">Average is 4-5%; Great is 8-12%; Viral is 14%+</span>
            </div>
          </div>

          {/* Result Cards */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Estimated Video AdSense</span>
              <div className="text-3xl font-black text-emerald-400 mt-0.5">
                ${estimatedEarnings}
              </div>
              <span className="text-[11px] text-zinc-500">Excludes sponsors & affiliate sales</span>
            </div>

            <div className="border-t border-zinc-800 pt-2 space-y-1 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Impressions Served:</span>
                <span className="font-mono text-zinc-200">{estimatedImpressions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Est. New Subscribers:</span>
                <span className="font-mono text-zinc-200">+{estimatedSubscribers.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Viral Creator Blueprints */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          The 4 Proven Algorithmic Retention Blueprints
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {viralBlueprints.map((bp, idx) => (
            <div
              key={idx}
              className="bg-[#121418] border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-red-400 font-bold">{bp.creator}</span>
                <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded">
                  {bp.retentionTarget}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{bp.name}</h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {bp.rules.map((r, rIdx) => (
                  <li key={rIdx} className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                <span className="text-zinc-500">Best for:</span> {bp.bestFor}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Day Sprint Plan */}
      <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-red-500" />
          The 30-Day Channel Scaling Sprint (0 to 100K Playbook)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {thirtyDaySprint.map((phase, idx) => (
            <div key={idx} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase text-red-400 font-bold">
                {phase.phase}
              </span>
              <h5 className="text-xs font-bold text-white leading-snug">{phase.title}</h5>
              <ul className="space-y-1.5 text-[11px] text-zinc-400 pt-1">
                {phase.tasks.map((task, tIdx) => (
                  <li key={tIdx} className="flex items-start space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
