import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  MessageSquare, 
  Users, 
  Activity, 
  Mail, 
  ArrowLeft, 
  Clock, 
  User, 
  Send,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  replied: boolean;
}

interface Analytics {
  activeUsers: number;
  visitorCount: number;
  messageCount: number;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    activeUsers: 0,
    visitorCount: 0,
    messageCount: 0
  });
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    // Initial fetch
    fetch('/api/messages').then(res => res.json()).then(setMessages).catch(console.error);
    fetch('/api/analytics').then(res => res.json()).then(setAnalytics).catch(console.error);

    // Socket connection
    const socket = io();

    socket.on('analytics_update', (data: Analytics) => {
      setAnalytics(data);
    });

    socket.on('new_message', (message: Message) => {
      setMessages(prev => [message, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleReply = (email: string, subject: string) => {
    window.location.href = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;
  };

  return (
    <div className="min-h-screen bg-bg text-ink p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link to="/" className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-4 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono text-[10px] uppercase tracking-widest">Back to Portfolio</span>
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter">
              Control_<span className="text-accent">Center</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-1">
                <Activity size={16} className="text-accent animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">System_Status</span>
              </div>
              <div className="text-xl font-bold uppercase">Operational</div>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={80} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                <Users size={18} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Active_Users</span>
            </div>
            <div className="text-5xl font-bold mb-2">{analytics.activeUsers}</div>
            <div className="flex items-center gap-2 text-[10px] text-accent uppercase tracking-widest">
              <TrendingUp size={12} />
              Real-time Tracking
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 size={80} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                <BarChart3 size={18} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Total_Visitors</span>
            </div>
            <div className="text-5xl font-bold mb-2">{analytics.visitorCount}</div>
            <div className="text-[10px] text-muted uppercase tracking-widest">Cumulative Traffic</div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <MessageSquare size={80} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                <MessageSquare size={18} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Messages_Received</span>
            </div>
            <div className="text-5xl font-bold mb-2">{analytics.messageCount}</div>
            <div className="text-[10px] text-muted uppercase tracking-widest">Contact Requests</div>
          </div>
        </div>

        {/* Main Content: Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Message List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Recent_Messages</h2>
              <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest">
                {messages.length} Total
              </span>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl opacity-40">
                    <Mail size={40} className="mx-auto mb-4" />
                    <p className="font-mono text-[10px] uppercase tracking-widest">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        selectedMessage?.id === msg.id 
                          ? 'bg-accent border-accent text-bg' 
                          : 'bg-white/5 border-white/10 hover:border-accent/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedMessage?.id === msg.id ? 'bg-bg/20' : 'bg-accent/10 text-accent'
                          }`}>
                            <User size={18} />
                          </div>
                          <div>
                            <div className="font-bold uppercase text-sm">{msg.name}</div>
                            <div className={`text-[10px] font-mono opacity-60 ${
                              selectedMessage?.id === msg.id ? 'text-bg' : 'text-muted'
                            }`}>
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className={`text-xs line-clamp-2 ${
                        selectedMessage?.id === msg.id ? 'text-bg/80' : 'text-muted'
                      }`}>
                        {msg.message}
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 h-full flex flex-col"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Clock size={14} className="text-accent" />
                        <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
                          Received: {new Date(selectedMessage.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-4xl font-bold uppercase tracking-tighter">{selectedMessage.name}</h3>
                      <div className="text-accent font-mono text-xs mt-1">{selectedMessage.email}</div>
                    </div>
                    
                    <button 
                      onClick={() => handleReply(selectedMessage.email, `Portfolio Inquiry - ${selectedMessage.name}`)}
                      className="bg-accent text-bg px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-3 hover:scale-105 transition-transform active:scale-95"
                    >
                      <Send size={16} />
                      Initialize Reply
                    </button>
                  </div>

                  <div className="flex-grow">
                    <div className="mono-label text-[10px] opacity-40 mb-4 uppercase">Message_Content</div>
                    <div className="bg-bg/50 border border-white/5 p-8 rounded-2xl text-lg font-light leading-relaxed text-muted whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">Secure_Transmission</span>
                    </div>
                    <div className="text-[10px] font-mono opacity-20">ID: {selectedMessage.id}</div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-12 h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Mail size={32} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase mb-2">Select a Message</h3>
                  <p className="text-sm font-light max-w-xs">
                    Choose a message from the list to view details and initialize a reply.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
