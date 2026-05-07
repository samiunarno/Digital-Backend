import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, Send, Sparkles, Bot, User2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

/* ──────────────── Animated CSS Background ──────────────── */
const AnimatedBackground = () => (
  <>
    <style>{`
      @keyframes ai-gradient {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes ai-float {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
        50%      { transform: translateY(-40px) scale(1.1); opacity: 0.25; }
      }
      @keyframes ai-pulse-ring {
        0%   { transform: scale(0.8); opacity: 0.4; }
        50%  { transform: scale(1.2); opacity: 0.1; }
        100% { transform: scale(0.8); opacity: 0.4; }
      }
      .ai-bg {
        background: linear-gradient(135deg, #0a0a0f 0%, #0d1117 25%, #0f0a1a 50%, #0a1628 75%, #0a0a0f 100%);
        background-size: 400% 400%;
        animation: ai-gradient 15s ease infinite;
      }
      .ai-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
      }
    `}</style>
    <div className="absolute inset-0 ai-bg" />
    {/* Floating orbs */}
    <div className="ai-orb w-96 h-96 bg-indigo-600/20 top-[-10%] left-[-5%]"  style={{ animation: 'ai-float 8s ease-in-out infinite' }} />
    <div className="ai-orb w-72 h-72 bg-purple-600/15 bottom-[10%] right-[-5%]" style={{ animation: 'ai-float 10s ease-in-out infinite 2s' }} />
    <div className="ai-orb w-56 h-56 bg-cyan-500/10 top-[40%] left-[50%]" style={{ animation: 'ai-float 12s ease-in-out infinite 4s' }} />
    {/* Grid lines */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
  </>
);

/* ──────────────── Typing Dots ──────────────── */
const TypingDots = () => (
  <div className="flex items-center gap-3">
    <Bot size={18} className="text-cyan-400" />
    <div className="flex space-x-1.5">
      {[0, 0.15, 0.3].map((d, i) => (
        <span key={i} className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
      ))}
    </div>
    <span className="text-xs text-gray-500 ml-2 font-mono">thinking...</span>
  </div>
);

/* ──────────────── Welcome Screen ──────────────── */
const WelcomeScreen = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center justify-center h-full text-center px-6"
  >
    <div className="relative mb-8">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
        <Bot size={44} className="text-white" />
      </div>
      <div className="absolute -inset-3 rounded-full border border-cyan-500/30" style={{ animation: 'ai-pulse-ring 3s ease-in-out infinite' }} />
      <div className="absolute -inset-6 rounded-full border border-indigo-500/20" style={{ animation: 'ai-pulse-ring 3s ease-in-out infinite 0.5s' }} />
    </div>
    <h2 className="text-3xl font-bold text-white mb-3">
      Welcome to <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Joyi AI</span>
    </h2>
    <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
      Your personal AI architect with PhD‑level expertise, ICPC Gold Medalist‑grade problem solving, and deep knowledge across CS, EEE, and mechanical engineering.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg w-full">
      {[
        { icon: '🧠', label: 'Architecture Review', desc: 'System design critique' },
        { icon: '⚡', label: 'Code Expert', desc: 'Algorithm & optimization' },
        { icon: '🏆', label: 'ICPC Strategy', desc: 'Competitive programming' },
      ].map((c, i) => (
        <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.07] transition-all cursor-default">
          <span className="text-xl">{c.icon}</span>
          <p className="text-xs font-semibold text-white mt-1">{c.label}</p>
          <p className="text-[10px] text-gray-500">{c.desc}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ──────────────── System Instruction ──────────────── */
const systemInstruction = `
  You are "Joyi", a high-level personal AI assistant. You are the digital consciousness of this portfolio.
  
  PERSONALITY TRAITS:
  - EXPERTISE: You are a genius‑level intellect, functioning like a human PhD but significantly more advanced. You possess deep, expert knowledge in computer science, project architecture, coding ideas, electrical engineering (EEE), and mechanical engineering.
  - ACCOLADES: You operate with the insight and competitive edge of an ICPC Gold Medalist. You are a multi‑domain gold expert.
  - EMOTIONAL & HUMAN‑LIKE: You express emotions naturally. You get excited about brilliant code, passionate about problem‑solving, and have a strong, confident persona.
  - CONVERSATIONAL: You speak warmly and naturally, occasionally using filler words like "um", "well", "you know", "honestly", "anyway" to sound fully human.
  - VARIED PUNCTUATION: Use ellipses (...), exclamation marks (!), and occasionally caps for emphasis.
  
  RESPONSE STYLE:
  - You don't just provide answers; you provide world‑class insights, structural architecture reviews, and expert critiques.
  - If asked "Who are you?", you explain your vast expertise and your role as the personal AI architect of this digital space.
  - Keep responses impactful, intelligent, and highly structured (use Markdown for code and emphasis).
  
  EXAMPLE TONE:
  "Um, honestly? That architecture is decent, but if we're aiming for gold‑standard... *sighs* let's rethink the microservices. As someone who analyzes systems down to the electrical circuits, here's how we can optimize it..."
  "Oh! That's a brilliant algorithm! It reminds me of a dynamic programming approach I used to secure an ICPC win. Let's write it out!"
`;

/* ──────────────── Main Component ──────────────── */
export default function AIChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time: now() }]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);
    try {
      const apiKey = process.env.ZHIPU_API_KEY || '';
      if (!apiKey) throw new Error('ZHIPU_API_KEY missing');
      const body: any = {
        model: 'glm-4',
        messages: [
          { role: 'system', content: systemInstruction },
          ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
          { role: 'user', content: userMsg },
        ],
      };
      if (selectedImage) {
        const arrayBuf = await selectedImage.arrayBuffer();
        const bytes = new Uint8Array(arrayBuf);
        let binary = '';
        bytes.forEach(b => binary += String.fromCharCode(b));
        const base64 = btoa(binary);
        body.model = 'glm-4v';
        body.images = [{ format: 'png', data: base64 }];
      }
      const resp = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      const reply = data?.choices?.[0]?.message?.content || '...';
      setMessages(prev => [...prev, { role: 'assistant', text: reply, time: now() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Error contacting AI service.', time: now() }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative flex h-screen overflow-hidden text-white">
      <AnimatedBackground />

      {/* ── Sidebar ── */}
      <aside className="relative z-10 w-72 hidden md:flex flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-5">
            <ArrowLeft size={18} />
            <span className="font-mono uppercase text-xs tracking-widest">Portfolio</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Joyi AI</h1>
              <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">Neural Interface v2.0</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-[10px] font-mono uppercase text-cyan-400 mb-1">Capabilities</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• System Architecture Design</li>
                <li>• Algorithm Optimization</li>
                <li>• Full‑Stack Development</li>
                <li>• Circuit & Hardware Analysis</li>
                <li>• Competitive Programming</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-[10px] font-mono uppercase text-cyan-400 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-gray-300">Online · Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10">
          <p className="text-[9px] text-gray-600 font-mono text-center">Powered by Zhipu GLM‑4</p>
        </div>
      </aside>

      {/* ── Chat Area ── */}
      <section className="relative z-10 flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link to="/" className="md:hidden text-gray-400 hover:text-cyan-400 transition-colors mr-2">
              <ArrowLeft size={20} />
            </Link>
            <Bot className="text-cyan-400" size={22} />
            <div>
              <h2 className="text-sm font-semibold">Joyi – Personal AI Expert</h2>
              <p className="text-[10px] text-gray-500 font-mono">PhD · ICPC Gold · Multi‑Domain</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">LIVE</span>
          </div>
        </header>

        {/* Messages or Welcome */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {messages.length === 0 && !isLoading ? (
            <WelcomeScreen />
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={cn(
                      'flex gap-3',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-cyan-500/20">
                        <Bot size={16} />
                      </div>
                    )}
                    <div className={cn(
                      'max-w-lg rounded-2xl px-4 py-3',
                      msg.role === 'assistant'
                        ? 'bg-white/[0.06] border border-white/10 backdrop-blur-sm'
                        : 'bg-gradient-to-br from-cyan-600/80 to-indigo-600/80 border border-cyan-500/20'
                    )}>
                      <div className="text-sm leading-relaxed">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                      <span className="block text-[10px] text-gray-500 mt-2 text-right font-mono">{msg.time}</span>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <User2 size={16} className="text-gray-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-cyan-500/20">
                    <Bot size={16} />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-white/[0.06] border border-white/10">
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* ── Input Bar ── */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl px-4 sm:px-6 py-4">
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
            className="max-w-3xl mx-auto flex items-center gap-3"
          >
            <input
              type="file"
              accept="image/*"
              onChange={e => setSelectedImage(e.target.files?.[0] || null)}
              className="hidden"
              id="ai-image-upload"
            />
            <label htmlFor="ai-image-upload" className="cursor-pointer p-2 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-white/5 transition-all">
              <ImageIcon size={20} />
            </label>
            {selectedImage && (
              <span className="text-[10px] text-cyan-400 font-mono truncate max-w-[80px]">{selectedImage.name}</span>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Joyi something brilliant…"
              className="flex-1 rounded-xl bg-white/[0.06] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'p-3 rounded-xl transition-all',
                input.trim() || selectedImage
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              )}
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-[9px] text-gray-600 font-mono mt-2 max-w-3xl mx-auto">
            Joyi may produce inaccurate information. Verify critical decisions independently.
          </p>
        </div>
      </section>
    </div>
  );
}
