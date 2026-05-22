import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, ArrowLeft, Bot, Zap, GitBranch, ExternalLink,
  Wifi, WifiOff, Sparkles, Database, Sun, Moon,
  Maximize2, Minimize2, Languages, RefreshCw, Layers, LogOut
} from 'lucide-react';

function cn(...c: (string | boolean | undefined)[]) { return c.filter(Boolean).join(' '); }

export default function GlobalNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // GitHub status telemetry (for Vibe Coder Studio)
  const [githubStatus, setGithubStatus] = useState<any>(null);
  
  // Custom states for Project Builder integration
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Apply dark/light class globally and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [vibeMode, setVibeMode] = useState<'chill' | 'focused' | 'creative'>('creative');
  
  // Custom states for CMS dashboard
  const [currentLang, setCurrentLang] = useState<'en' | 'zh'>('en');

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setCurrentUser(parsed);
        setIsAdmin(parsed.role === 'admin');
      } catch {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    } else {
      setCurrentUser(null);
      setIsAdmin(false);
    }
  }, [location.pathname]);

  // Load telemetry when on vibe-coder
  useEffect(() => {
    if (path === '/vibe-coder') {
      fetch('/api/github/status')
        .then(r => r.json())
        .then(d => setGithubStatus(d))
        .catch(() => setGithubStatus({ connected: false }));
    }
  }, [path]);

  // Sync state changes with custom events for the Project Builder
  const handleVibeModeChange = (mode: 'chill' | 'focused' | 'creative') => {
    setVibeMode(mode);
    window.dispatchEvent(new CustomEvent('project-builder-vibe-change', { detail: mode }));
  };

  const handleDarkModeToggle = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    window.dispatchEvent(new CustomEvent('project-builder-dark-toggle', { detail: next }));
  };

  const handleFullscreenToggle = () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    window.dispatchEvent(new CustomEvent('project-builder-fullscreen-toggle', { detail: next }));
  };

  // Sync state changes with custom events for CMS dashboard language switcher
  const handleLangToggle = (lang: 'en' | 'zh') => {
    setCurrentLang(lang);
    window.dispatchEvent(new CustomEvent('cms-lang-change', { detail: lang }));
  };

  // Listen to fullscreen changes from document level to keep sync
  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 z-50 border-b border-border bg-bg/85 backdrop-blur-2xl px-6 flex items-center justify-between shadow-[0_1px_12px_rgba(0,0,0,0.15)] select-none transition-colors duration-500">
      
      {/* ── LEFT SECTION: BRANDING & BREADCRUMBS ── */}
      <div className="flex items-center gap-3">
        {/* On AI Chat / Vibe Coder / CMS / Project Builder: Show sleek context breadcrumbs */}
        {path === '/ai' && (
          <>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-sidebar'))}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all mr-1"
              title="Toggle Chat Sidebar"
            >
              <Menu size={16} />
            </button>
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 text-xs font-mono uppercase tracking-wider group">
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
            <span className="text-white/10 select-none">/</span>
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 px-2.5 py-1 rounded-xl border border-cyan-500/10 select-none">
              <Bot size={13} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                Joyi AI Chat
              </span>
            </div>
          </>
        )}

        {path === '/vibe-coder' && (
          <>
            <Link to="/cms" className="flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 text-xs font-mono uppercase tracking-wider group">
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <span className="text-white/10 select-none">/</span>
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 px-2.5 py-1 rounded-xl border border-cyan-500/15 shadow-[0_0_15px_rgba(6,182,212,0.05)] select-none">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <span className="text-xs font-mono font-bold tracking-[0.1em] bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent uppercase">
                Vibe Coder
              </span>
              <span className="text-[9px] font-mono font-semibold text-cyan-400/40 bg-cyan-500/10 px-1 py-0.2 rounded border border-cyan-500/10 uppercase tracking-wider hidden sm:inline-block">
                Studio
              </span>
            </div>
          </>
        )}

        {path === '/project-builder' && (
          <>
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 text-xs font-mono uppercase tracking-wider group">
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
            <span className="text-white/10 select-none">/</span>
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 px-2.5 py-1 rounded-xl border border-cyan-500/15 shadow-[0_0_15px_rgba(6,182,212,0.05)] select-none">
              <Sparkles size={13} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                Vibe Builder
              </span>
            </div>
          </>
        )}

        {path === '/cms' && (
          <>
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 text-xs font-mono uppercase tracking-wider group">
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>
            <span className="text-white/10 select-none">/</span>
            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 px-2.5 py-1 rounded-xl border border-cyan-500/10 select-none">
              <Database size={13} className="text-cyan-400" />
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                Admin Panel
              </span>
            </div>
          </>
        )}

        {/* Default / Live Portfolio Homepage Style */}
        {path !== '/ai' && path !== '/vibe-coder' && path !== '/cms' && path !== '/project-builder' && (
          <Link to="/" className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors">
            <span className="font-mono uppercase text-xs font-bold tracking-[0.25em]">Dong_Xiao_Xuan</span>
            <span className="text-[9px] font-mono text-cyan-400/60 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase hidden xs:inline">
              Portfolio
            </span>
          </Link>
        )}
      </div>

      {/* ── RIGHT SECTION: DYNAMIC CONTROLS & STATUS ── */}
      <div className="flex items-center gap-4">
        
        {/* Global Dark Mode Toggle */}
        <button
          onClick={handleDarkModeToggle}
          className="p-1.5 rounded-xl border border-border bg-white/[0.02] dark:bg-white/5 hover:bg-accent/5 hover:text-accent text-muted transition-all duration-300 flex items-center justify-center cursor-pointer"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={14} className="text-amber-400 animate-[spin_8s_linear_infinite]" /> : <Moon size={14} className="text-cyan-400" />}
        </button>
        
        {/* On Vibe Coder Studio: Telemetry and connection dashboard */}
        {path === '/vibe-coder' && (
          <>
            {githubStatus?.connected && (
              <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-gray-400 bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 rounded-xl">
                <GitBranch size={12} className="text-cyan-400/70" />
                <span className="text-gray-500">Branch:</span>
                <span className="text-gray-300 font-bold">main</span>
              </div>
            )}

            <div className={cn(
              'flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider border transition-all duration-300',
              githubStatus?.connected
                ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                : 'bg-red-500/5 border-red-500/15 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.05)]'
            )}>
              <div className="relative flex h-2 w-2">
                {githubStatus?.connected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={cn(
                  'relative inline-flex rounded-full h-2 w-2',
                  githubStatus?.connected ? 'bg-emerald-500' : 'bg-red-500'
                )}></span>
              </div>
              
              {githubStatus === null ? (
                <span className="text-gray-400 animate-pulse">CONNECTING…</span>
              ) : githubStatus.connected ? (
                <a href={githubStatus.url} target="_blank" rel="noopener noreferrer" 
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-bold tracking-widest">
                  <span>{githubStatus.repo}</span>
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              ) : (
                <span className="tracking-widest font-semibold">Offline</span>
              )}
            </div>
          </>
        )}

        {/* On AI Chat: Simple node active telemetry + Vibe Code switch */}
        {path === '/ai' && (
          <>
            {isAdmin && (
              <Link
                to="/vibe-coder"
                className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-all text-[10px] sm:text-xs font-mono text-gray-200 flex items-center gap-1.5"
                title="Open Joyi Vibe Coder"
              >
                <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                <span className="hidden xs:inline">Vibe Studio</span>
              </Link>
            )}

            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 bg-white/[0.02] border border-white/[0.04] px-3 py-1.5 rounded-xl select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">JOYI_AR2_ACTIVE</span>
            </div>
          </>
        )}

        {/* On Project Builder: Dark/Light Mode + Vibe Mode + Fullscreen Selector */}
        {path === '/project-builder' && (
          <>
            {/* Vibe Mode Select */}
            <div className="hidden sm:flex items-center gap-1 rounded-xl border border-border bg-white/[0.02] dark:bg-white/5 p-1">
              {(['chill', 'focused', 'creative'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleVibeModeChange(mode)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-mono capitalize transition-all",
                    vibeMode === mode
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                      : "text-muted hover:text-ink"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={handleFullscreenToggle}
              className="p-1.5 rounded-xl border border-border hover:bg-accent/5 hover:text-accent text-muted"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AR-2</span>
            </div>
          </>
        )}

        {/* On CMS Dashboard: Lang Selection, system telemetry */}
        {path === '/cms' && (
          <>
            <div className="flex bg-white/[0.02] dark:bg-white/5 p-1 rounded-full border border-border">
              <button 
                onClick={() => handleLangToggle('en')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[9px] font-mono uppercase tracking-wider transition-all",
                  currentLang === 'en' ? "bg-accent text-bg font-bold" : "text-muted hover:text-ink"
                )}
              >
                EN
              </button>
              <button 
                onClick={() => handleLangToggle('zh')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[9px] font-mono uppercase tracking-wider transition-all",
                  currentLang === 'zh' ? "bg-accent text-bg font-bold" : "text-muted hover:text-ink"
                )}
              >
                ZH
              </button>
            </div>

            <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-400 bg-cyan-500/5 border border-cyan-500/15 px-3 py-1.5 rounded-xl select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>ONLINE</span>
            </div>
          </>
        )}

        {/* Default Navigation Button to AI page on other routes */}
        {path !== '/ai' && path !== '/vibe-coder' && path !== '/cms' && path !== '/project-builder' && (
          <Link
            to="/ai"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/20 transition-all text-xs font-mono font-bold text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Bot size={13} className="text-cyan-400" />
            <span>Joyi_AI</span>
          </Link>
        )}

        {/* Dynamic Sign Out Button */}
        {currentUser && (
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('isAdmin');
              setCurrentUser(null);
              setIsAdmin(false);
              navigate('/admin');
            }}
            className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all duration-300 flex items-center justify-center cursor-pointer"
            title="Log Out"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>

    </nav>
  );
}
