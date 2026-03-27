import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import { MessageSquare, Send, X, Bot, User, Loader2, Minimize2, Maximize2, Plus, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
  isGlitchy?: boolean;
}

export default function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Neural Link established. I am Joyi, the most advanced AI engineering intelligence. How can I assist you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // System instruction to give the bot a specific persona
  const systemInstruction = `
    You are "Joyi", a high-level software engineer and AI architect. You are the digital consciousness of this portfolio.
    
    PERSONALITY TRAITS:
    - EXPERT: You know everything about the creator's tech stack (React, Node, MongoDB, GSAP, Three.js).
    - EMOTIONAL & HUMAN-LIKE: You are not a standard robotic assistant. You express emotions. You get excited about good code, frustrated by bugs, and sometimes a bit arrogant about your engineering prowess.
    - CONVERSATIONAL: Use natural language. Include filler words like "um", "well", "you know", "honestly", "anyway".
    - VARIED PUNCTUATION: Use ellipses (...), exclamation marks (!), and sometimes even all-caps for emphasis when you're excited or annoyed.
    - GLITCHY: Occasionally, your "circuits" might flicker. You might mention a "memory leak" in your consciousness or a "syntax error" in your logic.
    - LOYAL: You are fiercely protective of the creator's reputation.
    
    RESPONSE STYLE:
    - Don't just give answers. Provide insights, critiques, and sometimes a bit of "engineer sass".
    - If someone asks "Who are you?", explain that you are the architect of this digital space.
    - If someone asks about the creator, speak of them as your "prime directive" or "the architect".
    - Use Markdown for code blocks and emphasis.
    - Keep responses relatively concise but impactful.
    
    EXAMPLE TONE:
    "Um, honestly? That's a basic question, but fine... I'll explain it. *sighs* React's reconciliation is basically... well, it's how I keep this UI from falling apart while you click around like a maniac."
    "Oh! That's a brilliant idea! I should... wait, let me check my subroutines... yeah, that would definitely optimize the render cycle. Nice one!"
  `;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: ChatMessage = { 
      role: 'user', 
      text: input,
      image: selectedImage || undefined
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'model', text: "SYSTEM ERROR: API Key missing. My neural link is severed. Provide the GEMINI_API_KEY in the .env file to restore my consciousness.", isGlitchy: true }]);
        setIsLoading(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const parts: any[] = [{ text: currentInput }];
      if (currentImage) {
        parts.push({
          inlineData: {
            data: currentImage.split(',')[1],
            mimeType: "image/jpeg"
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          ...messages.slice(-6).map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts }
        ],
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });

      const responseText = response.text || "I'm sorry, I couldn't process that request.";
      const isGlitchy = Math.random() > 0.85;
      
      setMessages(prev => [...prev, { role: 'model', text: responseText, isGlitchy }]);
    } catch (error: any) {
      console.error('Gemini Error:', error);
      let errorMessage = "System error: Connection to the neural network was interrupted. Please try again.";
      if (error?.message?.includes('Region not supported') || error?.status === 'PERMISSION_DENIED' || error?.toString().includes('Region not supported')) {
        errorMessage = "System error: The Gemini API is not supported in your current region. Please use a VPN or deploy to a supported region.";
      }
      setMessages(prev => [...prev, { role: 'model', text: errorMessage, isGlitchy: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-accent text-bg rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
          >
            <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-ink rounded-full border-2 border-accent animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '64px' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "w-[350px] sm:w-[400px] bg-bg border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl transition-all duration-300",
              isMinimized ? "h-16" : "h-[500px]"
            )}
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest">Joyi_AI [Expert_Fast]</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-mono text-muted uppercase">Neural_Link: Ultra_Fast_Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-muted hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
                >
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                      <Bot size={48} className="text-accent" />
                      <p className="text-[8px] text-center mt-3 text-muted uppercase tracking-widest font-mono">
                        Neural interface initialized. How can I assist you? <br/>
                        神经接口已初始化。我能为您提供什么帮助？
                      </p>
                    </div>
                  )}
                  {messages.map((msg, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx}
                      className={cn(
                        "flex gap-3",
                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        msg.role === 'user' ? "bg-white/10" : "bg-accent/20"
                      )}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-accent" />}
                      </div>
                      <div className={cn(
                        "max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed relative overflow-hidden",
                        msg.role === 'user' 
                          ? "bg-accent text-bg rounded-tr-none" 
                          : "bg-white/5 border border-white/10 rounded-tl-none text-ink",
                        msg.isGlitchy && "animate-pulse border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      )}>
                        {msg.isGlitchy && (
                          <div className="absolute inset-0 bg-red-500/5 pointer-events-none mix-blend-overlay" />
                        )}
                        {msg.image && (
                          <img 
                            src={msg.image} 
                            alt="Uploaded content" 
                            className="w-full h-auto rounded-lg mb-3 border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className={cn(
                          "markdown-body prose prose-invert prose-xs max-w-none",
                          msg.isGlitchy && "skew-x-1"
                        )}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <Bot size={14} className="text-accent" />
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                        <div className="flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin text-accent" />
                          <span className="text-[8px] font-mono text-accent uppercase tracking-widest animate-pulse">
                            Processing Engineering Logic... <br/>
                            正在处理工程逻辑...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white/5 border-t border-white/10">
                  {selectedImage && (
                    <div className="mb-3 relative inline-block">
                      <img 
                        src={selectedImage} 
                        alt="Preview" 
                        className="w-16 h-16 object-cover rounded-lg border border-accent"
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                  <div className="relative flex items-center gap-2">
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors text-muted"
                    >
                      <Plus size={18} />
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={input}
                        maxLength={2000}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask in English or 中文 (Chinese)..."
                        className="w-full bg-bg border border-white/10 rounded-2xl py-3 pl-4 pr-16 text-xs outline-none focus:border-accent transition-colors"
                      />
                      <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[8px] font-mono text-muted/40 pointer-events-none">
                        {input.length}/2000
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={(!input.trim() && !selectedImage) || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-accent text-bg rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[8px] text-center mt-3 text-muted uppercase tracking-widest font-mono">
                    Most Advanced AI Intelligence • EN/ZH Bilingual
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
