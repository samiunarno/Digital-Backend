import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

/* ── Local knowledge base about the person ── */
const PERSON_INFO = {
  name: 'Dong Xiao Xuan',
  role: 'Software Engineer',
  university: 'Jilin University — B.Sc. in Software Engineering (current)',
  seniorHigh: 'Yantai Economic and Technological Development Zone Senior High School',
  juniorHigh: 'Yantai Economic and Technological Development Zone Experimental School',
  experience: '5+ years in production environments',
  projects: '50+ projects across Web, Mobile, and API',
  competitions: '20+ hackathon & contest wins',
  skills: 'Full-Stack Development, Cloud-Native Infrastructure, System Architecture, Clean Code, TDD',
  techStack: 'React, TypeScript, Node.js, Express, MongoDB, PostgreSQL, Docker, AWS',
  philosophy: 'Clean Code Practices, Test-Driven Development, User-Centric Engineering',
  availability: 'Open to Work — Remote/Global',
  tagline: 'Building scalable, high-performance software solutions with clean code and robust architecture.',
};

/* ── Simple keyword matcher — no API needed ── */
function getAnswer(q: string): string {
  const lower = q.toLowerCase();

  if (/who|name|yourself|about/.test(lower))
    return `I'm the assistant for **${PERSON_INFO.name}**, a ${PERSON_INFO.role}. ${PERSON_INFO.tagline}`;

  if (/education|university|school|study|degree|college/.test(lower))
    return `🎓 **Education:**\n• ${PERSON_INFO.university}\n• ${PERSON_INFO.seniorHigh}\n• ${PERSON_INFO.juniorHigh}`;

  if (/skill|tech|stack|language|framework/.test(lower))
    return `⚙️ **Tech Stack:** ${PERSON_INFO.techStack}\n\n**Core Skills:** ${PERSON_INFO.skills}`;

  if (/experience|year|work/.test(lower))
    return `💼 ${PERSON_INFO.experience}, with ${PERSON_INFO.projects}.`;

  if (/project|portfolio|app/.test(lower))
    return `🚀 ${PERSON_INFO.projects} — including e-commerce platforms, task management APIs, and more. Check the Projects section!`;

  if (/competition|hackathon|win|award/.test(lower))
    return `🏆 ${PERSON_INFO.competitions} — across various hackathons and coding contests.`;

  if (/available|hire|contact|work with|job/.test(lower))
    return `📡 **Status:** ${PERSON_INFO.availability}. Use the Contact section to send a message!`;

  if (/philosophy|approach|method/.test(lower))
    return `🧠 **Engineering Philosophy:** ${PERSON_INFO.philosophy}`;

  if (/hi|hello|hey|yo|sup/.test(lower))
    return `Hey! 👋 I'm ${PERSON_INFO.name}'s portfolio assistant. Ask me about skills, projects, education, or experience!`;

  return `I can answer questions about **${PERSON_INFO.name}**'s skills, education, projects, experience, and availability. Try asking one of those!`;
}

type Msg = { role: 'user' | 'bot'; text: string };

export default function PortfolioChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: `Hi! 👋 I'm ${PERSON_INFO.name}'s assistant. Ask me anything about skills, projects, or education.` },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    // Simulate tiny delay
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getAnswer(userMsg) }]);
    }, 300);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 flex items-center justify-center hover:shadow-cyan-500/50 transition-shadow"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-[90] w-80 sm:w-96 h-[480px] flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Quick Info Bot</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-gray-400 font-mono">ONLINE</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed',
                    msg.role === 'bot'
                      ? 'bg-white/[0.06] border border-white/10 text-gray-200'
                      : 'bg-gradient-to-br from-cyan-600/80 to-indigo-600/80 text-white ml-auto'
                  )}
                >
                  {msg.text.split('\n').map((line, j) => (
                    <span key={j}>
                      {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={k} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                          : part
                      )}
                      {j < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={e => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 p-3 border-t border-white/10 bg-white/5"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about skills, projects…"
                className="flex-1 rounded-lg bg-white/[0.06] border border-white/15 px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
