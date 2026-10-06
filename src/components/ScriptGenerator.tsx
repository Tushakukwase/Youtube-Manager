import React, { useState } from 'react';
import { Film, Sparkles, Copy, Check, Download, Clock, Video, Volume2, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { VideoScript, LanguageMode } from '../types';
import { generateScript } from '../services/api';

interface ScriptGeneratorProps {
  language: LanguageMode;
  initialTopic?: string;
  onSendToTitles?: (topic: string) => void;
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({
  language,
  initialTopic = '',
  onSendToTitles,
}) => {
  const [topic, setTopic] = useState(initialTopic || 'How to Build an AI App with No Coding');
  const [format, setFormat] = useState('long-form'); // 'long-form' | 'shorts' | 'tutorial' | 'storytelling'
  const [tone, setTone] = useState('high-energy'); // 'high-energy' | 'documentary' | 'humorous' | 'educational'
  const [duration, setDuration] = useState('8-10 mins');
  const [niche, setNiche] = useState('Tech & Coding');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'screenplay' | 'table' | 'production'>('screenplay');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please provide a video topic or concept.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await generateScript({
        topic,
        format,
        tone,
        language,
        targetDuration: format === 'shorts' ? '60 seconds' : duration,
        channelNiche: niche,
      });
      setScript(res.script);
    } catch (err: any) {
      setError(err.message || 'Script generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyFullScript = () => {
    if (!script) return;
    let fullText = `# ${script.title}\n\n`;
    fullText += `## THE 3-SECOND HOOK\n`;
    fullText += `Spoken: "${script.hook.first3Seconds}"\n`;
    fullText += `Visual: ${script.hook.visualHook}\n`;
    fullText += `Sound Effect: ${script.hook.soundEffect}\n`;
    fullText += `Retention Promise: ${script.hook.retentionPromise}\n\n`;
    fullText += `## SCRIPT SCENES\n\n`;

    script.scenes.forEach((scene) => {
      fullText += `### Scene ${scene.sceneNumber}: ${scene.sectionName} (${scene.timeCode})\n`;
      fullText += `[VISUAL]: ${scene.visualDirection}\n`;
      fullText += `[ON-SCREEN TEXT]: ${scene.onScreenText}\n`;
      fullText += `[AUDIO/SFX]: ${scene.soundEffects}\n`;
      fullText += `[DIALOGUE]:\n${scene.spokenDialogue}\n`;
      fullText += `[B-ROLL]: ${scene.bRollIdea}\n\n`;
    });

    fullText += `## OUTRO & BINGE CTA\n`;
    fullText += `${script.callToAction.verbalCTA}\n`;
    fullText += `End Screen Hook: ${script.callToAction.endScreenHook}\n`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    if (!script) return;
    const blob = new Blob([JSON.stringify(script, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title.replace(/[^a-zA-Z0-9]/g, '_')}_script.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Control Box */}
      <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>AI Retention Screenwriter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Generate High-Retention YouTube Scripts
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Engineered with MrBeast-level pacing, visual interrupts every 4 seconds, spoken dialogue,
            sound design cues, and irresistible 3-second hooks.
          </p>
        </div>

        {/* Form Inputs */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              Video Topic or Core Premise
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 7 AI Tools That Replace a $50k Developer in 2026..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Format */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="long-form">🎬 Long-Form Video (8-12m)</option>
                <option value="shorts">⚡ YouTube Shorts / Reels (60s)</option>
                <option value="tutorial">💻 Step-by-Step Tutorial</option>
                <option value="storytelling">📖 Narrative & Documentary</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Tone & Vibe
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="high-energy">🔥 High-Energy (Fast & Punchy)</option>
                <option value="documentary">☕ Calm & Thoughtful (Ali Abdaal)</option>
                <option value="humorous">😄 Entertaining & Relatable</option>
                <option value="educational">🎓 Deep Technical & Clear</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Duration Target
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={format === 'shorts'}
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
              >
                <option value="5-7 mins">5 - 7 Minutes (Quick hit)</option>
                <option value="8-10 mins">8 - 10 Minutes (Mid-roll optimal)</option>
                <option value="12-15 mins">12 - 15 Minutes (Deep dive)</option>
                <option value="20+ mins">20+ Minutes (Masterclass)</option>
              </select>
            </div>

            {/* Niche */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Channel Niche
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="Tech, Finance, Gaming..."
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 shadow-lg shadow-red-600/30 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Screenwriting In Progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Full Production Script</span>
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

      {/* Generated Script Display */}
      {script && (
        <div className="space-y-6">
          {/* Script Header Bar */}
          <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-red-400 font-bold">
                {format === 'shorts' ? '⚡ 60-Second Short Script' : '🎬 Long-Form Production Script'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {script.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                {script.structureSummary}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={copyFullScript}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Script</span>
                  </>
                )}
              </button>
              <button
                onClick={downloadScript}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-2 rounded-xl text-xs transition-all cursor-pointer"
                title="Download JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              {onSendToTitles && (
                <button
                  onClick={() => onSendToTitles(script.title)}
                  className="bg-red-600/90 hover:bg-red-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>Titles & Thumbnails</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3-Second Viral Hook Card */}
          <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <h4 className="text-base font-bold text-white tracking-wide">
                  The Critical First 3 Seconds (Hook Blueprint)
                </h4>
              </div>
              <span className="text-xs font-mono text-red-300 bg-red-900/40 px-2.5 py-0.5 rounded border border-red-500/30">
                70%+ Retention Target
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl">
                <div className="font-semibold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Exact Spoken Hook
                </div>
                <p className="text-zinc-200 italic font-medium">"{script.hook.first3Seconds}"</p>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl">
                <div className="font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> Visual Action & Prop
                </div>
                <p className="text-zinc-300">{script.hook.visualHook}</p>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl">
                <div className="font-semibold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Sound Effect Cue
                </div>
                <p className="text-zinc-300">{script.hook.soundEffect}</p>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl">
                <div className="font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Payoff Promise
                </div>
                <p className="text-zinc-300">{script.hook.retentionPromise}</p>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2">
            <button
              onClick={() => setActiveView('screenplay')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'screenplay'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Screenplay View
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'table'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Timeline Breakdown
            </button>
            <button
              onClick={() => setActiveView('production')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'production'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Production Checklist
            </button>
          </div>

          {/* Screenplay View */}
          {activeView === 'screenplay' && (
            <div className="space-y-4">
              {script.scenes.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="bg-[#121418] border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold bg-zinc-800 text-red-400 px-2 py-0.5 rounded">
                        SCENE {scene.sceneNumber}
                      </span>
                      <span className="text-sm font-bold text-white">{scene.sectionName}</span>
                    </div>
                    <span className="font-mono text-xs text-zinc-400">{scene.timeCode}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/60">
                    <div>
                      <span className="text-zinc-400 font-semibold block uppercase tracking-wider text-[10px]">
                        Visual Direction:
                      </span>
                      <span className="text-zinc-200">{scene.visualDirection}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-semibold block uppercase tracking-wider text-[10px]">
                        On-Screen Graphic / Text:
                      </span>
                      <span className="text-amber-300 font-mono font-medium">{scene.onScreenText}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-semibold block uppercase tracking-wider text-[10px]">
                        Audio / SFX:
                      </span>
                      <span className="text-indigo-300">{scene.soundEffects}</span>
                    </div>
                  </div>

                  {/* Spoken Dialogue */}
                  <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Spoken Script (Creator):
                    </span>
                    <p className="text-sm text-zinc-100 whitespace-pre-line leading-relaxed font-normal">
                      {scene.spokenDialogue}
                    </p>
                  </div>

                  {/* B-Roll Suggestion */}
                  <div className="text-xs text-zinc-400 flex items-center space-x-2 pt-1">
                    <span className="font-semibold text-zinc-300">Suggested B-Roll:</span>
                    <span>{scene.bRollIdea}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline Table View */}
          {activeView === 'table' && (
            <div className="bg-[#121418] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase font-mono text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Time</th>
                      <th className="p-3">Section</th>
                      <th className="p-3">Spoken Dialogue</th>
                      <th className="p-3">Visual / B-Roll</th>
                      <th className="p-3">Audio FX</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {script.scenes.map((s) => (
                      <tr key={s.sceneNumber} className="hover:bg-zinc-900/40">
                        <td className="p-3 font-mono text-red-400 whitespace-nowrap">{s.timeCode}</td>
                        <td className="p-3 font-semibold text-white whitespace-nowrap">{s.sectionName}</td>
                        <td className="p-3 max-w-xs">{s.spokenDialogue}</td>
                        <td className="p-3 max-w-xs text-zinc-400">{s.visualDirection} • {s.bRollIdea}</td>
                        <td className="p-3 text-indigo-300 whitespace-nowrap">{s.soundEffects}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Production Checklist */}
          {activeView === 'production' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Filming & Pre-Production Checklist
                </h4>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {script.productionChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#121418] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> Retention Hacks & Outro Bridge
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <span className="font-semibold text-red-400 block mb-1">Verbal Call-To-Action:</span>
                    <p className="text-zinc-200">{script.callToAction.verbalCTA}</p>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <span className="font-semibold text-amber-400 block mb-1">End Screen Loop Hook:</span>
                    <p className="text-zinc-200">{script.callToAction.endScreenHook}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
