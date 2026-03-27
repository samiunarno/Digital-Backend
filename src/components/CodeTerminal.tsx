import React, { useState, useEffect } from 'react';

const COMMANDS = [
  { cmd: 'npm install @joyi/core', output: 'Installing dependencies...' },
  { cmd: 'joyi --init', output: 'Initializing system architecture...' },
  { cmd: 'joyi build --production', output: 'Optimizing assets for production...' },
  { cmd: 'joyi deploy', output: 'Deployment successful. Node active.' },
  { cmd: 'cat config.json', output: '{ "status": "operational", "mode": "creative" }' },
  { cmd: 'whoami', output: 'Joyi Arnouk // Full Stack Developer' },
];

export default function CodeTerminal() {
  const [lines, setLines] = useState<{ type: 'cmd' | 'out'; text: string }[]>([]);
  const [currentCmdIndex, setCurrentCmdIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentCmdIndex >= COMMANDS.length) {
      setTimeout(() => {
        setLines([]);
        setCurrentCmdIndex(0);
        setCharIndex(0);
        setIsTyping(true);
      }, 3000);
      return;
    }

    const current = COMMANDS[currentCmdIndex];

    if (isTyping) {
      if (charIndex < current.cmd.length) {
        const timeout = setTimeout(() => {
          setCharIndex(prev => prev + 1);
        }, 50 + Math.random() * 50);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setLines(prev => [...prev, 
            { type: 'cmd', text: `> ${current.cmd}` },
            { type: 'out', text: current.output }
          ]);
          setCurrentCmdIndex(prev => prev + 1);
          setCharIndex(0);
          setIsTyping(true);
        }, 500);
      }
    }
  }, [currentCmdIndex, charIndex, isTyping]);

  return (
    <div className="w-full aspect-[4/3] bg-bg border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="font-mono text-[10px] text-muted uppercase tracking-widest">bash — 80x24</div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 font-mono text-[11px] leading-relaxed overflow-y-auto flex-1 custom-scrollbar">
        {lines.map((line, i) => (
          <div key={i} className={line.type === 'cmd' ? 'text-accent mb-1' : 'text-muted/60 mb-3 ml-4'}>
            {line.text}
          </div>
        ))}
        
        {currentCmdIndex < COMMANDS.length && (
          <div className="text-accent">
            {`> `}{COMMANDS[currentCmdIndex].cmd.substring(0, charIndex)}
            <span className="w-2 h-4 bg-accent inline-block align-middle ml-1 animate-pulse" />
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="bg-accent/5 px-4 py-1 flex justify-between items-center border-t border-white/5">
        <div className="text-[9px] font-mono text-accent/40">UTF-8</div>
        <div className="text-[9px] font-mono text-accent/40">Joyi_OS v1.0.4</div>
      </div>
    </div>
  );
}
