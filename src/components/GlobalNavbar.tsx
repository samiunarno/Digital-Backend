import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot } from 'lucide-react';

export default function GlobalNavbar() {
  const location = useLocation();
  const onAI = location.pathname === '/ai';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-white/10 bg-bg/90 backdrop-blur-xl"
      style={{ paddingTop: '16px' }}
    >

      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors">
          <span className="font-mono uppercase text-xs tracking-widest">Portfolio</span>
        </Link>
        <span className="text-muted/40 hidden md:inline">/</span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted hidden sm:inline">
          {onAI ? 'AI' : 'Home'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/ai"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-[12px] font-mono text-gray-200"
        >
          <Bot size={16} className="text-cyan-400" />
          Joyi_AI
        </Link>
      </div>
    </nav>
  );
}

