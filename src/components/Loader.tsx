import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'motion/react';

export default function Loader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });

      // Initial state
      gsap.set('.loader-line', { scaleX: 0, transformOrigin: 'left' });
      gsap.set('.loader-circle', { scale: 0, opacity: 0 });

      tl.to('.loader-line', {
        scaleX: 1,
        duration: 1.5,
        ease: 'power4.inOut',
        stagger: 0.2
      })
      .to('.loader-circle', {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.1
      }, '-=1')
      .to('.loader-text', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05
      }, '-=0.5')
      .to('.loader-line', {
        scaleX: 0,
        transformOrigin: 'right',
        duration: 1,
        ease: 'power4.inOut',
        stagger: 0.1
      }, '+=0.5')
      .to('.loader-circle', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power4.in'
      }, '-=0.5');

      // Progress bar simulation
      gsap.to(progressRef.current, {
        width: '100%',
        duration: 3,
        ease: 'none',
        repeat: -1
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div 
      ref={containerRef} 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative flex flex-col items-center">
        {/* SVG Animation */}
        <svg ref={svgRef} width="120" height="120" viewBox="0 0 100 100" className="mb-8">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="283" strokeDashoffset="283" className="text-accent loader-circle" />
          
          <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-accent loader-line" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-accent loader-line" />
          
          <rect x="45" y="45" width="10" height="10" fill="currentColor" className="text-accent loader-circle" />
        </svg>

        {/* Text Animation */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex overflow-hidden">
              {"INITIALIZING".split("").map((char, i) => (
                <span key={i} className="loader-text inline-block font-mono text-[10px] tracking-[0.4em] text-white opacity-0 translate-y-4">
                  {char}
                </span>
              ))}
            </div>
            <div className="font-mono text-[8px] tracking-[0.2em] text-muted uppercase opacity-50 loader-text translate-y-4">
              Joyi_Portfolio_v2.0
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="font-sans text-[12px] font-medium tracking-widest text-accent loader-text opacity-0 translate-y-4">
              欢迎来到 Joyi 的个人资料
            </div>
            <div className="font-mono text-[8px] tracking-[0.1em] text-muted uppercase opacity-40 loader-text opacity-0 translate-y-4">
              Welcome To Joyi Profile
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute -bottom-12 w-48 h-[1px] bg-white/10 overflow-hidden">
          <div ref={progressRef} className="h-full bg-accent w-0" />
        </div>
      </div>

      {/* Decorative Corner Accents */}
      <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-accent/30" />
      <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-accent/30" />
      <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-accent/30" />
      <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-accent/30" />
    </motion.div>
  );
}
