import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Copy, Check, RefreshCw, Zap, TrendingUp, Flame, PlayCircle } from 'lucide-react';
import { ChatMessage, LanguageMode } from '../types';
import { sendChatMessage } from '../services/api';

interface AgentChatProps {
  language: LanguageMode;
  onSendToScriptwriter?: (topic: string) => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({ language, onSendToScriptwriter }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        language === 'hinglish'
          ? `Namaste Creator! 🔥 Main hoon aapka **YouTube AI Agent Studio Co-Pilot**.\n\nAap mujhe apne YouTube channel ke baare mein kuch bhi puch sakte hain:\n- 🚀 **Viral Video Ideas & Hooks**\n- 🎯 **High CTR Titles & Thumbnail Strategy**\n- ⏱️ **Audience Retention & Pacing Secrets (MrBeast style)**\n- 📈 **0 se 100K Subscribers Roadmap**\n\nNiche koi bhi topic bataiye ya niche diye quick prompts me se click kijiye!`
          : language === 'hi'
          ? `नमस्ते क्रिएटर! 🔥 मैं आपका **YouTube AI Agent Studio Co-Pilot** हूँ।\n\nआप मुझसे अपने यूट्यूब चैनल के लिए कुछ भी पूछ सकते हैं:\n- 🚀 **वायरल वीडियो आइडिया और हुक्स**\n- 🎯 **हाई CTR टाइटल्स और थंबनेल स्ट्रैटेजी**\n- ⏱️ **ऑडियंस रिटेंशन और पेसिंग सीक्रेट्स**\n- 📈 **0 से 100K सब्सक्राइबर्स का रोडमैप**\n\nअपना सवाल लिखें या नीचे दिए गए क्विक प्रॉम्ट्स चुनें!`
          : `Hello Creator! 🔥 I am your dedicated **YouTube AI Agent Studio Co-Pilot**.\n\nI can help you dominate the YouTube algorithm in 2026:\n- 🚀 **Viral Video Ideas & 3-Second Hooks**\n- 🎯 **15%+ CTR Title & Thumbnail Formulations**\n- ⏱️ **Audience Retention Curves & Pacing (MrBeast / Veritasium methods)**\n- 📈 **0 to 100K Subscribers Playbook**\n\nDrop your video topic or pick a prompt below to get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [persona, setPersona] = useState<'mrbeast' | 'strategist' | 'shorts' | 'growth'>('mrbeast');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personas = [
    {
      id: 'mrbeast',
      name: 'Viral Master',
      sub: 'MrBeast Pacing & Hooks',
      icon: Flame,
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
    {
      id: 'strategist',
      name: 'Deep Essayist',
      sub: 'Ali Abdaal / Veritasium',
      icon: Sparkles,
      color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
    },
    {
      id: 'shorts',
      name: 'Shorts Hacker',
      sub: 'Viral Loop & Trends',
      icon: Zap,
      color: 'text-red-400 border-red-500/40 bg-red-500/10',
    },
    {
      id: 'growth',
      name: 'Algorithm Coach',
      sub: 'CTR & Subscriber Scaling',
      icon: TrendingUp,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    },
  ];

  const quickPrompts = [
    {
      label: '🚀 Viral AI Video Idea',
      prompt: 'Mujhe AI tools niche mein 3 viral long-form video concepts do with killer 3-second hooks and thumbnail ideas.',
    },
    {
      label: '⏱️ Retention Fix',
      prompt: 'Mere videos me first 30 seconds me 50% audience drop ho jaati hai. Isse fix karne ke liye 4 strict rules batao.',
    },
    {
      label: '⚡ 60s Shorts Script',
      prompt: 'Write an irresistible 60-second YouTube Shorts script about "The 1% Secret of High Earners" with visual cues.',
    },
    {
      label: '🎯 12% CTR Title Formulas',
      prompt: 'Give me 5 proven psychological title frameworks that guarantee 10%+ CTR on YouTube in 2026.',
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage({
        messages: apiMessages,
        persona,
        language,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Oops! Agent se connect karne me problem aayi: ${err.message}. Please try again!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init-fresh',
        role: 'assistant',
        content: 'New chat session started! What YouTube project are we conquering today? 🚀',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto">
      {/* Persona Bar */}
      <div className="bg-[#121418] border border-zinc-800 rounded-xl p-3 mb-3 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-red-500" /> Select AI Agent Persona:
          </span>
          <button
            onClick={clearChat}
            className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 hover:underline transition-all"
          >
            <RefreshCw className="w-3 h-3" /> Reset Chat
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = persona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPersona(p.id as any)}
                className={`flex items-center space-x-2.5 p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? `${p.color} ring-1 ring-white/10`
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white/10' : 'bg-zinc-800'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold leading-tight truncate text-zinc-200">{p.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{p.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2 scrollbar-thin scrollbar-thumb-zinc-700">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-zinc-700 text-zinc-200'
                    : 'bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-red-600/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${
                  isUser
                    ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-tr-none'
                    : 'bg-[#181a20] border border-zinc-800 text-zinc-100 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-normal">
                  {msg.content}
                </div>

                {/* Footer bar on message */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] text-zinc-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#181a20] border border-zinc-800 rounded-2xl p-3.5 rounded-tl-none flex items-center space-x-2 text-zinc-400 text-xs">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]"></div>
              <span className="text-zinc-300 font-mono text-[11px] ml-1">Agent thinking & analyzing algorithm trends...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="py-2 overflow-x-auto flex space-x-2 scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={loading}
            className="shrink-0 text-xs bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-[#121418] border border-zinc-800 rounded-xl p-2.5 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'hinglish'
                ? 'Ask anything (e.g., "Mera tech channel grow nahi ho raha, kya karu?", "Viral hook for crypto video")...'
                : language === 'hi'
                ? 'कुछ भी पूछें (उदा. "मेरे टेक चैनल के लिए वायरल हुक क्या होगा?")...'
                : 'Ask the YouTube Agent (e.g. "Create 5 viral video titles for coding tutorials")...'
            }
            disabled={loading}
            className="flex-1 bg-zinc-900 border border-zinc-700/60 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white p-2.5 rounded-lg font-medium shadow-md transition-all flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
