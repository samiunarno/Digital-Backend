import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, Send, Sun, Moon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

// Typing indicator with subtle bounce
const TypingIndicator = () => (
  <div className="flex space-x-1">
    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
  </div>
);

// System instruction – stays the same
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

export default function AIChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Auto‑scroll to latest message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);
    try {
      const apiKey = process.env.VITE_ZHIPU_API_KEY || '';
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
        const base64 = await selectedImage.arrayBuffer().then(buf => Buffer.from(buf).toString('base64'));
        body.model = 'glm-4v';
        body.images = [{ format: 'png', data: base64 }];
      }
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || '...';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Error contacting AI service.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-ink', theme === 'dark' && 'dark')}>
      {/* Sidebar – glassmorphism */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-lg p-6 flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-8 hover:text-accent transition-colors">
          <ArrowLeft size={20} />
          <span className="font-mono uppercase text-sm">Back</span>
        </Link>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="text-accent" /> Joyi Neural Link
        </h2>
        <p className="text-muted mb-6">Your personal AI architect – ICPC Gold Medalist, PhD‑level expertise.</p>
        <button
          onClick={toggleTheme}
          className="mt-auto flex items-center gap-2 px-4 py-2 border border-white/30 text-muted hover:text-accent hover:border-accent transition-colors rounded"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </aside>

      {/* Chat container */}
      <section className="flex-1 flex flex-col relative">
        {/* Gradient overlay for subtle vibe */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 z-10"
        >
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'max-w-xl rounded-xl p-4 shadow-lg',
                  msg.role === 'assistant'
                    ? 'bg-white/5 border-l-4 border-accent backdrop-blur-sm'
                    : 'bg-white/10 ml-auto'
                )}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-xl rounded-xl p-4 bg-white/5 shadow-inner flex items-center"
            >
              <TypingIndicator />
            </motion.div>
          )}
        </div>

        {/* Input area */}
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
          className="border-t border-white/20 p-4 flex items-center gap-3 bg-black/30 backdrop-blur-xl z-10"
        >
          <input
            type="file"
            accept="image/*"
            onChange={e => setSelectedImage(e.target.files?.[0] || null)}
            className="hidden"
            id="ai-image-upload"
          />
          <label htmlFor="ai-image-upload" className="cursor-pointer text-accent hover:text-white transition-colors">
            <ImageIcon size={20} />
          </label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Joyi something brilliant…"
            className="flex-1 rounded-md bg-white/10 border border-white/30 px-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 rounded-full bg-accent text-bg hover:bg-accent/80 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </section>
    </div>
  );
}
