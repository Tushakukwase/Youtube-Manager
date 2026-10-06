import React, { useState } from 'react';
import { Header } from './components/Header';
import { AgentChat } from './components/AgentChat';
import { VideoAnalyzer } from './components/VideoAnalyzer';
import { ScriptGenerator } from './components/ScriptGenerator';
import { TitleThumbnailLab } from './components/TitleThumbnailLab';
import { SeoGenerator } from './components/SeoGenerator';
import { GrowthStrategy } from './components/GrowthStrategy';
import { LanguageMode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [language, setLanguage] = useState<LanguageMode>('hinglish');

  // Shared state across tools
  const [activeTopic, setActiveTopic] = useState<string>('');
  const [activeTitle, setActiveTitle] = useState<string>('');

  const handleSendToScript = (topic: string) => {
    setActiveTopic(topic);
    setActiveTab('script');
  };

  const handleSendToTitles = (topic: string) => {
    setActiveTopic(topic);
    setActiveTab('titles');
  };

  const handleSendToSeo = (title: string, topic: string) => {
    setActiveTitle(title);
    setActiveTopic(topic);
    setActiveTab('seo');
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] opacity-70"></div>
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[120px] opacity-50"></div>
      </div>

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chat' && (
          <AgentChat
            language={language}
            onSendToScriptwriter={handleSendToScript}
          />
        )}

        {activeTab === 'analyze' && (
          <VideoAnalyzer
            language={language}
            onSelectTopicForScript={handleSendToScript}
          />
        )}

        {activeTab === 'script' && (
          <ScriptGenerator
            language={language}
            initialTopic={activeTopic}
            onSendToTitles={handleSendToTitles}
          />
        )}

        {activeTab === 'titles' && (
          <TitleThumbnailLab
            language={language}
            initialTopic={activeTopic}
            onSendToSeo={handleSendToSeo}
          />
        )}

        {activeTab === 'seo' && (
          <SeoGenerator
            language={language}
            initialTitle={activeTitle}
            initialTopic={activeTopic}
          />
        )}

        {activeTab === 'growth' && (
          <GrowthStrategy
            language={language}
            onSelectTopic={handleSendToScript}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-[#0d0f12]/80 backdrop-blur-md py-4 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>YouTube AI Agent Studio — Built for high retention and 100K+ creator channels</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-zinc-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Hinglish & Hindi Native</span>
            <span>•</span>
            <span>Real-time Algorithm Analysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
