import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, Send, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

// Re‑use the same system instruction and fetch logic we built for ZhipuChat
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

  // Auto‑scroll to newest message
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

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

      // If an image was selected, switch to the multimodal model and attach base64 payload
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

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className={cn('flex min-h-screen bg-bg text-ink', theme === 'dark' && 'dark')}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-bg/80 backdrop-blur-md p-4 flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-6 hover:text-accent transition-colors">
          <ArrowLeft size={20} />
          <span className="font-mono uppercase text-sm">Back to Portfolio</span>
        </Link>
        <h2 className="text-xl font-bold mb-4">Joyi Neural Link</h2>
        <p className="text-muted mb-4">Your personal AI architect – ICPC Gold Medalist, PhD‑level expertise.</p>
        <button
          onClick={toggleTheme}
          className="mt-auto flex items-center gap-2 px-3 py-2 border border-border text-muted hover:text-accent hover:border-accent transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </aside>

      {/* Main chat area */}
      <section className="flex-1 flex flex-col">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                'max-w-xl rounded-lg p-4',
                msg.role === 'assistant' ? 'bg-accent/10' : 'bg-border/20 ml-auto'
              )}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {isLoading && (
            <div className="max-w-xl rounded-lg p-4 bg-accent/10 animate-pulse">
              <em>Thinking...</em>
            </div>
          )}
        </div>

        {/* Input bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
          className="border-t border-border p-4 flex items-center gap-3 bg-bg/90 backdrop-blur"
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
            className="flex-1 rounded-md bg-bg border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
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
