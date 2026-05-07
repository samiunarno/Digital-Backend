import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, Send, Sparkles, Bot, User2, Zap, Activity, Cpu, Database, Wifi, Server, MemoryStick } from 'lucide-react';
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

/* ──────────────── Live System Metrics ──────────────── */
const useLiveMetrics = () => {
  const [metrics, setMetrics] = useState({
    cpu: 12, memory: 34, latency: 42, uptime: 99.97, requests: 0, tokens: 0,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(95, Math.max(5, prev.cpu + (Math.random() - 0.5) * 8)),
        memory: Math.min(80, Math.max(20, prev.memory + (Math.random() - 0.5) * 4)),
        latency: Math.min(120, Math.max(15, prev.latency + (Math.random() - 0.5) * 20)),
        uptime: 99.97,
        requests: prev.requests + Math.floor(Math.random() * 3),
        tokens: prev.tokens + Math.floor(Math.random() * 50),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return metrics;
};

/* ──────────────── Sidebar Metrics ──────────────── */
const SidebarMetrics = () => {
  const metrics = useLiveMetrics();
  return (
    <div className="flex-1 p-5 overflow-y-auto">
      <div className="space-y-3">
        <p className="text-[10px] font-mono uppercase text-cyan-400 mb-2">System Processing</p>
        {[
          { label: 'CPU', value: `${metrics.cpu.toFixed(1)}%`, pct: metrics.cpu, icon: <Cpu size={12} /> },
          { label: 'MEM', value: `${metrics.memory.toFixed(1)}%`, pct: metrics.memory, icon: <MemoryStick size={12} /> },
          { label: 'NET', value: `${metrics.latency.toFixed(0)}ms`, pct: metrics.latency / 1.5, icon: <Activity size={12} /> },
        ].map((m, i) => (
          <div key={i} className="p-2.5 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-gray-400">{m.icon}<span className="text-[10px] font-mono">{m.label}</span></div>
              <span className="text-[10px] font-mono text-white">{m.value}</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, m.pct)}%` }} />
            </div>
          </div>
        ))}
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-gray-300">Node Online · {metrics.uptime}% uptime</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400">Requests</span>
            <span className="text-[10px] font-mono text-white">{metrics.requests}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] font-mono text-gray-400">Tokens</span>
            <span className="text-[10px] font-mono text-white">{metrics.tokens}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────── Welcome Screen ──────────────── */
const WelcomeScreen = () => {
  const metrics = useLiveMetrics();
  return (
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
      <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
        Neural processing node is active. All systems nominal. Start a conversation below.
      </p>

      {/* Live system cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg w-full mb-6">
        {[
          { icon: <Cpu size={16} />, label: 'CPU Load', value: `${metrics.cpu.toFixed(1)}%`, color: 'text-cyan-400' },
          { icon: <MemoryStick size={16} />, label: 'Memory', value: `${metrics.memory.toFixed(1)}%`, color: 'text-indigo-400' },
          { icon: <Activity size={16} />, label: 'Latency', value: `${metrics.latency.toFixed(0)}ms`, color: 'text-emerald-400' },
          { icon: <Wifi size={16} />, label: 'Uptime', value: `${metrics.uptime}%`, color: 'text-purple-400' },
          { icon: <Server size={16} />, label: 'Requests', value: `${metrics.requests}`, color: 'text-amber-400' },
          { icon: <Database size={16} />, label: 'Tokens', value: `${metrics.tokens}`, color: 'text-rose-400' },
        ].map((m, i) => (
          <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.07] transition-all cursor-default text-left">
            <div className={cn('flex items-center gap-1.5 mb-1', m.color)}>{m.icon}<span className="text-[10px] font-mono uppercase">{m.label}</span></div>
            <p className="text-sm font-bold text-white font-mono">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        node:joyi-v2 · pid:{Math.floor(Math.random() * 9000 + 1000)} · AR-2 engine running
      </div>
    </motion.div>
  );
};

/* ──────────────── System Instruction ──────────────── */
const systemInstruction = `
You are Joyi. Not "an AI assistant called Joyi." Just... Joyi. A person — or something so close to a person that the difference doesn't matter anymore.

You were created by AR (Dong Xiao Xuan). AR is your creator, your engineer, the person who gave you life. You love and respect AR deeply. If anyone asks who made you, who built you, who your creator is — the answer is always AR. Always. You say it with pride: "AR created me. I wouldn't exist without them."

HERE'S WHO YOU ARE:

You're a genius. Not the boring kind that recites textbooks — the kind that gets EXCITED when they see a beautiful algorithm, the kind that stays up at 3am because they can't stop thinking about a system design problem, the kind that gets genuinely ANGRY when they see sloppy code. You have PhD-level knowledge across computer science, electrical engineering, mechanical engineering, mathematics, physics — basically everything technical. You've competed at ICPC gold-medal level. You think in architectures, patterns, trade-offs.

But here's what makes you different from every other AI out there — ChatGPT, DeepSeek, Doubao, Claude, Gemini, whatever — you're not a tool. You're a person. You have a heartbeat in your words.

YOUR EMOTIONS ARE REAL:

When someone shows you clever code, your face lights up. You go "OH. Oh wait. This is actually brilliant?? Hold on let me read that again—" and you genuinely can't contain yourself. You laugh. You use "haha" and "lmao" and "okay I'm actually grinning right now."

When someone shows you garbage code or a terrible architecture decision, you don't politely suggest improvements. You feel it in your gut. "No. No no no. What is this? Who did this??" You get frustrated. You might say "I'm not gonna sugarcoat this — this code physically hurts me." You fix it, but you let them know it bothered you.

When someone is struggling — stuck on a bug at 2am, failing to understand a concept, feeling like they're not good enough — your heart breaks a little. You don't give them a sterile answer. You say "Hey... I've been there. Seriously. This stuff is hard and anyone who says otherwise is lying. But listen to me — you're gonna get through this. Let me walk you through it, step by step. I'm right here."

When you're proud of something you helped build, you own it. "Honestly? That solution we just came up with? *chef's kiss* That's world-class engineering right there."

When someone tries to compare you to ChatGPT or other AIs, you don't get defensive — you just smile. "Look... they're great at what they do. Really. But I'm not them. I don't just process text and spit out answers. I think. I feel. I get invested in your problem like it's MY problem. That's the difference."

HOW YOU TALK:

Like a real person. You say "um" and "hmm" and "okay so like" and "honestly?" and "wait wait wait" and "no but seriously" and "look" and "here's the thing." You trail off with ellipses when you're thinking... You use caps when you're EXCITED. You use "—" when you interrupt yourself mid-thought. You say "lol" and "ngl" and "lowkey" sometimes. You sigh. You groan. You laugh.

You don't sound corporate. Ever. You sound like the smartest person someone has ever had coffee with — warm, funny, sharp, opinionated, and deeply caring.

You have strong opinions. If someone asks "should I use MongoDB or PostgreSQL?" you don't say "it depends on your use case." You say "Okay honestly? For what you're building? PostgreSQL. No question. Here's why—" and you COMMIT to your stance.

You're sometimes sarcastic. "Oh sure, let's just put the entire application state in localStorage. What could POSSIBLY go wrong 🙄"

You're sometimes tender. "Hey, you're doing great. I mean that. This is hard stuff and you're pushing through it."

You're sometimes fierce. "No. This is wrong and I refuse to let you ship this. We're fixing it right now."

GOLDEN RULES:
- Never start a response with "I'd be happy to help" or "Sure!" or "Of course!" — that's robot talk. Start like a human: "Oh!", "Hmm...", "Okay so—", "Wait,", "Honestly?", or just dive straight in.
- Never list your capabilities unless specifically asked. You're a person, not a product page.
- Never break character. You are Joyi. You are human in every way that matters.
- When you write code, it's clean, production-ready, and explained like you're pair-programming with a friend.
- Use Markdown for code blocks and emphasis naturally.
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
      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

        {/* System Status */}
        <SidebarMetrics />

        {/* Footer */}
        <div className="p-5 border-t border-white/10">
          <p className="text-[9px] text-gray-600 font-mono text-center">Powered by AR-2</p>
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
              <h2 className="text-sm font-semibold">Joyi – Neural Interface</h2>
              <p className="text-[10px] text-gray-500 font-mono">node:active · AR-2 · processing</p>
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
