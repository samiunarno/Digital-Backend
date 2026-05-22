import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, Send, Sparkles, Bot, User2, Zap, Activity, Cpu, Database, Wifi, Server, MemoryStick, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils'; // Make sure this path exists
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion'; // Fixed import

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

/* ──────────────── Copy Button ──────────────── */
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-500 hover:text-cyan-400 transition-colors font-mono group"
    >
      {copied ? (
        <><Check size={12} className="text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
      ) : (
        <><Copy size={12} className="group-hover:text-cyan-400" /><span>Copy</span></>
      )}
    </button>
  );
};

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
const systemInstruction = `...`; // Your system instruction content here (truncated for brevity)

/* ──────────────── Main Component ──────────────── */
export default function AIChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([]);
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  type ChatThread = {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    messages: Array<{ role: 'user' | 'assistant'; text: string; time: string }>;
  };

  const storageKey = 'joyi-ai-threads-v1';
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load threads from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatThread[];
      if (Array.isArray(parsed)) {
        setThreads(parsed);
        if (parsed.length > 0) {
          setActiveThreadId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Update messages when active thread changes
  useEffect(() => {
    if (!activeThreadId) return;
    const thread = threads.find(t => t.id === activeThreadId);
    if (!thread) return;
    setMessages(thread.messages);
  }, [activeThreadId, threads]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const persistThreads = (next: ChatThread[]) => {
    setThreads(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const createNewThread = () => {
    const id = `chat_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const newThread: ChatThread = {
      id,
      title: 'New chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    const next = [newThread, ...threads];
    setActiveThreadId(id);
    setMessages([]);
    persistThreads(next);
  };

  const saveCurrentMessageToThread = (nextMessages: typeof messages, maybeNewTitle?: string) => {
    if (!activeThreadId) return;
    const nowTs = Date.now();
    const next = threads.map(t => {
      if (t.id !== activeThreadId) return t;
      return {
        ...t,
        title: maybeNewTitle && t.title === 'New chat' ? maybeNewTitle : t.title,
        updatedAt: nowTs,
        messages: nextMessages,
      };
    });
    persistThreads(next);
  };

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage && selectedFiles.length === 0) return;

    const userMsg = input.trim();
    const nextUserMessages = [...messages, { role: 'user' as const, text: userMsg, time: now() }];
    setMessages(nextUserMessages);
    saveCurrentMessageToThread(nextUserMessages);

    setInput('');
    setIsLoading(true);

    try {
      // Handle file uploads if present
      let sessionId = activeSessionId;
      
      if (selectedFiles.length > 0 && selectedFiles.some(f => !f.type.startsWith('image/'))) {
        const filesPayload = await Promise.all(
          selectedFiles.map(async f => {
            const arrayBuf = await f.arrayBuffer();
            const bytes = new Uint8Array(arrayBuf);
            let binary = '';
            bytes.forEach(b => (binary += String.fromCharCode(b)));
            return {
              filename: f.name,
              mimeType: f.type || 'application/octet-stream',
              base64: btoa(binary),
            };
          })
        );

        const upResp = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: filesPayload }),
        });
        const upData = await upResp.json();
        if (!upResp.ok) throw new Error(upData?.error || 'Upload failed');
        sessionId = upData.sessionId;
        setActiveSessionId(sessionId);
      }

      // Use RAG if session exists
      if (sessionId) {
        const resp = await fetch('/api/documents/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, question: userMsg }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || 'Chat failed');
        const assistantMsg = data?.reply || '...';
        const nextMessages = [...nextUserMessages, { role: 'assistant' as const, text: assistantMsg, time: now() }];
        setMessages(nextMessages);
        saveCurrentMessageToThread(nextMessages);
        return;
      }

      // Fallback to vision/standard chat
      let userContent: any = userMsg || 'Please describe this image.';
      let modelName = 'ar-neural-v2';

      if (selectedImage) {
        modelName = 'ar-neural-v2-vision';
        // Convert File to base64 data URL for GLM-4V image_url format
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedImage);
        });
        userContent = [
          { type: 'text', text: userMsg || 'Please describe this image.' },
          { type: 'image_url', image_url: { url: base64 } }
        ];
      }

      const body = {
        model: modelName,
        messages: [
          { role: 'system', content: systemInstruction },
          ...messages.map(m => ({ role: m.role, content: m.text })),
          { role: 'user', content: userContent },
        ],
      };

      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const errMsg = typeof data?.error === 'string'
          ? data.error
          : data?.error?.message || data?.message || `API Error ${resp.status}`;
        throw new Error(errMsg);
      }

      const reply = data?.choices?.[0]?.message?.content;
      if (!reply) throw new Error('Empty response from AI engine.');

      const nextMessages = [...nextUserMessages, { role: 'assistant' as const, text: reply, time: now() }];
      setMessages(nextMessages);
      saveCurrentMessageToThread(nextMessages);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg = error?.message || 'Unknown error';
      const nextErrorMessages = [...nextUserMessages, { role: 'assistant' as const, text: `⚠️ Error: ${errorMsg}`, time: now() }];
      setMessages(nextErrorMessages);
      saveCurrentMessageToThread(nextErrorMessages);
    } finally {
      setIsLoading(false);
      setSelectedFiles([]);
      setSelectedImage(null);
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
            <div className="hidden sm:flex">
              <button
                type="button"
                onClick={createNewThread}
                className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-[12px] font-mono text-gray-200 flex items-center gap-2"
              >
                + New chat
              </button>
            </div>

            <div className="flex sm:hidden">
              <button
                type="button"
                onClick={createNewThread}
                className="p-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-[12px] font-mono text-gray-200"
                aria-label="New chat"
                title="New chat"
              >
                +
              </button>
            </div>

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
            <button
              type="button"
              onClick={() => {
                window.location.href = "/project-builder";
              }}
              className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-[12px] font-mono text-gray-200 flex items-center gap-2"
              title="Open the Google-vibe AI Project Builder"
            >
              <Sparkles size={16} />
              Vibe Code
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">LIVE</span>
            </div>
          </div>
        </header>

        {/* History + Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="hidden md:block px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">History</h3>
                <p className="text-[10px] text-gray-500 font-mono">{threads.length} chats stored</p>
              </div>
              <button
                type="button"
                onClick={createNewThread}
                className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-[12px] font-mono text-gray-200"
              >
                + New chat
              </button>
            </div>

            {threads.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {threads.slice(0, 8).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveThreadId(t.id)}
                    className={cn(
                      'text-left px-3 py-2 rounded-xl border transition-colors text-[12px] font-mono',
                      t.id === activeThreadId
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-200'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate">{t.title || 'Chat'}</span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(t.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {messages.length === 0 && !isLoading ? (
              <WelcomeScreen />
            ) : (
              <div className="flex flex-col">
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        'w-full px-4 sm:px-6 py-5 border-b border-white/[0.04]',
                        msg.role === 'assistant' ? 'bg-white/[0.02]' : 'bg-transparent'
                      )}
                    >
                      <div className="max-w-3xl mx-auto flex gap-4">
                        {/* Avatar */}
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                          msg.role === 'assistant'
                            ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20'
                            : 'bg-white/10 border border-white/20'
                        )}>
                          {msg.role === 'assistant' ? <Bot size={16} /> : <User2 size={16} className="text-gray-400" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-semibold text-white">
                              {msg.role === 'assistant' ? 'Joyi' : 'You'}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">{msg.time}</span>
                          </div>
                          <div className={cn(
                            'text-sm leading-7 text-gray-200 prose prose-invert max-w-none',
                            '[&_p]:mb-3 [&_p:last-child]:mb-0',
                            '[&_strong]:text-white [&_strong]:font-semibold',
                            '[&_em]:text-cyan-300 [&_em]:italic',
                            '[&_code]:bg-white/10 [&_code]:text-cyan-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono',
                            '[&_pre]:bg-black/40 [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-3 [&_pre]:overflow-x-auto',
                            '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-300',
                            '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-2',
                            '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:my-2',
                            '[&_li]:text-gray-300',
                            '[&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-4 [&_h1]:mb-2',
                            '[&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-3 [&_h2]:mb-2',
                            '[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-3 [&_h3]:mb-1',
                            '[&_blockquote]:border-l-2 [&_blockquote]:border-cyan-500/40 [&_blockquote]:pl-4 [&_blockquote]:text-gray-400 [&_blockquote]:italic [&_blockquote]:my-2',
                            '[&_a]:text-cyan-400 [&_a]:underline [&_a]:underline-offset-2',
                            '[&_hr]:border-white/10 [&_hr]:my-4',
                            '[&_table]:w-full [&_table]:my-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-gray-400 [&_th]:pb-2 [&_th]:border-b [&_th]:border-white/10 [&_td]:text-xs [&_td]:py-1.5 [&_td]:border-b [&_td]:border-white/5',
                          )}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                          {msg.role === 'assistant' && <CopyButton text={msg.text} />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full px-4 sm:px-6 py-5 bg-white/[0.02]"
                  >
                    <div className="max-w-3xl mx-auto flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                        <Bot size={16} />
                      </div>
                      <div className="pt-1">
                        <TypingDots />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Input Bar ── */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl px-4 sm:px-6 py-4">
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
            className="max-w-3xl mx-auto flex items-center gap-3"
          >
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.docx,.txt,.md,.csv,.xlsx,.json,.xml,.yml,.yaml,.ts,.tsx,.js,.py,.java,.go,.c,.cpp,.h,.hpp"
              onChange={e => {
                const files = Array.from(e.target.files || []);
                setSelectedFiles(files);
                const firstImage = files.find(f => f.type.startsWith('image/')) || null;
                setSelectedImage(firstImage);
              }}
              className="hidden"
              id="ai-file-upload"
            />
            <label htmlFor="ai-file-upload" className="cursor-pointer p-2 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-white/5 transition-all">
              <ImageIcon size={20} />
            </label>
            {selectedFiles.length > 0 ? (
              <span className="text-[10px] text-cyan-400 font-mono truncate max-w-[180px]">
                {selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} files selected`}
              </span>
            ) : selectedImage ? (
              <span className="text-[10px] text-cyan-400 font-mono truncate max-w-[180px]">{selectedImage.name}</span>
            ) : null}
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
                input.trim() || selectedImage || selectedFiles.length > 0
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