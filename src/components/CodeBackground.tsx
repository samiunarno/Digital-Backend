import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CODE_SNIPPETS = [
  'const app = express();',
  'import { motion } from "motion/react";',
  'function initialize() {',
  '  return new Promise((resolve) => {',
  '    console.log("System.Ready");',
  '    resolve(true);',
  '  });',
  '}',
  'git commit -m "feat: add neural engine"',
  'npm install @google/genai',
  'docker-compose up -d',
  'SELECT * FROM users WHERE active = true;',
  'while(alive) { code(); sleep(); }',
  '01010111 01101111 01110010 01101100 01100100',
  'const [state, setState] = useState(null);',
  'export default function Portfolio() {',
  'gsap.to(".hero", { opacity: 1 });',
  'System.Core.Architecture // v2.5.0',
];

export default function CodeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const createLine = (x: number) => {
      const line = document.createElement('div');
      line.className = 'absolute font-mono text-[10px] text-accent/10 whitespace-nowrap pointer-events-none select-none';
      line.style.left = `${x}px`;
      line.style.top = `-${Math.random() * 500}px`;
      line.innerText = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      container.appendChild(line);

      const duration = 20 + Math.random() * 30;
      const xOffset = (Math.random() - 0.5) * 100;
      
      gsap.to(line, {
        y: height + 600,
        x: `+=${xOffset}`,
        duration: duration,
        ease: 'none',
        onComplete: () => {
          line.remove();
          createLine(x);
        }
      });
    };

    const initialColumns = Math.floor(width / 300);
    for (let i = 0; i < initialColumns; i++) {
      setTimeout(() => {
        createLine(Math.random() * width);
      }, i * 1000);
    }

    return () => {
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40"
      aria-hidden="true"
    />
  );
}
