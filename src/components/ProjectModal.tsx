import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Terminal, Cpu, Globe, Layers } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-bg border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 bg-bg/50 backdrop-blur-md border border-white/10 rounded-full hover:bg-accent hover:text-bg transition-all duration-300"
            >
              <X size={20} />
            </button>

            {/* Left: Image/Visual */}
            <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-auto relative overflow-hidden bg-white/5">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
              
              {/* Floating Tech Badges */}
              <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="px-3 py-1 bg-bg/80 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
              <div className="mono-label text-accent mb-4">Project_Case_Study_{project.id}</div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6 tracking-tighter leading-none">
                {project.title}
              </h2>
              
              <div className="space-y-8 flex-1">
                <section>
                  <h4 className="mono-label text-[10px] text-muted uppercase tracking-widest mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                    <Terminal size={14} className="text-accent" /> Overview
                  </h4>
                  <p className="text-muted font-light leading-relaxed">
                    {project.description} This project focuses on delivering a high-performance, scalable solution using modern architectural patterns. It addresses complex data management and provides a seamless user experience through optimized rendering and state management.
                  </p>
                </section>

                <section>
                  <h4 className="mono-label text-[10px] text-muted uppercase tracking-widest mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                    <Cpu size={14} className="text-accent" /> Core Architecture
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                      <div className="text-accent font-bold text-xs mb-1">Frontend</div>
                      <div className="text-[10px] text-muted/60">React, TypeScript, Tailwind</div>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg">
                      <div className="text-accent font-bold text-xs mb-1">Backend</div>
                      <div className="text-[10px] text-muted/60">Node.js, Express, PostgreSQL</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="mono-label text-[10px] text-muted uppercase tracking-widest mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                    <Layers size={14} className="text-accent" /> Key Features
                  </h4>
                  <ul className="space-y-2 text-sm text-muted/80 font-light">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent rounded-full" /> Real-time data synchronization
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent rounded-full" /> Advanced analytics dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-accent rounded-full" /> Secure OAuth2 authentication
                    </li>
                  </ul>
                </section>
              </div>

              {/* Actions */}
              <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                <a href="#" className="flex-1 group relative py-4 border border-accent bg-accent/5 hover:bg-accent transition-all duration-500 text-center">
                  <span className="relative z-10 text-accent group-hover:text-bg font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2">
                    Live Demo <ExternalLink size={14} />
                  </span>
                </a>
                <a href="#" className="flex-1 group relative py-4 border border-white/10 hover:border-white transition-all duration-500 text-center">
                  <span className="relative z-10 uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2">
                    Source Code <Github size={14} />
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
