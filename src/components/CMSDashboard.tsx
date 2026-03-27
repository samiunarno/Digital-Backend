import React, { useState, useEffect, useRef } from 'react';
import { PortfolioContent, Message as MessageType, ReplyTemplate, User as UserType } from '../types';
import { initialPortfolioData } from '../data/portfolioData';
import { PortfolioContentSchema } from '../lib/validation';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { 
  Save, 
  Database, 
  LogOut, 
  LogIn, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  Terminal,
  Users,
  MessageSquare,
  Sparkles,
  Layout,
  Code,
  Shield,
  Globe,
  Cpu,
  Mail,
  Trophy,
  GraduationCap,
  Briefcase,
  Palette,
  X,
  Send,
  Eye,
  MousePointer2,
  RefreshCw,
  Clock,
  ChevronRight,
  Bot,
  Loader2,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import ReactMarkdown from 'react-markdown';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface AnalyticsData {
  activeUsers: number;
  visitorCount: number;
  messageCount: number;
}

export default function CMSDashboard() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [originalContent, setOriginalContent] = useState<PortfolioContent | null>(null);
  const [currentLang, setCurrentLang] = useState<'en' | 'zh'>('en');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ activeUsers: 0, visitorCount: 0, messageCount: 0 });
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'projects' | 'skills' | 'experience' | 'testimonials' | 'education' | 'services' | 'achievements' | 'messages' | 'ai' | 'users'>('overview');

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [templates, setTemplates] = useState<ReplyTemplate[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'editor' as 'admin' | 'editor' });
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: '', body: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: string, index: number, id?: any } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // AI Chat State
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'model', text: string, image?: string, isGlitchy?: boolean }[]>([
    { role: 'model', text: "Admin Neural Link established. I am Joyi, your expert engineering intelligence. How can I assist with your portfolio management today?" }
  ]);
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [aiSelectedImage, setAiSelectedImage] = useState<string | null>(null);
  const aiFileInputRef = useRef<HTMLInputElement>(null);
  const aiScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    setIsAdmin(adminStatus);
    if (!adminStatus) {
      navigate('/admin');
    }
    
    const fetchData = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
          setOriginalContent(JSON.parse(JSON.stringify(data)));
        } else {
          setContent(initialPortfolioData);
          setOriginalContent(JSON.parse(JSON.stringify(initialPortfolioData)));
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setContent(initialPortfolioData);
        setOriginalContent(JSON.parse(JSON.stringify(initialPortfolioData)));
      } finally {
        setLoading(false);
      }
    };

    // Socket.io for real-time analytics
    socketRef.current = io();
    socketRef.current.on('analytics_update', (data: AnalyticsData) => {
      setAnalytics(data);
    });

    fetchData();
    fetchMessages();
    fetchTemplates();
    fetchUsers();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [navigate]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'User added successfully!' });
        setNewUser({ username: '', password: '', role: 'editor' });
        setShowUserForm(false);
        fetchUsers();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Failed to add user.' });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setMessage({ type: 'error', text: 'Failed to add user.' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`/api/users/${editingUser._id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: editingUser.username,
          role: editingUser.role,
        }),
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'User updated successfully!' });
        setEditingUser(null);
        fetchUsers();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Failed to update user.' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage({ type: 'error', text: 'Failed to update user.' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteUser = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'User deleted successfully!' });
        fetchUsers();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Failed to delete user.' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage({ type: 'error', text: 'Failed to delete user.' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const hasUnsavedChanges = JSON.stringify(content) !== JSON.stringify(originalContent);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    // Validation using Zod on frontend
    try {
      PortfolioContentSchema.parse(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map(err => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        });
        
        // Show the first error in the message, but log all to console
        setMessage({ 
          type: 'error', 
          text: `Validation Error: ${errorMessages[0]}${errorMessages.length > 1 ? ` (+${errorMessages.length - 1} more)` : ''}` 
        });
        
        console.error('Zod Validation Errors:', error.issues);
        setTimeout(() => setMessage(null), 8000);
        return;
      }
    }

    setSaving(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
      setSaving(false);
      setTimeout(() => navigate('/admin'), 2000);
      return;
    }

    console.log('Saving content:', content);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Received saved data:', data);
        
        // Ensure we received valid data before updating state
        if (data && (data.en || data.zh || data.common)) {
          setContent(data);
          setOriginalContent(JSON.parse(JSON.stringify(data)));
          setMessage({ type: 'success', text: 'Content updated successfully in MongoDB!' });
        } else {
          console.error('Received invalid/empty data from server:', data);
          throw new Error('Received invalid data from server');
        }
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        throw new Error(errorData.error || 'Failed to save to MongoDB');
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage({ type: 'error', text: 'Failed to save content.' });
    }
    setSaving(false);
  };

  const handleLogOut = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin');
  };

  useEffect(() => {
    if (aiScrollRef.current) {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }
  }, [aiMessages]);

  const handleAiImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAiSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiSendMessage = async () => {
    if ((!aiInput.trim() && !aiSelectedImage) || aiIsLoading) return;

    const userMessage = { 
      role: 'user' as const, 
      text: aiInput,
      image: aiSelectedImage || undefined
    };
    setAiMessages(prev => [...prev, userMessage]);
    const currentInput = aiInput;
    const currentImage = aiSelectedImage;
    setAiInput('');
    setAiSelectedImage(null);
    setAiIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) {
        setAiMessages(prev => [...prev, { role: 'model', text: "SYSTEM ERROR: API Key missing. My neural link is severed. Provide the GEMINI_API_KEY in the .env file to restore my consciousness.", isGlitchy: true }]);
        setAiIsLoading(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      
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
          ...aiMessages.slice(-6).map(m => ({
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
      
      setAiMessages(prev => [...prev, { role: 'model', text: responseText, isGlitchy }]);
    } catch (error: any) {
      console.error('Gemini Error:', error);
      let errorMessage = "System error: Connection to the neural network was interrupted. Please try again.";
      if (error?.message?.includes('Region not supported') || error?.status === 'PERMISSION_DENIED' || error?.toString().includes('Region not supported')) {
        errorMessage = "System error: The Gemini API is not supported in your current region. Please use a VPN or deploy to a supported region.";
      }
      setAiMessages(prev => [...prev, { role: 'model', text: errorMessage, isGlitchy: true }]);
    } finally {
      setAiIsLoading(false);
    }
  };

  const seedDatabase = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
      setSaving(false);
      setTimeout(() => navigate('/admin'), 2000);
      return;
    }

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(initialPortfolioData),
      });
      if (response.ok) {
        const data = await response.json();
        setContent(data);
        setOriginalContent(JSON.parse(JSON.stringify(data)));
        setMessage({ type: 'success', text: 'Content reset to blank template!' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to seed MongoDB');
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error seeding data:', error);
      setMessage({ type: 'error', text: 'Failed to reset data.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 border border-white/10 p-12 rounded-3xl text-center backdrop-blur-xl">
          <Database size={48} className="mx-auto mb-6 text-accent" />
          <h1 className="text-3xl font-bold uppercase mb-4">CMS_Login</h1>
          <p className="text-muted mb-8 font-light">Access the portfolio management system to update content in real-time.</p>
          <button 
            onClick={() => navigate('/admin')}
            className="w-full bg-accent text-bg py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-transform"
          >
            <LogIn size={18} />
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'profile', label: 'Profile', icon: Edit3 },
    { id: 'projects', label: 'Projects', icon: Database },
    { id: 'skills', label: 'Skills', icon: Sparkles },
    { id: 'experience', label: 'Experience', icon: Layers },
    { id: 'testimonials', label: 'Testimonials', icon: Users },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'services', label: 'Services', icon: Palette },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'ai', label: 'Joyi_AI', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink p-4 md:p-8 font-sans pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link to="/" className="flex items-center gap-2 text-muted hover:text-accent transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-[10px] uppercase tracking-widest">Live Site</span>
              </Link>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${socketRef.current?.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted">
                  {socketRef.current?.connected ? 'System_Online' : 'System_Offline'}
                </span>
              </div>
            </div>
            <h1 className="text-5xl font-bold uppercase tracking-tighter">
              Admin_<span className="text-accent">Dashboard</span>
            </h1>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex bg-white/5 p-1 rounded-full border border-white/10 mr-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentLang('en')}
                className={`px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${currentLang === 'en' ? 'bg-accent text-bg' : 'text-muted hover:text-white'}`}
              >
                EN
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentLang('zh')}
                className={`px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all ${currentLang === 'zh' ? 'bg-accent text-bg' : 'text-muted hover:text-white'}`}
              >
                ZH
              </motion.button>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all content to blank? This will overwrite your current data.')) {
                  seedDatabase();
                }
              }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-red-500/20 transition-colors"
            >
              <RefreshCw size={16} />
              Reset Blank
            </motion.button>
            <motion.button 
              whileHover={hasUnsavedChanges ? { scale: 1.05 } : {}}
              whileTap={hasUnsavedChanges ? { scale: 0.95 } : {}}
              onClick={handleSave}
              disabled={saving || !content}
              className={cn(
                "px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-3 transition-all duration-300 relative overflow-hidden",
                hasUnsavedChanges 
                  ? "bg-accent text-bg shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)]" 
                  : "bg-white/5 text-muted border border-white/10 cursor-not-allowed"
              )}
            >
              {hasUnsavedChanges && (
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              )}
              <Save size={16} className={hasUnsavedChanges ? "animate-bounce" : ""} />
              {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'All Saved'}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogOut}
              className="bg-white/5 border border-white/10 text-ink px-6 py-4 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-3 transition-colors"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-white/5 pb-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all whitespace-nowrap relative ${
                activeTab === tab.id 
                  ? 'bg-accent text-bg shadow-lg' 
                  : 'bg-white/5 text-muted hover:bg-white/10'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.id === 'messages' && messages.filter(m => !m.replied).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] items-center justify-center text-white font-bold">
                    {messages.filter(m => !m.replied).length}
                  </span>
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Content Area with Animation */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!content ? (
            <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-20 text-center">
              <Database size={64} className="mx-auto mb-6 opacity-20" />
              <h2 className="text-2xl font-bold uppercase mb-4">Database Empty</h2>
              <p className="text-muted mb-8 max-w-md mx-auto">The portfolio database is currently empty. Initialize it with the default content to get started.</p>
              <button 
                onClick={seedDatabase}
                className="bg-accent text-bg px-12 py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform"
              >
                Seed Database
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {activeTab === 'users' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">User_Management</h2>
                    {currentUser?.role === 'admin' && (
                      <button 
                        onClick={() => setShowUserForm(true)}
                        className="bg-accent text-bg px-6 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <Plus size={14} />
                        Add New User
                      </button>
                    )}
                  </div>

                  {/* User List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {users.map((user) => (
                      <motion.div 
                        key={user._id}
                        layout
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                              <User size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold uppercase tracking-tight">{user.username}</h3>
                              <p className="text-[10px] font-mono text-muted uppercase tracking-widest">{user.role}</p>
                            </div>
                          </div>
                          {currentUser?.role === 'admin' && user.username !== currentUser.username && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setEditingUser(user)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-colors"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-muted hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-mono text-muted uppercase">
                          <Clock size={10} />
                          Created: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add User Modal */}
                  <AnimatePresence>
                    {showUserForm && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowUserForm(false)}
                          className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
                        />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 20 }}
                          className="bg-bg border border-white/10 p-10 rounded-[40px] w-full max-w-md relative z-10 shadow-2xl"
                        >
                          <h3 className="text-2xl font-bold uppercase tracking-tighter mb-8">Create_New_User</h3>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono uppercase tracking-widest text-muted ml-1">Username</label>
                              <input 
                                type="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/50 transition-all"
                                placeholder="Enter username"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono uppercase tracking-widest text-muted ml-1">Password</label>
                              <input 
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/50 transition-all"
                                placeholder="Min 8 characters"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono uppercase tracking-widest text-muted ml-1">Role</label>
                              <select 
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/50 transition-all appearance-none"
                              >
                                <option value="editor" className="bg-bg">Editor (Can edit content)</option>
                                <option value="admin" className="bg-bg">Admin (Full control)</option>
                              </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                              <button 
                                onClick={() => setShowUserForm(false)}
                                className="flex-1 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/5 transition-colors"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={handleAddUser}
                                className="flex-1 bg-accent text-bg py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                              >
                                Create User
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Edit User Modal */}
                  <AnimatePresence>
                    {editingUser && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setEditingUser(null)}
                          className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
                        />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 20 }}
                          className="bg-bg border border-white/10 p-10 rounded-[40px] w-full max-w-md relative z-10 shadow-2xl"
                        >
                          <h3 className="text-2xl font-bold uppercase tracking-tighter mb-8">Edit_User</h3>
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono uppercase tracking-widest text-muted ml-1">Username</label>
                              <input 
                                type="text"
                                value={editingUser.username}
                                onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/50 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono uppercase tracking-widest text-muted ml-1">Role</label>
                              <select 
                                value={editingUser.role}
                                onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent/50 transition-all appearance-none"
                              >
                                <option value="editor" className="bg-bg">Editor</option>
                                <option value="admin" className="bg-bg">Admin</option>
                              </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                              <button 
                                onClick={() => setEditingUser(null)}
                                className="flex-1 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/5 transition-colors"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={handleUpdateUser}
                                className="flex-1 bg-accent text-bg py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
                              >
                                Update User
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Real-time Stats */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Users size={64} />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-2">Active_Users</p>
                    <h3 className="text-4xl font-bold text-accent">{analytics.activeUsers}</h3>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-mono text-muted uppercase">Live_Connection</span>
                    </div>
                    {/* Simple visualization */}
                    <div className="mt-6 flex items-end gap-1 h-8">
                      {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.1 }}
                          className="flex-1 bg-accent/20 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Eye size={64} />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-2">Total_Visitors</p>
                    <h3 className="text-4xl font-bold">{analytics.visitorCount.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2">
                      <Activity size={12} className="text-muted" />
                      <span className="text-[8px] font-mono text-muted uppercase">Across_All_Nodes</span>
                    </div>
                    <div className="mt-6 flex items-end gap-1 h-8">
                      {[30, 50, 80, 40, 90, 60, 75].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.1 }}
                          className="flex-1 bg-white/10 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Mail size={64} />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted mb-2">Total_Messages</p>
                    <h3 className="text-4xl font-bold">{analytics.messageCount}</h3>
                    <div className="mt-4 flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-muted" />
                      <span className="text-[8px] font-mono text-muted uppercase">{messages.filter(m => m.replied).length} Processed</span>
                    </div>
                    <div className="mt-6 flex items-end gap-1 h-8">
                      {[60, 40, 90, 70, 50, 85, 45].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.1 }}
                          className="flex-1 bg-white/10 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <div className="md:col-span-3 bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                      <RefreshCw size={14} className="text-accent" />
                      Quick_Actions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('messages')}
                        className="p-4 bg-bg border border-white/5 rounded-2xl transition-colors text-left group"
                      >
                        <Mail size={20} className="text-muted group-hover:text-accent mb-3 transition-colors" />
                        <p className="text-[10px] font-mono uppercase tracking-widest">Check Messages</p>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('projects')}
                        className="p-4 bg-bg border border-white/5 rounded-2xl transition-colors text-left group"
                      >
                        <Plus size={20} className="text-muted group-hover:text-accent mb-3 transition-colors" />
                        <p className="text-[10px] font-mono uppercase tracking-widest">Add Project</p>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.open('/', '_blank')}
                        className="p-4 bg-bg border border-white/5 rounded-2xl transition-colors text-left group"
                      >
                        <Eye size={20} className="text-muted group-hover:text-accent mb-3 transition-colors" />
                        <p className="text-[10px] font-mono uppercase tracking-widest">Preview Site</p>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.02, borderColor: '#ef4444' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDeleteConfirm({ type: 'database', index: 0 })}
                        className="p-4 bg-bg border border-white/5 rounded-2xl transition-colors text-left group"
                      >
                        <RefreshCw size={20} className="text-muted group-hover:text-red-500 mb-3 transition-colors" />
                        <p className="text-[10px] font-mono uppercase tracking-widest">Reset Data</p>
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            {activeTab === 'profile' && (
              <div className="space-y-12">
                {/* Hero Section */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                  <h2 className="text-2xl font-bold uppercase mb-8 flex items-center gap-4">
                    <Edit3 size={20} className="text-accent" />
                    Professional_Profile ({currentLang.toUpperCase()})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Full Name</label>
                      <input 
                        type="text"
                        value={content[currentLang].hero.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent(prev => prev ? {...prev, [currentLang]: {...prev[currentLang], hero: {...prev[currentLang].hero, name: val}}} : null);
                        }}
                        className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Role Title</label>
                      <input 
                        type="text"
                        value={content[currentLang].hero.role}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent(prev => prev ? {...prev, [currentLang]: {...prev[currentLang], hero: {...prev[currentLang].hero, role: val}}} : null);
                        }}
                        className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Tagline</label>
                      <textarea 
                        value={content[currentLang].hero.tagline}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent(prev => prev ? {...prev, [currentLang]: {...prev[currentLang], hero: {...prev[currentLang].hero, tagline: val}}} : null);
                        }}
                        className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors h-24 resize-none"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Biography</label>
                      <textarea 
                        value={content[currentLang].about.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent(prev => prev ? {...prev, [currentLang]: {...prev[currentLang], about: { text: val }}} : null);
                        }}
                        className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors h-48 resize-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Contact & Socials */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                  <h2 className="text-2xl font-bold uppercase mb-8 flex items-center gap-4">
                    <Mail size={20} className="text-accent" />
                    Contact_&_Socials (Common)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Email Address</label>
                      <input 
                        type="email"
                        value={content.common.contact.email}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent(prev => prev ? {...prev, common: {...prev.common, contact: {...prev.common.contact, email: val}}} : null);
                        }}
                        className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">GitHub URL</label>
                      <input 
                        type="text"
                        value={content.common.contact.social.github}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent(prev => prev ? {...prev, common: {...prev.common, contact: {...prev.common.contact, social: {...prev.common.contact.social, github: val}}}} : null);
                        }}
                        className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">LinkedIn URL</label>
                      <input 
                        type="text"
                        value={content.common.contact.social.linkedin}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent(prev => prev ? {...prev, common: {...prev.common, contact: {...prev.common.contact, social: {...prev.common.contact.social, linkedin: val}}}} : null);
                        }}
                        className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Instagram URL</label>
                      <input 
                        type="text"
                        value={content.common.contact.social.instagram}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent(prev => prev ? {...prev, common: {...prev.common, contact: {...prev.common.contact, social: {...prev.common.contact.social, instagram: val}}}} : null);
                        }}
                        className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'projects' && (
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold uppercase flex items-center gap-4">
                    <Database size={20} className="text-accent" />
                    Projects_Grid ({currentLang.toUpperCase()})
                  </h2>
                  <button 
                    onClick={() => {
                      const newId = Date.now() + Math.floor(Math.random() * 1000);
                      const newEnProject = { id: newId, title: "New Project", description: "" };
                      const newZhProject = { id: newId, title: "新项目", description: "" };
                      
                      setContent(prev => {
                        if (!prev) return null;
                        return {
                          ...prev, 
                          en: { ...prev.en, projects: [...(prev.en.projects || []), newEnProject] },
                          zh: { ...prev.zh, projects: [...(prev.zh.projects || []), newZhProject] },
                          common: {
                            ...prev.common,
                            projectImages: { ...(prev.common.projectImages || {}), [newId]: "https://picsum.photos/seed/project/1200/800" },
                            projectTech: { ...(prev.common.projectTech || {}), [newId]: ["React", "Tailwind"] }
                          }
                        };
                      });
                    }}
                    className="bg-accent/10 text-accent p-3 rounded-xl hover:bg-accent hover:text-bg transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                           <div className="space-y-8">
                  {content[currentLang].projects.map((project, index) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-bg/50 border border-white/5 p-8 rounded-2xl relative group hover:border-accent/30 transition-colors"
                    >
                      <button 
                        onClick={() => setShowDeleteConfirm({ type: 'project', index, id: project.id })}
                        className="absolute top-4 right-4 text-red-500/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Project Title</label>
                          <input 
                            type="text"
                            value={project.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newProjects = [...prev[currentLang].projects];
                                newProjects[index] = { ...newProjects[index], title: val };
                                return {...prev, [currentLang]: {...prev[currentLang], projects: newProjects}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Image URL (Common)</label>
                          <input 
                            type="text"
                            value={content.common.projectImages[project.id] || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                return {
                                  ...prev,
                                  common: {
                                    ...prev.common,
                                    projectImages: { ...prev.common.projectImages, [project.id]: val }
                                  }
                                };
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Description</label>
                          <textarea 
                            value={project.description}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newProjects = [...prev[currentLang].projects];
                                newProjects[index] = { ...newProjects[index], description: val };
                                return {...prev, [currentLang]: {...prev[currentLang], projects: newProjects}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors h-24 resize-none"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Technologies (Common, comma separated)</label>
                          <input 
                            type="text"
                            value={(content.common.projectTech[project.id] || []).join(", ")}
                            onChange={(e) => {
                              const val = e.target.value;
                              const tech = val.split(",").map(t => t.trim()).filter(t => t !== "");
                              setContent(prev => {
                                if (!prev) return null;
                                return {
                                  ...prev,
                                  common: {
                                    ...prev.common,
                                    projectTech: { ...prev.common.projectTech, [project.id]: tech }
                                  }
                                };
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'skills' && (
              <>
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-8">
                <h2 className="text-2xl font-bold uppercase mb-8 flex items-center gap-4">
                  <Activity size={20} className="text-accent" />
                  Skills_Inventory (Common)
                </h2>
                <div className="flex flex-wrap gap-3">
                  {content.common.skills.map((skill, index) => (
                    <motion.div 
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 bg-bg border border-white/10 px-4 py-2 rounded-full group hover:border-accent/50 transition-colors"
                    >
                      <input 
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent(prev => {
                            if (!prev) return null;
                            const newSkills = [...prev.common.skills];
                            newSkills[index] = val;
                            return {...prev, common: {...prev.common, skills: newSkills}};
                          });
                        }}
                        className="bg-transparent outline-none w-24 text-xs font-mono uppercase tracking-widest"
                      />
                      <button 
                        onClick={() => {
                          setContent(prev => {
                            if (!prev) return null;
                            const newSkills = [...prev.common.skills];
                            newSkills.splice(index, 1);
                            return {...prev, common: {...prev.common, skills: newSkills}};
                          });
                        }}
                        className="text-red-500/40 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </motion.div>
                  ))}
                  <button 
                    onClick={() => setContent(prev => prev ? {...prev, common: {...prev.common, skills: [...prev.common.skills, "New Skill"]}} : null)}
                    className="bg-accent/10 text-accent p-2 rounded-full hover:bg-accent hover:text-bg transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </section>

              {/* Tech Stack Section */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-8">
                <h2 className="text-2xl font-bold uppercase flex items-center gap-4 mb-8">
                  <Terminal size={20} className="text-accent" />
                  Core_Technical_Arsenal (Common)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(content.common.techStack || []).map((tech, index) => (
                    <div key={index} className="p-6 bg-bg border border-white/10 rounded-2xl relative group hover:border-accent/30 transition-all">
                      <button 
                        onClick={() => {
                          setContent(prev => {
                            if (!prev) return null;
                            const newStack = [...(prev.common.techStack || [])];
                            newStack.splice(index, 1);
                            return {...prev, common: {...prev.common, techStack: newStack}};
                          });
                        }}
                        className="absolute top-4 right-4 text-red-500/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="mono-label text-[10px] opacity-40">Tech_Name</label>
                          <input 
                            type="text"
                            value={tech.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newStack = [...(prev.common.techStack || [])];
                                newStack[index] = { ...newStack[index], name: val };
                                return {...prev, common: {...prev.common, techStack: newStack}};
                              });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="mono-label text-[10px] opacity-40">Icon_Name (Lucide)</label>
                          <input 
                            type="text"
                            value={tech.iconName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newStack = [...(prev.common.techStack || [])];
                                newStack[index] = { ...newStack[index], iconName: val };
                                return {...prev, common: {...prev.common, techStack: newStack}};
                              });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="mono-label text-[10px] opacity-40">Category</label>
                          <input 
                            type="text"
                            value={tech.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newStack = [...(prev.common.techStack || [])];
                                newStack[index] = { ...newStack[index], category: val };
                                return {...prev, common: {...prev.common, techStack: newStack}};
                              });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="mono-label text-[10px] opacity-40">Efficiency (%)</label>
                          <input 
                            type="number"
                            value={tech.level}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setContent(prev => {
                                if (!prev) return null;
                                const newStack = [...(prev.common.techStack || [])];
                                newStack[index] = { ...newStack[index], level: val };
                                return {...prev, common: {...prev.common, techStack: newStack}};
                              });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent/50"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <label className="mono-label text-[10px] opacity-40">Description</label>
                          <textarea 
                            value={tech.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newStack = [...(prev.common.techStack || [])];
                                newStack[index] = { ...newStack[index], desc: val };
                                return {...prev, common: {...prev.common, techStack: newStack}};
                              });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent/50 min-h-[80px]"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <label className="mono-label text-[10px] opacity-40">Grid_Span (e.g. md:col-span-1)</label>
                          <input 
                            type="text"
                            value={tech.span || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newStack = [...(prev.common.techStack || [])];
                                newStack[index] = { ...newStack[index], span: val };
                                return {...prev, common: {...prev.common, techStack: newStack}};
                              });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent/50"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setContent(prev => {
                      if (!prev) return null;
                      const newTech = { name: "New Tech", iconName: "Code", category: "Language", level: 80, desc: "Description here", span: "md:col-span-1" };
                      return {...prev, common: {...prev.common, techStack: [...(prev.common.techStack || []), newTech]}};
                    })}
                    className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-2xl hover:border-accent/50 hover:bg-accent/5 transition-all group"
                  >
                    <Plus size={32} className="text-accent/40 group-hover:text-accent mb-4" />
                    <span className="mono-label text-xs opacity-40 group-hover:opacity-100">Add_New_Module</span>
                  </button>
                </div>
              </section>
              </>
            )}

            {activeTab === 'experience' && (
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold uppercase flex items-center gap-4">
                    <Layers size={20} className="text-accent" />
                    Work_Experience ({currentLang.toUpperCase()})
                  </h2>
                  <button 
                    onClick={() => {
                      const newEnExp = { company: "New Company", role: "Role", period: "2024", desc: "" };
                      const newZhExp = { company: "新公司", role: "职位", period: "2024", desc: "" };
                      setContent(prev => {
                        if (!prev) return null;
                        return {
                          ...prev, 
                          en: { ...prev.en, experience: [...(prev.en.experience || []), newEnExp] },
                          zh: { ...prev.zh, experience: [...(prev.zh.experience || []), newZhExp] }
                        };
                      });
                    }}
                    className="bg-accent/10 text-accent p-3 rounded-xl hover:bg-accent hover:text-bg transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="space-y-8">
                  {content[currentLang].experience.map((exp, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-bg/50 border border-white/5 p-8 rounded-2xl relative group hover:border-accent/30 transition-colors"
                    >
                      <button 
                        onClick={() => setShowDeleteConfirm({ type: 'experience', index })}
                        className="absolute top-4 right-4 text-red-500/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Company</label>
                          <input 
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newExp = [...prev[currentLang].experience];
                                newExp[index] = { ...newExp[index], company: val };
                                return {...prev, [currentLang]: {...prev[currentLang], experience: newExp}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Period</label>
                          <input 
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newExp = [...prev[currentLang].experience];
                                newExp[index] = { ...newExp[index], period: val };
                                return {...prev, [currentLang]: {...prev[currentLang], experience: newExp}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Role</label>
                          <input 
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newExp = [...prev[currentLang].experience];
                                newExp[index] = { ...newExp[index], role: val };
                                return {...prev, [currentLang]: {...prev[currentLang], experience: newExp}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Description</label>
                          <textarea 
                            value={exp.desc}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newExp = [...prev[currentLang].experience];
                                newExp[index] = { ...newExp[index], desc: val };
                                return {...prev, [currentLang]: {...prev[currentLang], experience: newExp}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none transition-colors h-24 resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'testimonials' && (
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold uppercase flex items-center gap-4">
                    <Users size={20} className="text-accent" />
                    Testimonials ({currentLang.toUpperCase()})
                  </h2>
                  <button 
                    onClick={() => {
                      const newEnTest = { name: "Name", role: "Role", text: "" };
                      const newZhTest = { name: "姓名", role: "职位", text: "" };
                      setContent(prev => {
                        if (!prev) return null;
                        return {
                          ...prev, 
                          en: { ...prev.en, testimonials: [...(prev.en.testimonials || []), newEnTest] },
                          zh: { ...prev.zh, testimonials: [...(prev.zh.testimonials || []), newZhTest] }
                        };
                      });
                    }}
                    className="bg-accent/10 text-accent p-3 rounded-xl hover:bg-accent hover:text-bg transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-8">
                  {content[currentLang].testimonials.map((test, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-bg/50 border border-white/5 p-8 rounded-2xl relative hover:border-accent/30 transition-colors"
                    >
                      <button 
                        onClick={() => setShowDeleteConfirm({ type: 'testimonial', index })}
                        className="absolute top-4 right-4 text-red-500/40 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Name</label>
                          <input 
                            type="text"
                            value={test.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newTest = [...prev[currentLang].testimonials];
                                newTest[index] = { ...newTest[index], name: val };
                                return {...prev, [currentLang]: {...prev[currentLang], testimonials: newTest}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Role</label>
                          <input 
                            type="text"
                            value={test.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newTest = [...prev[currentLang].testimonials];
                                newTest[index] = { ...newTest[index], role: val };
                                return {...prev, [currentLang]: {...prev[currentLang], testimonials: newTest}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Testimonial Text</label>
                          <textarea 
                            value={test.text}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newTest = [...prev[currentLang].testimonials];
                                newTest[index] = { ...newTest[index], text: val };
                                return {...prev, [currentLang]: {...prev[currentLang], testimonials: newTest}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none h-24 resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'education' && (
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold uppercase flex items-center gap-4">
                    <GraduationCap size={20} className="text-accent" />
                    Education ({currentLang.toUpperCase()})
                  </h2>
                  <button 
                    onClick={() => {
                      const newEnEdu = { school: "School", degree: "Degree", year: "Year" };
                      const newZhEdu = { school: "学校", degree: "学位", year: "年份" };
                      setContent(prev => {
                        if (!prev) return null;
                        return {
                          ...prev, 
                          en: { ...prev.en, education: [...(prev.en.education || []), newEnEdu] },
                          zh: { ...prev.zh, education: [...(prev.zh.education || []), newZhEdu] }
                        };
                      });
                    }}
                    className="bg-accent/10 text-accent p-3 rounded-xl hover:bg-accent hover:text-bg transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-8">
                  {content[currentLang].education.map((edu, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-bg/50 border border-white/5 p-8 rounded-2xl relative group hover:border-accent/30 transition-colors"
                    >
                      <button 
                        onClick={() => setShowDeleteConfirm({ type: 'education', index })}
                        className="absolute top-4 right-4 text-red-500/40 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">School</label>
                          <input 
                            type="text"
                            value={edu.school}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newEdu = [...prev[currentLang].education];
                                newEdu[index] = { ...newEdu[index], school: val };
                                return {...prev, [currentLang]: {...prev[currentLang], education: newEdu}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Degree</label>
                          <input 
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newEdu = [...prev[currentLang].education];
                                newEdu[index] = { ...newEdu[index], degree: val };
                                return {...prev, [currentLang]: {...prev[currentLang], education: newEdu}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Year</label>
                          <input 
                            type="text"
                            value={edu.year}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newEdu = [...prev[currentLang].education];
                                newEdu[index] = { ...newEdu[index], year: val };
                                return {...prev, [currentLang]: {...prev[currentLang], education: newEdu}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'services' && (
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold uppercase flex items-center gap-4">
                    <Palette size={20} className="text-accent" />
                    Services ({currentLang.toUpperCase()})
                  </h2>
                  <button 
                    onClick={() => {
                      const newId = Date.now() + Math.floor(Math.random() * 1000);
                      const newEnService = { id: newId, title: "Service Title", description: "" };
                      const newZhService = { id: newId, title: "服务标题", description: "" };
                      setContent(prev => {
                        if (!prev) return null;
                        return {
                          ...prev, 
                          en: { ...prev.en, services: [...(prev.en.services || []), newEnService] },
                          zh: { ...prev.zh, services: [...(prev.zh.services || []), newZhService] },
                          common: {
                            ...prev.common,
                            serviceIcons: { ...(prev.common.serviceIcons || {}), [newId]: "Code" }
                          }
                        };
                      });
                    }}
                    className="bg-accent/10 text-accent p-3 rounded-xl hover:bg-accent hover:text-bg transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-8">
                  {content[currentLang].services.map((service, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-bg/50 border border-white/5 p-8 rounded-2xl relative group hover:border-accent/30 transition-colors"
                    >
                      <button 
                        onClick={() => setShowDeleteConfirm({ type: 'service', index, id: service.id })}
                        className="absolute top-4 right-4 text-red-500/40 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Service Title</label>
                          <input 
                            type="text"
                            value={service.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newServices = [...prev[currentLang].services];
                                newServices[index] = { ...newServices[index], title: val };
                                return {...prev, [currentLang]: {...prev[currentLang], services: newServices}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Icon Name (Lucide)</label>
                          <input 
                            type="text"
                            value={content.common.serviceIcons[service.id] || "Code"}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                return {
                                  ...prev,
                                  common: {
                                    ...prev.common,
                                    serviceIcons: { ...prev.common.serviceIcons, [service.id]: val }
                                  }
                                };
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Description</label>
                          <textarea 
                            value={service.description}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newServices = [...prev[currentLang].services];
                                newServices[index] = { ...newServices[index], description: val };
                                return {...prev, [currentLang]: {...prev[currentLang], services: newServices}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none h-24 resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'achievements' && (
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold uppercase flex items-center gap-4">
                    <Trophy size={20} className="text-accent" />
                    Achievements ({currentLang.toUpperCase()})
                  </h2>
                  <button 
                    onClick={() => {
                      const newEnAch = { title: "Achievement Title", date: "Date", description: "" };
                      const newZhAch = { title: "成就标题", date: "日期", description: "" };
                      setContent(prev => {
                        if (!prev) return null;
                        return {
                          ...prev, 
                          en: { ...prev.en, achievements: [...(prev.en.achievements || []), newEnAch] },
                          zh: { ...prev.zh, achievements: [...(prev.zh.achievements || []), newZhAch] }
                        };
                      });
                    }}
                    className="bg-accent/10 text-accent p-3 rounded-xl hover:bg-accent hover:text-bg transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-8">
                  {content[currentLang].achievements.map((ach, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-bg/50 border border-white/5 p-8 rounded-2xl relative group hover:border-accent/30 transition-colors"
                    >
                      <button 
                        onClick={() => setShowDeleteConfirm({ type: 'achievement', index })}
                        className="absolute top-4 right-4 text-red-500/40 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Achievement Title</label>
                          <input 
                            type="text"
                            value={ach.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newAch = [...prev[currentLang].achievements];
                                newAch[index] = { ...newAch[index], title: val };
                                return {...prev, [currentLang]: {...prev[currentLang], achievements: newAch}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Date</label>
                          <input 
                            type="text"
                            value={ach.date}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newAch = [...prev[currentLang].achievements];
                                newAch[index] = { ...newAch[index], date: val };
                                return {...prev, [currentLang]: {...prev[currentLang], achievements: newAch}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Description</label>
                          <textarea 
                            value={ach.description}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent(prev => {
                                if (!prev) return null;
                                const newAch = [...prev[currentLang].achievements];
                                newAch[index] = { ...newAch[index], description: val };
                                return {...prev, [currentLang]: {...prev[currentLang], achievements: newAch}};
                              });
                            }}
                            className="w-full bg-bg border border-white/10 p-4 rounded-xl focus:border-accent outline-none h-24 resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-12">
                {/* Templates Management */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold uppercase flex items-center gap-4">
                      <MessageSquare size={20} className="text-accent" />
                      Reply_Templates
                    </h2>
                    <button 
                      onClick={() => setShowTemplateForm(!showTemplateForm)}
                      className="bg-accent/10 text-accent p-3 rounded-xl hover:bg-accent hover:text-bg transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {showTemplateForm && (
                    <div className="mb-8 bg-bg/50 border border-white/10 p-6 rounded-2xl space-y-4">
                      <div className="space-y-2">
                        <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Template Title</label>
                        <input 
                          type="text"
                          value={newTemplate.title}
                          onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                          className="w-full bg-bg border border-white/10 p-3 rounded-xl focus:border-accent outline-none"
                          placeholder="e.g., Thank You Note"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Template Body</label>
                        <textarea 
                          value={newTemplate.body}
                          onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                          className="w-full bg-bg border border-white/10 p-3 rounded-xl focus:border-accent outline-none h-32 resize-none"
                          placeholder="Write your template message here..."
                        />
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={async () => {
                            if (!newTemplate.title || !newTemplate.body) return;
                            try {
                              const response = await fetch('/api/templates', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newTemplate),
                              });
                              if (response.ok) {
                                fetchTemplates();
                                setNewTemplate({ title: '', body: '' });
                                setShowTemplateForm(false);
                                setMessage({ type: 'success', text: 'Template added successfully!' });
                                setTimeout(() => setMessage(null), 3000);
                              }
                            } catch (error) {
                              console.error('Error adding template:', error);
                            }
                          }}
                          className="bg-accent text-bg px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest"
                        >
                          Save Template
                        </button>
                        <button 
                          onClick={() => setShowTemplateForm(false)}
                          className="bg-white/5 text-muted px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div key={template._id} className="bg-bg/30 border border-white/5 p-6 rounded-2xl relative group">
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/templates/${template._id}`, { method: 'DELETE' });
                              if (response.ok) {
                                fetchTemplates();
                                setMessage({ type: 'success', text: 'Template deleted.' });
                                setTimeout(() => setMessage(null), 3000);
                              }
                            } catch (error) {
                              console.error('Error deleting template:', error);
                            }
                          }}
                          className="absolute top-4 right-4 text-red-500/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h3 className="font-bold uppercase text-sm mb-2">{template.title}</h3>
                        <p className="text-muted text-xs line-clamp-2 font-light">{template.body}</p>
                      </div>
                    ))}
                    {templates.length === 0 && !showTemplateForm && (
                      <div className="col-span-2 text-center py-12 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-muted font-mono text-[10px] uppercase tracking-widest">No templates created yet.</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Messages List */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                  <h2 className="text-2xl font-bold uppercase mb-8 flex items-center gap-4">
                    <Mail size={20} className="text-accent" />
                    Inbound_Messages
                  </h2>
                  <div className="space-y-6">
                    {messages.map((msg, index) => (
                      <motion.div 
                        key={msg._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-bg/50 border ${msg.replied ? 'border-green-500/20' : 'border-white/5'} p-8 rounded-2xl relative group hover:border-accent/30 transition-all`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold uppercase tracking-tight">{msg.name}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-accent text-xs font-mono">{msg.email}</p>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.email);
                                  setCopiedId(msg._id);
                                  setTimeout(() => setCopiedId(null), 2000);
                                }}
                                className="text-muted hover:text-accent transition-colors"
                              >
                                {copiedId === msg._id ? <CheckCircle2 size={12} /> : <Edit3 size={12} />}
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-muted uppercase">
                            {new Date(msg.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted mb-6 font-light leading-relaxed">{msg.message}</p>
                        
                        <div className="flex items-center gap-4">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setReplyingTo(msg);
                              setReplyBody('');
                            }}
                            className={`px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest transition-all ${
                              msg.replied 
                                ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                : 'bg-accent text-bg shadow-lg'
                            }`}
                          >
                            {msg.replied ? 'Replied' : 'Reply Now'}
                          </motion.button>
                          {!msg.replied && (
                            <button 
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/messages/${msg._id}/replied`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ replied: true }),
                                  });
                                  if (response.ok) fetchMessages();
                                } catch (error) {
                                  console.error('Error marking as replied:', error);
                                }
                              }}
                              className="text-muted hover:text-white font-mono text-[10px] uppercase tracking-widest"
                            >
                              Mark as Replied
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                        <Mail size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-muted font-mono text-[10px] uppercase tracking-widest">No messages received yet.</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Reply Modal */}
                <AnimatePresence>
                  {replyingTo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setReplyingTo(null)}
                        className="absolute inset-0 bg-bg/80 backdrop-blur-md"
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-bg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
                      >
                        <button 
                          onClick={() => setReplyingTo(null)}
                          className="absolute top-6 right-6 text-muted hover:text-white transition-colors"
                        >
                          <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold uppercase mb-2">Reply_to_<span className="text-accent">{replyingTo.name}</span></h2>
                        <p className="text-muted text-xs font-mono mb-8">{replyingTo.email}</p>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Select Template</label>
                            <div className="flex flex-wrap gap-2">
                              {templates.map((template) => (
                                <button 
                                  key={template._id}
                                  onClick={() => setReplyBody(template.body)}
                                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-accent hover:text-bg transition-all"
                                >
                                  {template.title}
                                </button>
                              ))}
                              {templates.length === 0 && (
                                <p className="text-[10px] text-muted italic">No templates available. Create some in the Messages tab.</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block font-mono text-[10px] uppercase tracking-widest opacity-40">Message Body</label>
                            <textarea 
                              value={replyBody}
                              onChange={(e) => setReplyBody(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-accent outline-none h-64 resize-none font-light leading-relaxed"
                              placeholder="Type your reply here..."
                            />
                          </div>

                          <button 
                            onClick={async () => {
                              // In a real app, this would send an email
                              // For now, we'll just mark as replied
                              try {
                                const response = await fetch(`/api/messages/${replyingTo._id}/replied`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ replied: true }),
                                });
                                if (response.ok) {
                                  fetchMessages();
                                  setReplyingTo(null);
                                  setMessage({ type: 'success', text: 'Reply sent (simulated) and message marked as replied!' });
                                  setTimeout(() => setMessage(null), 3000);
                                }
                              } catch (error) {
                                console.error('Error sending reply:', error);
                              }
                            }}
                            className="w-full bg-accent text-bg py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                          >
                            <Send size={18} />
                            Send Reply
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {activeTab === 'ai' && (
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[600px]">
                <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <Bot size={20} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest">Joyi_AI [Admin_Expert]</h3>
                      <p className="text-[8px] font-mono text-muted uppercase tracking-widest">Neural_Link: Ultra_Fast_Active</p>
                    </div>
                  </div>
                </div>

                <div 
                  ref={aiScrollRef}
                  className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide"
                >
                  {aiMessages.map((msg, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx}
                      className={cn(
                        "flex gap-4",
                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        msg.role === 'user' ? "bg-white/10" : "bg-accent/20"
                      )}>
                        {msg.role === 'user' ? <User size={18} /> : <Bot size={18} className="text-accent" />}
                      </div>
                      <div className={cn(
                        "max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed relative overflow-hidden",
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
                            className="w-full h-auto rounded-lg mb-4 border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className={cn(
                          "markdown-body prose prose-invert prose-sm max-w-none",
                          msg.isGlitchy && "skew-x-1"
                        )}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {aiIsLoading && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <Bot size={18} className="text-accent" />
                      </div>
                      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl rounded-tl-none">
                        <div className="flex items-center gap-3">
                          <Loader2 size={18} className="animate-spin text-accent" />
                          <span className="text-[10px] font-mono text-accent uppercase tracking-widest animate-pulse">
                            Processing Engineering Logic...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white/5 border-t border-white/10">
                  {aiSelectedImage && (
                    <div className="mb-4 relative inline-block">
                      <img 
                        src={aiSelectedImage} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-xl border border-accent"
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        onClick={() => setAiSelectedImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  <div className="relative flex items-center gap-3">
                    <input 
                      type="file"
                      ref={aiFileInputRef}
                      onChange={handleAiImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => aiFileInputRef.current?.click()}
                      className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors text-muted"
                    >
                      <Plus size={20} />
                    </button>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={aiInput}
                          maxLength={2000}
                          onChange={(e) => setAiInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAiSendMessage()}
                          placeholder="Ask Joyi for help with portfolio management, code, or strategy..."
                          className="w-full bg-bg border border-white/10 rounded-2xl py-4 pl-6 pr-32 text-sm outline-none focus:border-accent transition-colors"
                        />
                        <div className={cn(
                          "absolute right-16 top-1/2 -translate-y-1/2 text-[10px] font-mono transition-colors pointer-events-none",
                          aiInput.length >= 1800 ? "text-red-500" : "text-muted/40"
                        )}>
                          {aiInput.length}/2000
                        </div>
                        <button
                          onClick={handleAiSendMessage}
                          disabled={(!aiInput.trim() && !aiSelectedImage) || aiIsLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent text-bg rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteConfirm(null)}
                className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white/5 border border-white/10 p-12 rounded-[40px] max-w-md w-full text-center shadow-2xl"
              >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-3xl font-bold uppercase mb-4 tracking-tighter">Confirm_Delete</h3>
                <p className="text-muted mb-10 font-light leading-relaxed">
                  Are you sure you want to delete this {showDeleteConfirm.type}? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 bg-white/5 border border-white/10 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      const { type, index, id } = showDeleteConfirm;
                      if (type === 'project') {
                        setContent(prev => {
                          if (!prev) return null;
                          const newEnProjects = prev.en.projects.filter(p => p.id !== id);
                          const newZhProjects = prev.zh.projects.filter(p => p.id !== id);
                          const newImages = { ...prev.common.projectImages };
                          const newTech = { ...prev.common.projectTech };
                          delete newImages[id];
                          delete newTech[id];
                          return {
                            ...prev,
                            en: { ...prev.en, projects: newEnProjects },
                            zh: { ...prev.zh, projects: newZhProjects },
                            common: { ...prev.common, projectImages: newImages, projectTech: newTech }
                          };
                        });
                      } else if (type === 'experience') {
                        setContent(prev => {
                          if (!prev) return null;
                          const newEnExp = [...prev.en.experience];
                          const newZhExp = [...prev.zh.experience];
                          newEnExp.splice(index, 1);
                          newZhExp.splice(index, 1);
                          return {
                            ...prev,
                            en: { ...prev.en, experience: newEnExp },
                            zh: { ...prev.zh, experience: newZhExp }
                          };
                        });
                      } else if (type === 'testimonial') {
                        setContent(prev => {
                          if (!prev) return null;
                          const newEnTest = [...prev.en.testimonials];
                          const newZhTest = [...prev.zh.testimonials];
                          newEnTest.splice(index, 1);
                          newZhTest.splice(index, 1);
                          return {
                            ...prev,
                            en: { ...prev.en, testimonials: newEnTest },
                            zh: { ...prev.zh, testimonials: newZhTest }
                          };
                        });
                      } else if (type === 'education') {
                        setContent(prev => {
                          if (!prev) return null;
                          const newEnEdu = [...prev.en.education];
                          const newZhEdu = [...prev.zh.education];
                          newEnEdu.splice(index, 1);
                          newZhEdu.splice(index, 1);
                          return {
                            ...prev,
                            en: { ...prev.en, education: newEnEdu },
                            zh: { ...prev.zh, education: newZhEdu }
                          };
                        });
                      } else if (type === 'service') {
                        setContent(prev => {
                          if (!prev) return null;
                          const newEnServices = [...prev.en.services];
                          const newZhServices = [...prev.zh.services];
                          newEnServices.splice(index, 1);
                          newZhServices.splice(index, 1);
                          const newServiceIcons = { ...prev.common.serviceIcons };
                          delete newServiceIcons[id];
                          return {
                            ...prev,
                            en: { ...prev.en, services: newEnServices },
                            zh: { ...prev.zh, services: newZhServices },
                            common: { ...prev.common, serviceIcons: newServiceIcons }
                          };
                        });
                      } else if (type === 'achievement') {
                        setContent(prev => {
                          if (!prev) return null;
                          const newEnAch = [...prev.en.achievements];
                          const newZhAch = [...prev.zh.achievements];
                          newEnAch.splice(index, 1);
                          newZhAch.splice(index, 1);
                          return {
                            ...prev,
                            en: { ...prev.en, achievements: newEnAch },
                            zh: { ...prev.zh, achievements: newZhAch }
                          };
                        });
                      } else if (type === 'database') {
                        seedDatabase();
                      }
                      setShowDeleteConfirm(null);
                    }}
                    className="flex-1 bg-red-500 text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-lg shadow-red-500/20"
                  >
                    Delete Now
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-2xl backdrop-blur-xl border",
                message.type === 'success' 
                  ? "bg-green-500/10 text-green-500 border-green-500/20" 
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              )}
            >
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
