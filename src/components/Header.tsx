import React from 'react';
import { Youtube, Sparkles, Wand2, Compass, Film, Hash, MessageSquare, Bot } from 'lucide-react';
import { LanguageMode } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
}) => {
  const tabs = [
    { id: 'chat', label: 'AI Agent Chat', icon: Bot, badge: 'Live' },
    { id: 'analyze', label: 'Video Analyzer', icon: Compass, badge: 'URL/ID' },
    { id: 'script', label: 'Viral Scriptwriter', icon: Film, badge: 'Long & Shorts' },
    { id: 'titles', label: 'Titles & Thumbnails', icon: Wand2, badge: 'CTR Lab' },
    { id: 'seo', label: 'SEO & Studio Tags', icon: Hash, badge: 'Rank #1' },
    { id: 'growth', label: 'Growth Strategies', icon: Sparkles, badge: 'Secrets' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0d0f12]/95 backdrop-blur-md border-b border-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Agent Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 shadow-lg shadow-red-600/30">
              <Youtube className="w-6 h-6 text-white fill-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  YouTube AI Agent
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full uppercase tracking-wider">
                  Studio Pro
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Viral Algorithm Intelligence & Content Co-Pilot
              </p>
            </div>
          </div>

          {/* Language Selector & Status */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-zinc-900 border border-zinc-700/80 rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('hinglish')}
                className={`px-2.5 py-1 rounded transition-all font-medium ${
                  language === 'hinglish'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Hinglish (Hindi in English letters)"
              >
                🇮🇳 Hinglish
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded transition-all font-medium ${
                  language === 'hi'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="हिन्दी (Hindi Script)"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-all font-medium ${
                  language === 'en'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="English (Global)"
              >
                🌐 English
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono">Gemini 3.8 Flash Online</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-zinc-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                      isActive
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
