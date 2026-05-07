import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioContent, Language } from '../types';
import { 
  ArrowRight, Github, Linkedin, Mail, Instagram, Cpu, Globe, Shield, 
  Code, Terminal, Layers, Activity, Database, Layout, 
  GitBranch, Server, Workflow, Box, Award, Trophy, Image, Camera, Mic,
  ChevronLeft, ChevronRight, Palette, Sun, Moon, Users, Zap, Eye, BarChart,
  Search, GitCommit, CheckCheck, Rocket, LightbulbIcon, Wrench
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import CodeBackground from './CodeBackground';
import CodeTerminal from './CodeTerminal';
import ProjectModal from './ProjectModal';
import GeminiChat from './GeminiChat';
import { useSectionTracking, useInteractionTracking } from '../hooks/useAnalytics';
import { initialPortfolioData } from '../data/portfolioData';
import { AnimatePresence, motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

// ─── Animated Counter Hook ───────────────────────────────────────────────────
function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
}



const TechIcon = ({ name, size = 24 }: { name: string; size?: number }) => {
  const icons: { [key: string]: React.ReactNode } = {
    Terminal: <Terminal size={size} />,
    Cpu: <Cpu size={size} />,
    Zap: <Zap size={size} />,
    Eye: <Eye size={size} />,
    BarChart: <BarChart size={size} />,
    Globe: <Globe size={size} />,
    Database: <Database size={size} />,
    Code: <Code size={size} />,
    Layers: <Layers size={size} />,
    Activity: <Activity size={size} />,
    Layout: <Layout size={size} />,
    GitBranch: <GitBranch size={size} />,
    Server: <Server size={size} />,
    Workflow: <Workflow size={size} />,
    Box: <Box size={size} />,
    Award: <Award size={size} />,
    Trophy: <Trophy size={size} />,
    Image: <Image size={size} />,
    Camera: <Camera size={size} />,
    Mic: <Mic size={size} />,
    Palette: <Palette size={size} />,
    Users: <Users size={size} />,
    Shield: <Shield size={size} />,
  };
  return icons[name] || <Code size={size} />;
};

export default function Portfolio() {
  // Content comes entirely from local mock data — no server calls needed.
  // To update portfolio content, edit: src/data/portfolioData.ts
  const [content, setContent] = useState<PortfolioContent>(initialPortfolioData);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // Check localStorage for any CMS edits saved locally
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as PortfolioContent;
        if (parsed?.en && parsed?.zh && parsed?.common) {
          setContent(parsed);
        }
      } catch {
        // If parsing fails, use default mock data
      }
    }
  }, []);

  // Reset testimonial index when language changes to prevent out-of-bounds errors
  useEffect(() => {
    if (content && content[language]?.testimonials) {
      if (currentTestimonialIndex >= content[language].testimonials.length) {
        setCurrentTestimonialIndex(0);
      }
    }
  }, [language, content]);

  const getTechStack = (lang: Language) => {
    if (!content?.[lang]?.techStack) return [];
    return content[lang].techStack.map(tech => ({
      ...tech,
      icon: <TechIcon name={tech.iconName} size={24} />
    }));
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  // Magnetic Effect Hook
  const magneticRef = useRef<HTMLElement[]>([]);
  const addToMagneticRefs = (el: HTMLElement | null) => {
    if (el && !magneticRef.current.includes(el)) {
      magneticRef.current.push(el);
    }
  };

  useEffect(() => {
    if (loading || window.innerWidth < 768) return;
    
    const cleanups: (() => void)[] = [];
    
    magneticRef.current.forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = el.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        xTo(x * 0.35);
        yTo(y * 0.35);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    return () => cleanups.forEach(cleanup => cleanup());
  }, [loading]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (!content) return;

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.hero-reveal', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1
      });

      // Grid lines
      gsap.from('.grid-line', {
        scaleX: 0,
        scaleY: 0,
        duration: 1.5,
        ease: 'power4.inOut',
        stagger: 0.1
      });

      // Section fade-ins
      gsap.utils.toArray('.section-reveal').forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power2.out'
        });
      });
    });

    return () => ctx.revert();
  }, [content]);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const { trackInteraction } = useInteractionTracking();

  // Track Section Views
  const heroRef = useSectionTracking('hero');
  const aboutRef = useSectionTracking('about');
  const servicesRef = useSectionTracking('services');
  const workRef = useSectionTracking('work');
  const testimonialsRef = useSectionTracking('testimonials');
  const educationRef = useSectionTracking('education');
  const achievementsRef = useSectionTracking('achievements');
  const galleryRef = useSectionTracking('gallery');
  const contactRef = useSectionTracking('contact');

  const testimonialRef = useRef<HTMLDivElement>(null);

  const nextTestimonial = () => {
    if (!content || !content[language]?.testimonials?.length) return;
    const testimonialsCount = content[language].testimonials.length;
    if (testimonialsCount <= 1) return;

    gsap.to(testimonialRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.3,
      onComplete: () => {
        setCurrentTestimonialIndex((prev) => (prev + 1) % testimonialsCount);
        gsap.fromTo(testimonialRef.current, 
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.3 }
        );
      }
    });
    trackInteraction('testimonial_nav', { direction: 'next' });
  };

  const prevTestimonial = () => {
    if (!content || !content[language]?.testimonials?.length) return;
    const testimonialsCount = content[language].testimonials.length;
    if (testimonialsCount <= 1) return;

    gsap.to(testimonialRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.3,
      onComplete: () => {
        setCurrentTestimonialIndex((prev) => (prev - 1 + testimonialsCount) % testimonialsCount);
        gsap.fromTo(testimonialRef.current, 
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3 }
        );
      }
    });
    trackInteraction('testimonial_nav', { direction: 'prev' });
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({ message: 'Please enter a valid email address.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setFormStatus('sending');

    // Simulate sending — no server call. Open mailto link instead.
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.open(`mailto:${content.common.contact?.email || ''}?subject=${subject}&body=${body}`, '_blank');

    setTimeout(() => {
      setFormStatus('success');
      setToast({ message: content[language].ui.contact.received, type: 'success' });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setFormStatus('idle');
        setToast(null);
      }, 3000);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const heroName = content[language].hero.name;
  const nameParts = heroName.split(' ');
  const firstName = nameParts[0] || "Joyi";
  const lastName = nameParts.slice(1).join(' ') || "";

  const t = content[language];
  const common = content.common;

  return (
    <div className="relative min-h-screen selection:bg-accent/30 selection:text-white">
      {content && content[language] && content[language].hero && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Custom Cursor */}
          <div className="cursor-dot hidden md:block" />
          <div className="cursor-outline hidden md:block" />

      {/* Background Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="grid-line-v left-[10%] grid-line" />
        <div className="grid-line-v left-[50%] grid-line" />
        <div className="grid-line-v left-[90%] grid-line" />
        <div className="grid-line-h top-[20%] grid-line" />
        <div className="grid-line-h top-[80%] grid-line" />
      </div>

      {/* Coding Background Animation */}
      <CodeBackground />

      {/* 1. Navigation */}
      <nav className="fixed top-0 left-0 w-full px-4 py-3 md:px-6 md:py-4 flex flex-col justify-between items-center z-50 border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="flex items-center gap-3 sm:gap-4 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent rounded-sm flex items-center justify-center text-bg font-bold text-xs sm:text-base">S</div>
            <div className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase">
              {heroName} <span className="text-muted hidden sm:inline">/</span> <span className="hidden sm:inline">{t.hero?.role || "Architect"}</span>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-6 md:gap-8 items-center">
            <button 
              onClick={() => {
                const newLang = language === 'en' ? 'zh' : 'en';
                setLanguage(newLang);
                trackInteraction('language_toggle', { newLanguage: newLang });
              }}
              className="px-2 py-1 md:px-3 md:py-1.5 border border-border text-muted hover:text-accent hover:border-accent transition-all flex items-center gap-2 font-mono text-[8px] md:text-[10px] uppercase tracking-widest"
            >
              {language === 'en' ? 'EN' : 'ZH'}
            </button>
            <button 
              onClick={() => {
                toggleTheme();
                trackInteraction('theme_toggle', { newTheme: theme === 'dark' ? 'light' : 'dark' });
              }}
              className="px-2 py-1 md:px-3 md:py-1.5 border border-border text-muted hover:text-accent hover:border-accent transition-all flex items-center gap-2 font-mono text-[8px] md:text-[10px] uppercase tracking-widest"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
              <span className="hidden xs:inline ml-1">
                {theme === 'dark' ? content[language].ui.nav.terminal : content[language].ui.nav.studio}
              </span>
            </button>
            <div className="hidden md:flex gap-4 md:gap-6 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em]">
              <a href="#about" onClick={() => trackInteraction('nav_click', { target: 'about' })} className="hover:text-accent transition-colors">{content[language].ui.nav.about}</a>
              <a href="#services" onClick={() => trackInteraction('nav_click', { target: 'services' })} className="hover:text-accent transition-colors">{content[language].ui.nav.services}</a>
              <a href="#work" onClick={() => trackInteraction('nav_click', { target: 'work' })} className="hover:text-accent transition-colors">{content[language].ui.nav.work}</a>
              <a href="#experience" onClick={() => trackInteraction('nav_click', { target: 'experience' })} className="hover:text-accent transition-colors">{content[language].ui.nav.experience}</a>
              <a href="#contact" onClick={() => trackInteraction('nav_click', { target: 'contact' })} className="hover:text-accent transition-colors">{content[language].ui.nav.contact}</a>
            </div>
          </div>
        </div>
        {/* Mobile Nav Links */}
        <div className="flex md:hidden gap-4 font-mono text-[8px] uppercase tracking-widest mt-2 border-t border-border/50 pt-2 w-full justify-center flex-wrap">
          <a href="#about" className="hover:text-accent transition-colors">{content[language].ui.nav.about}</a>
          <a href="#services" className="hover:text-accent transition-colors">{content[language].ui.nav.services}</a>
          <a href="#work" className="hover:text-accent transition-colors">{content[language].ui.nav.work}</a>
          <a href="#experience" className="hover:text-accent transition-colors">{content[language].ui.nav.experience}</a>
          <a href="#contact" className="hover:text-accent transition-colors">{content[language].ui.nav.contact}</a>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section ref={heroRef} className="min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-[10%] pt-44 sm:pt-36 lg:pt-24 pb-20 relative z-10 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-10 md:opacity-20 pointer-events-none hero-reveal z-0">
          <div className="absolute inset-0 bg-accent/5 [mask-image:linear-gradient(to_left,black,transparent)]" />
          
          {/* Geometric Accents */}
          <div className="absolute top-[20%] right-[10%] w-48 h-48 md:w-64 md:h-64 border border-accent/10 rotate-45 animate-[spin_30s_linear_infinite]" />
          <div className="absolute bottom-[20%] right-[30%] w-24 h-24 md:w-32 md:h-32 border border-accent/5 -rotate-12 animate-[pulse_6s_infinite]" />
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 hidden xl:block hero-reveal">
          <div className="writing-vertical-rl rotate-180 font-mono text-[10px] uppercase tracking-[0.5em] text-muted/40">
            {content[language].ui.hero.system} // v2.5.0 // {new Date().getFullYear()}
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative">
          <div className="mono-label hero-reveal mb-6 flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-accent animate-[pulse_1.5s_infinite]" />
              <div className="w-1 h-4 bg-accent/40 animate-[pulse_1.5s_infinite_0.3s]" />
              <div className="w-1 h-4 bg-accent/20 animate-[pulse_1.5s_infinite_0.6s]" />
            </div>
            <span className="tracking-[0.3em] text-[8px] sm:text-[10px]">{content[language].ui.hero.status}</span>
            <span className="text-muted/40 ml-4 hidden md:inline">{content[language].ui.hero.node}</span>
          </div>

          <h1 className="hero-reveal font-display font-bold text-[clamp(2rem,10vw,9rem)] leading-[0.85] tracking-tight md:tracking-[-0.04em] mb-4 md:mb-6 uppercase relative z-10">
            <span className="block">
              <span className="block">{firstName}</span>
            </span>
            <span className="block mt-1">
              <span className={cn(
                "block", 
                theme === 'dark' ? "text-stroke" : "text-accent font-serif italic normal-case tracking-tight"
              )}>
                {lastName}
              </span>
            </span>
          </h1>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start lg:items-center relative z-10">
            <div className="flex-1 w-full">
              <p className="hero-reveal text-lg sm:text-xl md:text-2xl font-light text-muted max-w-xl leading-relaxed mb-12">
                {t.hero?.tagline || ""}
              </p>
              
              <div className="hero-reveal flex flex-wrap gap-4 sm:gap-6">
                <a href="#work" className="group relative px-8 py-4 sm:px-10 sm:py-5 overflow-hidden border border-accent w-full sm:w-auto text-center">
                  <div className="absolute inset-0 bg-accent transition-transform duration-500 translate-y-full group-hover:translate-y-0" />
                  <span className="relative z-10 text-accent group-hover:text-bg font-bold uppercase text-[10px] tracking-[0.3em] transition-colors duration-500">{content[language].ui.hero.viewProjects}</span>
                </a>
                <a href="#contact" className="group relative px-8 py-4 sm:px-10 sm:py-5 border border-border overflow-hidden w-full sm:w-auto text-center">
                  <div className="absolute inset-0 bg-ink translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-0" />
                  <span className="relative z-10 uppercase text-[10px] tracking-[0.3em] group-hover:text-bg transition-colors duration-500">{content[language].ui.hero.contact}</span>
                </a>
              </div>
            </div>

            {/* Code Terminal Animation */}
            <div className="w-full lg:w-[450px] hero-reveal relative">
              <div className="absolute -inset-4 border border-accent/10 -z-10 translate-x-2 translate-y-2" />
              <CodeTerminal />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-accent text-bg p-3 sm:p-4 font-mono text-[8px] sm:text-[10px] uppercase tracking-widest z-20 shadow-2xl">
                {content[language].ui.hero.systemBadge.split('<br/>').map((txt: string, i: number) => <React.Fragment key={i}>{txt}{i === 0 && <br/>}</React.Fragment>)}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hero-reveal hidden md:block">
          <div className="flex flex-col items-center gap-4">
            <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent animate-bounce" />
            <span className="mono-label text-[8px] opacity-40">{content[language].ui.hero.scroll}</span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TECH BANNER ── */}
      <MarqueeBanner skills={common.skills} />

      {/* 3. About Section */}
      <section id="about" ref={aboutRef} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-[10%] relative z-10 border-y border-border bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mono-label mb-12 section-reveal">{content[language].ui.about.label}</div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Content Card */}
            <div className="lg:col-span-7 section-reveal bg-bg border border-border p-5 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
              <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase mb-8 sm:mb-12 leading-[0.85] font-display tracking-tighter">
                {content[language].ui.about.titlePrefix}<span className={cn("text-accent pr-4", theme === 'light' && "italic font-serif normal-case")}>{content[language].ui.about.titleHighlight}</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-3xl font-light leading-relaxed text-muted mb-16 max-w-2xl">
                {t.about?.text || ""}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-[1px] bg-accent" />
                    <h4 className="mono-label text-accent text-[10px] uppercase tracking-widest">{content[language].ui.about.competencies}</h4>
                  </div>
                  <ul className="space-y-4 text-xs font-light tracking-wide text-muted/80">
                    <li className="flex items-center gap-3 hover:text-accent transition-colors cursor-default">
                      <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" /> {content[language].ui.about.competenciesList[0]}
                    </li>
                    <li className="flex items-center gap-3 hover:text-accent transition-colors cursor-default">
                      <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" /> {content[language].ui.about.competenciesList[1]}
                    </li>
                    <li className="flex items-center gap-3 hover:text-accent transition-colors cursor-default">
                      <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" /> {content[language].ui.about.competenciesList[2]}
                    </li>
                  </ul>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-[1px] bg-accent" />
                    <h4 className="mono-label text-accent text-[10px] uppercase tracking-widest">Engineering_Philosophy</h4>
                  </div>
                  <ul className="space-y-4 text-xs font-light tracking-wide text-muted/80">
                    <li className="flex items-center gap-3 hover:text-accent transition-colors cursor-default">
                      <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" /> {content[language].ui.about.philosophyList[0]}
                    </li>
                    <li className="flex items-center gap-3 hover:text-accent transition-colors cursor-default">
                      <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" /> {content[language].ui.about.philosophyList[1]}
                    </li>
                    <li className="flex items-center gap-3 hover:text-accent transition-colors cursor-default">
                      <div className="w-1.5 h-1.5 bg-accent/40 rotate-45" /> {content[language].ui.about.philosophyList[2]}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {/* Visual Card */}
              <div className="flex-1 section-reveal relative group overflow-hidden border border-border bg-white/[0.02] flex flex-col items-center justify-center p-8 sm:p-12 min-h-[350px] md:min-h-[400px]">
                <div className="absolute top-6 right-6 z-20">
                  <a href="/resume.pdf" target="_blank" className="px-4 py-2 border border-accent text-accent text-[10px] uppercase tracking-widest hover:bg-accent hover:text-bg transition-colors duration-300 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] block">
                    {content[language].ui.about.resume}
                  </a>
                </div>

                <div className="relative">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-accent/20 transition-colors duration-500 z-10 relative">
                    <img 
                      src={common.heroImage} 
                      alt="Portrait" 
                      className="w-full h-full object-cover transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Decorative Rotating Ring */}
                  <div className="absolute -inset-4 border border-dashed border-accent/20 rounded-full animate-[spin_30s_linear_infinite] pointer-events-none" />
                  <div className="absolute -inset-8 border border-accent/5 rounded-full pointer-events-none" />
                </div>
                
                <div className="mt-10 text-center relative z-10">
                  <div className="mono-label text-[10px] text-accent mb-2 tracking-[0.3em]">{content[language].ui.about.systemOperator}</div>
                  <div className="text-2xl font-bold uppercase tracking-[0.2em]">{heroName}</div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 p-4 glass border border-border backdrop-blur-xl flex justify-between items-center">
                  <div>
                    <div className="mono-label text-[8px] opacity-40 uppercase">{content[language].ui.about.stats.node}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                      {content[language].ui.about.stats.active}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-accent font-bold text-2xl leading-none">5+</div>
                    <div className="mono-label text-[8px] opacity-40 uppercase">{content[language].ui.about.stats.exp}</div>
                  </div>
                </div>
              </div>

              {/* Metrics Card */}
              <div className="section-reveal bg-accent p-8 flex flex-col justify-between min-h-[200px] group">
                <div className="flex justify-between items-start">
                  <Terminal size={24} className="text-bg" />
                  <div className="mono-label text-bg/40 text-[10px]">{content[language].ui.about.osVersion}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-bg font-bold text-3xl uppercase tracking-tighter leading-none">
                    {content[language].ui.about.optimization}
                  </div>
                  <div className="w-full h-1 bg-bg/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-bg w-2/3 animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS COUNTER SECTION ── */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10 border-b border-border overflow-hidden bg-white/[0.015]">
        <StatsSection content={content} language={language} />
      </section>

      {/* 4. Services Section */}
      <section id="services" ref={servicesRef} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-[10%] relative z-10 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mono-label section-reveal mb-4">{content[language].ui.services.label}</div>
          <h2 className="text-5xl md:text-7xl font-bold uppercase mb-20 section-reveal">{content[language].ui.services.titlePrefix}<span className="text-accent">{content[language].ui.services.titleHighlight}</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(t.services || []).map((service, i) => {
              const iconName = common.serviceIcons[service.id] || 'Server';
              const getServiceIcon = (name: string) => {
                switch(name) {
                  case 'Cpu': return <Cpu size={32} />;
                  case 'Globe': return <Globe size={32} />;
                  case 'Users': return <Activity size={32} />;
                  case 'Code': return <Code size={32} />;
                  case 'Palette': return <Palette size={32} />;
                  case 'Layout': return <Layout size={32} />;
                  case 'Terminal': return <Terminal size={32} />;
                  case 'Layers': return <Layers size={32} />;
                  case 'Workflow': return <Workflow size={32} />;
                  case 'Database': return <Database size={32} />;
                  case 'Rocket': return <Rocket size={32} />;
                  default: return <Server size={32} />;
                }
              };
              return (
                <div key={i} className="section-reveal p-10 border border-border bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative overflow-hidden">
                  <div className="text-accent mb-8 group-hover:scale-110 transition-transform duration-500 origin-left">
                    {getServiceIcon(iconName)}
                  </div>
                  <h3 className="text-2xl font-bold uppercase mb-4 tracking-tight group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="text-muted font-light leading-relaxed text-sm">
                    {service.description}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Technical Stack - Hardware Module Grid */}
      <section className="py-32 px-6 md:px-[10%] relative z-10 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Radar Background Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square pointer-events-none opacity-[0.03] z-0">
            <div className="absolute inset-0 border border-accent rounded-full scale-[0.2]" />
            <div className="absolute inset-0 border border-accent rounded-full scale-[0.4]" />
            <div className="absolute inset-0 border border-accent rounded-full scale-[0.6]" />
            <div className="absolute inset-0 border border-accent rounded-full scale-[0.8]" />
            <div className="absolute inset-0 border border-accent rounded-full scale-[1.0]" />
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-accent" />
          </div>

          {/* Scanning Line Effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/20 animate-scan z-0 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4 relative z-10">
            <div>
              <div className="mono-label section-reveal mb-4">{content[language].ui.tech.label}</div>
              <h2 className="text-5xl md:text-7xl font-bold uppercase section-reveal">{content[language].ui.tech.titlePrefix}<span className="text-accent">{content[language].ui.tech.titleHighlight}</span></h2>
            </div>
            <div className="mono-label text-[10px] opacity-40 animate-pulse">{content[language].ui.tech.status}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
            {getTechStack(language).map((tech, i) => (
              <div 
                key={i} 
                className={cn(
                  "section-reveal group relative p-8 border border-border bg-bg/50 backdrop-blur-sm hover:border-accent/40 transition-all duration-500 overflow-hidden",
                  tech.span === "md:col-span-2" ? "md:col-span-2" : "md:col-span-1"
                )}
              >
                {/* Module Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" />
                    <span className="mono-label text-[10px] opacity-60">MOD_{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="text-accent/40 group-hover:text-accent transition-colors duration-500">
                    {tech.icon}
                  </div>
                </div>

                {/* Module Content */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold uppercase tracking-tighter group-hover:text-accent transition-colors">{tech.name}</h4>
                    <div className="mono-label text-[8px] opacity-40 mt-1">{tech.category}</div>
                  </div>

                  {/* Data Stream Visualization */}
                  <div className="flex gap-1 h-4 items-end">
                    {[...Array(12)].map((_, idx) => (
                      <div 
                        key={idx} 
                        className="w-full bg-accent/10 group-hover:bg-accent/30 transition-all duration-500"
                        style={{ 
                          height: `${Math.random() * 100}%`,
                          transitionDelay: `${idx * 50}ms`
                        }} 
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-muted font-light leading-relaxed opacity-60 group-hover:opacity-100 transition-all duration-500">
                    {tech.desc}
                  </p>

                  {/* Proficiency Bar */}
                  <div className="pt-4">
                    <div className="flex justify-between mono-label text-[8px] mb-2">
                      <span>Efficiency</span>
                      <span>{tech.level}%</span>
                    </div>
                    <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-accent transition-transform duration-1000 ease-out -translate-x-full group-hover:translate-x-0"
                        style={{ width: `${tech.level}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hardware Accents */}
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-border group-hover:border-accent/40 transition-colors" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-border group-hover:border-accent/40 transition-colors" />
                
                {/* Background Glow */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent/0 group-hover:bg-accent/5 rounded-full blur-3xl transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO SECTION ── */}
      <ManifestoSection content={content} language={language} />

      {/* ── PROCESS SECTION ── */}
      <ProcessSection content={content} language={language} />

      {/* 6. Experience Section — Vertical Timeline */}
      <section id="experience" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-[10%] relative z-10 overflow-hidden">
        {/* Vertical rail */}
        <div className="absolute left-[calc(10%+1.75rem)] top-0 bottom-0 w-px bg-border hidden md:block" />

        <div className="max-w-7xl mx-auto">
          <div className="mono-label section-reveal mb-3">{content[language].ui.experience.label}</div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase mb-16 sm:mb-20 section-reveal leading-none">
            {content[language].ui.experience.titlePrefix}<span className="text-accent">{content[language].ui.experience.titleHighlight}</span>
          </h2>

          <div className="relative">
            {/* Central timeline line — mobile */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border md:hidden" />

            <div className="space-y-0">
              {(t.experience || []).map((exp, i) => (
                <div key={i} className="section-reveal group relative flex gap-6 sm:gap-10 md:gap-16 pb-12 last:pb-0">
                  {/* Timeline dot + connector */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-border group-hover:border-accent group-hover:bg-accent transition-all duration-400 bg-bg z-10 mt-1 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-bg transition-colors duration-300" />
                    </div>
                    {i < (t.experience?.length ?? 1) - 1 && (
                      <div className="w-px flex-1 bg-border group-hover:bg-accent/30 transition-colors duration-500 mt-2" />
                    )}
                  </div>

                  {/* Card */}
                  <div className="flex-1 pb-2">
                    <div className="border border-border group-hover:border-accent/40 bg-bg group-hover:bg-white/[0.02] transition-all duration-500 p-5 sm:p-7 relative overflow-hidden">
                      {/* Accent top bar */}
                      <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-accent transition-all duration-500 origin-left" />

                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight group-hover:text-accent transition-colors duration-300">
                            {exp.company}
                          </h3>
                          <span className="inline-block mt-1.5 font-mono text-[10px] uppercase tracking-widest text-accent border border-accent/30 px-2 py-0.5">
                            {exp.role}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-muted/60 tracking-widest whitespace-nowrap sm:text-right">
                          {exp.period}
                        </span>
                      </div>

                      <p className="text-sm text-muted font-light leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                        {exp.desc}
                      </p>

                      {/* Index badge */}
                      <div className="absolute bottom-4 right-5 font-display font-black text-[4rem] leading-none text-border/30 select-none pointer-events-none group-hover:text-accent/10 transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Projects Section */}
      <section id="work" ref={workRef} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-[10%] relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="section-reveal">
              <div className="mono-label mb-4">{content[language].ui.projects.label}</div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-none"><br className="hidden md:block"/>{content[language].ui.projects.titlePrefix}<span className="text-accent">{content[language].ui.projects.titleHighlight}</span></h2>
            </div>
            <p className="section-reveal max-w-xs text-muted font-light italic">
              {content[language].ui.projects.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(t.projects || []).map((project) => (
              <div key={project.id} className="section-reveal group bg-white/[0.02] border border-border flex flex-col hover:border-accent/30 transition-all duration-500 relative overflow-hidden rounded-2xl">
                {/* Project Image Header */}
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={common.projectImages[project.id]} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-accent/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Tech Tags Overlay */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 max-w-[90%]">
                    {(common.projectTech[project.id] || []).map(tech => (
                      <span key={tech} className="text-[10px] font-mono uppercase tracking-widest bg-bg/80 backdrop-blur-md border border-border px-3 py-1 text-white">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col justify-between flex-grow bg-bg">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-[10px] text-accent tracking-[0.3em] uppercase">Project_{project.id}</span>
                    </div>
                    <h3 className="text-2xl font-bold uppercase mb-4 group-hover:text-accent transition-colors duration-500">{project.title}</h3>
                    <p className="text-sm text-muted font-light leading-relaxed mb-8">{project.description}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div 
                      ref={addToMagneticRefs}
                      onClick={() => {
                        setSelectedProject({
                          ...project,
                          image: common.projectImages[project.id],
                          tech: common.projectTech[project.id]
                        });
                        setIsModalOpen(true);
                        trackInteraction('view_case_study', { project_title: project.title });
                      }}
                      className="flex items-center gap-4 group/btn cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:text-bg transition-all duration-500">
                        <ArrowRight size={16} className="-rotate-45 group-hover/btn:rotate-0 transition-transform duration-500" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted group-hover/btn:text-accent transition-colors">{content[language].ui.projects.view}</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Border Accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section - Carousel Implementation */}
      <section ref={testimonialsRef} className="py-32 px-6 md:px-[10%] relative z-10 border-t border-border bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mono-label mb-4 section-reveal">{content[language].ui.testimonials.label}</div>
          <div className="flex justify-between items-end mb-12 section-reveal">
            <h2 className="text-5xl md:text-7xl font-bold uppercase">{content[language].ui.testimonials.titlePrefix}<span className="text-accent">{content[language].ui.testimonials.titleHighlight}</span></h2>
            {t.testimonials && t.testimonials.length > 1 && (
              <div className="flex gap-4">
                <button 
                  onClick={prevTestimonial}
                  className="w-12 h-12 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="w-12 h-12 border border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {t.testimonials && t.testimonials.length > 0 ? (
            <div className="relative h-[500px] sm:h-[400px] md:h-[300px] overflow-hidden">
              <div ref={testimonialRef} className="absolute inset-0">
                <div className="group p-10 md:p-16 border border-border bg-bg relative h-full flex flex-col justify-center hover:border-accent/30 transition-all duration-500 overflow-hidden">
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent/10 flex items-center justify-center text-accent font-bold text-4xl group-hover:bg-accent group-hover:text-bg transition-all duration-500">"</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
                      <div>
                        <p className="text-xl md:text-3xl font-light italic leading-relaxed mb-8 text-muted group-hover:text-white transition-colors duration-500">
                          "{t.testimonials[currentTestimonialIndex]?.text || "No testimonial text available."}"
                        </p>
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white/5 rounded-full overflow-hidden border border-border group-hover:border-accent/40 transition-colors duration-500">
                            <img 
                              src={`https://picsum.photos/seed/${t.testimonials[currentTestimonialIndex]?.name || 'default'}/200/200`} 
                              alt={t.testimonials[currentTestimonialIndex]?.name || 'Client'} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                              referrerPolicy="no-referrer" 
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg uppercase tracking-wider group-hover:text-accent transition-colors duration-500">
                              {t.testimonials[currentTestimonialIndex]?.name || "Anonymous"}
                            </h4>
                            <p className="mono-label text-[10px] opacity-40">
                              {t.testimonials[currentTestimonialIndex]?.role || "Client"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Indicator */}
                      <div className="hidden md:flex flex-col gap-2">
                        {t.testimonials.map((_, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "w-1 h-8 transition-all duration-500",
                              idx === currentTestimonialIndex ? "bg-accent" : "bg-border"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Decorative Background Accent */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
                  </div>
                </div>
            </div>
          ) : (
            <div className="p-20 border border-dashed border-border text-center opacity-40">
              <p className="font-mono text-xs uppercase tracking-widest">No_Testimonials_Found</p>
            </div>
          )}
        </div>
      </section>

      {/* 10. Achievements Section */}
      <section ref={achievementsRef} className="py-32 px-6 md:px-[10%] relative z-10 border-t border-border bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="mono-label mb-4 section-reveal">{content[language].ui.achievements.label}</div>
          <h2 className="text-5xl md:text-7xl font-bold uppercase mb-12 section-reveal">{content[language].ui.achievements.titlePrefix}<span className="text-accent">{content[language].ui.achievements.titleHighlight}</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(t.achievements || []).map((ach, i) => (
              <div key={i} className="group p-8 border border-border bg-bg section-reveal hover:border-accent/30 transition-all duration-500 relative overflow-hidden">
                <div className="text-accent mb-6 group-hover:scale-110 transition-transform duration-500 origin-left">
                  <Award size={24} />
                </div>
                <h4 className="text-lg font-bold uppercase mb-2 group-hover:text-accent transition-colors">{ach.title}</h4>
                <p className="text-accent mono-label text-[10px] mb-4">{ach.date}</p>
                <p className="text-xs text-muted font-light leading-relaxed">{ach.description}</p>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 11. Gallery / Memories Section */}
      <section ref={galleryRef} className="py-32 px-6 md:px-[10%] relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mono-label mb-4 section-reveal">{content[language].ui.gallery.label}</div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <h2 className="text-5xl md:text-7xl font-bold uppercase section-reveal">{content[language].ui.gallery.titlePrefix}<span className="text-accent">{content[language].ui.gallery.titleHighlight}</span></h2>
            <p className="section-reveal max-w-xs text-muted font-light italic text-sm">
              {content[language].ui.gallery.desc}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { img: "https://res.cloudinary.com/dtgoahusr/image/upload/v1778070425/pexels-duncanoluwaseun-226232_pk3jtr.jpg", tag: "Seminar", icon: <Mic size={14} /> },
              { img: "https://res.cloudinary.com/dtgoahusr/image/upload/v1778070651/pexels-thisisengineering-3861967_q84zmy.jpg", tag: "Workshop", icon: <Camera size={14} />, span: "row-span-2" },
              { img: "https://res.cloudinary.com/dtgoahusr/image/upload/v1778070646/pexels-dhiren-13947197_f8sdig.jpg", tag: "Team", icon: <Users size={14} /> },
              { img: "https://res.cloudinary.com/dtgoahusr/image/upload/v1778070645/pexels-polina-zimmerman-3747481_l56hff.jpg", tag: "Event", icon: <Camera size={14} /> },
              { img: "https://res.cloudinary.com/dtgoahusr/image/upload/v1778070644/pexels-thisisengineering-3861972_cymoyf.jpg", tag: "Hackathon", icon: <Terminal size={14} /> },
              { img: "https://picsum.photos/seed/award1/800/1000", tag: "Awards", icon: <Award size={14} />, span: "row-span-2" },
              { img: "https://picsum.photos/seed/meetup1/800/600", tag: "Meetup", icon: <Globe size={14} /> },
            ].map((item, i) => (
              <div key={i} className={cn(
                "group relative overflow-hidden border border-border section-reveal",
                item.span || ""
              )}>
                <img 
                  src={item.img} 
                  alt={item.tag} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-accent mono-label text-[10px] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.icon}
                    {item.tag}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Contact Section */}
      <section id="contact" ref={contactRef} className="py-32 px-6 md:px-[10%] relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mono-label section-reveal mb-6">{content[language].ui.contact.label}</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="section-reveal">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-extrabold uppercase leading-none mb-12 tracking-tighter">
                {content[language].ui.contact.titlePrefix}<span className="text-accent">{content[language].ui.contact.titleHighlight}</span>
              </h2>
              <p className="text-xl text-muted font-light leading-relaxed mb-12 max-w-md">
                {content[language].ui.contact.desc}
              </p>
              
              <div className="space-y-8">
                <div className="group">
                  <p className="mono-label text-[10px] text-accent mb-2">{content[language].ui.contact.email}</p>
                  <a 
                    href={`mailto:${common.contact?.email || ""}`} 
                    className="text-2xl md:text-3xl font-light hover:text-accent transition-all duration-500 border-b border-border pb-2 inline-block"
                  >
                    {common.contact?.email || ""}
                  </a>
                </div>
                
                <div className="flex gap-6">
                  {[
                    { icon: <Github size={20} />, link: common.contact?.social?.github || "#" },
                    { icon: <Linkedin size={20} />, link: common.contact?.social?.linkedin || "#" },
                    { icon: <Instagram size={20} />, link: common.contact?.social?.instagram || "#" }
                  ].map((social, idx) => (
                    <a 
                      key={idx}
                      href={social.link} 
                      ref={addToMagneticRefs}
                      className="w-12 h-12 border border-border hover:border-accent hover:text-accent transition-all duration-500 rounded-full flex items-center justify-center"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-reveal bg-white/[0.02] border border-border p-8 md:p-12 rounded-2xl">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="mono-label text-[10px] text-muted uppercase tracking-widest">{content[language].ui.contact.name}</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-border py-4 focus:border-accent outline-none transition-colors font-light text-lg"
                    placeholder={content[language].ui.contact.placeholderName}
                  />
                </div>
                <div className="space-y-2">
                  <label className="mono-label text-[10px] text-muted uppercase tracking-widest">{content[language].ui.contact.emailLabel}</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-border py-4 focus:border-accent outline-none transition-colors font-light text-lg"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="mono-label text-[10px] text-muted uppercase tracking-widest">{content[language].ui.contact.message}</label>
                  <div className="relative">
                    <textarea 
                      required
                      rows={4}
                      maxLength={1000}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-transparent border-b border-border py-4 focus:border-accent outline-none transition-colors font-light text-lg resize-none pr-16"
                      placeholder={content[language].ui.contact.placeholderMessage}
                    />
                    <div className="absolute right-0 bottom-2 text-[10px] font-mono text-muted/40 pointer-events-none">
                      {formData.message.length}/1000
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={formStatus !== 'idle'}
                  className="group relative w-full py-5 overflow-hidden border border-accent bg-accent/5 hover:bg-accent transition-all duration-500"
                >
                  <span className="relative z-10 text-accent group-hover:text-bg font-bold uppercase text-[10px] tracking-[0.3em]">
                    {formStatus === 'idle' ? content[language].ui.contact.transmit : formStatus === 'sending' ? content[language].ui.contact.transmitting : content[language].ui.contact.received}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 md:px-[10%] relative z-10 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mono-label opacity-40 text-[10px]">
          <p>© {new Date().getFullYear()} {heroName}. {content[language].ui.footer.rights}</p>
          <div className="flex gap-6">
            <Link to="/cms" className="hover:text-accent transition-colors">{content[language].ui.footer.cms}</Link>
            <p className="hover:text-accent transition-colors cursor-default">{content[language].ui.footer.built}</p>
          </div>
        </div>
      </footer>

      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <GeminiChat />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={cn(
              "fixed bottom-6 sm:bottom-12 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[100] px-5 sm:px-8 py-3 sm:py-4 rounded-full font-mono text-[10px] uppercase tracking-widest shadow-2xl border backdrop-blur-xl text-center",
              toast.type === 'success' ? "bg-accent/10 border-accent text-accent" : "bg-red-500/10 border-red-500 text-red-500"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", toast.type === 'success' ? "bg-accent" : "bg-red-500")} />
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
      )}
    </div>
  );
}

// ─── Marquee Tech Banner ──────────────────────────────────────────────────────
function MarqueeBanner({ skills }: { skills: string[] }) {
  const row1 = [...skills, ...skills, ...skills];
  const row2 = [...skills].reverse();
  const row2Doubled = [...row2, ...row2, ...row2];

  return (
    <div className="relative z-10 border-y border-border bg-bg overflow-hidden py-0 select-none">
      {/* Row 1 — left to right */}
      <div className="flex gap-0 py-4 border-b border-border/50">
        <div
          className="flex gap-0 shrink-0"
          style={{
            animation: 'marquee-left 30s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {row1.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/60 hover:text-accent transition-colors duration-300 cursor-default"
            >
              <span className="w-1 h-1 bg-accent/40 rotate-45 inline-block flex-shrink-0" />
              {skill}
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="flex gap-0 shrink-0"
          style={{
            animation: 'marquee-left 30s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {row1.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/60 hover:text-accent transition-colors duration-300 cursor-default"
            >
              <span className="w-1 h-1 bg-accent/40 rotate-45 inline-block flex-shrink-0" />
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="flex gap-0 py-4">
        <div
          className="flex gap-0 shrink-0"
          style={{
            animation: 'marquee-right 22s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {row2Doubled.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/30 hover:text-accent/70 transition-colors duration-300 cursor-default"
            >
              <span className="w-1 h-1 border border-accent/30 rotate-45 inline-block flex-shrink-0" />
              {skill}
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="flex gap-0 shrink-0"
          style={{
            animation: 'marquee-right 22s linear infinite',
            whiteSpace: 'nowrap',
          }}
        >
          {row2Doubled.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/30 hover:text-accent/70 transition-colors duration-300 cursor-default"
            >
              <span className="w-1 h-1 border border-accent/30 rotate-45 inline-block flex-shrink-0" />
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent pointer-events-none z-10" />
    </div>
  );
}

// ─── Engineering Philosophy — Agent Tree ──────────────────────────────────────
function ManifestoSection({ content, language }: { content: any, language: 'en' | 'zh' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const branches = content[language].ui.manifesto.branches;

  const Stem = ({ delay }: { delay: number }) => (
    <motion.div
      initial={{ scaleY: 0 }} animate={visible ? { scaleY: 1 } : {}}
      transition={{ duration: 0.3, delay }}
      className="w-px h-7 bg-accent/30 origin-top"
    />
  );

  return (
    <section ref={ref} className="py-24 sm:py-36 px-6 md:px-[10%] relative z-10 border-b border-border overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--accent) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="max-w-6xl mx-auto relative">
        <div className="mono-label mb-4 opacity-50">{'// ENGINEERING_PHILOSOPHY'}</div>
        <motion.h2 initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase mb-16">
          {content[language].ui.manifesto.titlePrefix}<span className="text-accent">{content[language].ui.manifesto.titleHighlight}</span>
        </motion.h2>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }} animate={visible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative px-6 sm:px-8 py-4 border border-accent bg-accent/10 font-mono text-accent shadow-[0_0_28px_rgba(var(--accent-rgb),0.18)] text-center"
          >
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-accent animate-pulse" />
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest">
              {content[language].ui.manifesto.label}
            </div>
            <div className="text-[9px] opacity-50 mt-0.5 uppercase tracking-wider">{'// core runtime'}</div>
          </motion.div>

          <Stem delay={0.35} />

          <motion.div initial={{ scaleX: 0 }} animate={visible ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }} style={{ height: 1, background: 'rgba(var(--accent-rgb),0.3)' }}
            className="w-full max-w-2xl origin-center" />

          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3">
            {branches.map((b, bi) => (
              <div key={b.id} className="flex flex-col items-center">
                <Stem delay={0.6 + bi * 0.08} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.68 + bi * 0.1 }}
                  onMouseEnter={() => setHovered(b.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(
                    'w-full max-w-[180px] px-4 py-3 border font-mono cursor-pointer text-center transition-all duration-300',
                    hovered === b.id
                      ? 'border-accent bg-accent/10 text-accent shadow-[0_0_16px_rgba(var(--accent-rgb),0.2)]'
                      : 'border-border/60 hover:border-accent/50 text-ink'
                  )}
                >
                  <div className="text-xs font-bold uppercase tracking-wider">{b.label}</div>
                  <div className="text-[9px] opacity-40 mt-0.5 uppercase">{b.desc}</div>
                </motion.div>
                <Stem delay={0.85 + bi * 0.08} />
                <motion.div initial={{ scaleX: 0 }} animate={visible ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.95 + bi * 0.08 }}
                  className="h-px origin-center w-28" style={{ background: 'rgba(var(--accent-rgb),0.2)' }} />
                <div className="grid grid-cols-2 gap-2">
                  {b.leaves.map((leaf, li) => (
                    <div key={li} className="flex flex-col items-center">
                      <motion.div initial={{ scaleY: 0 }} animate={visible ? { scaleY: 1 } : {}}
                        transition={{ duration: 0.2, delay: 1.0 + bi * 0.08 + li * 0.04 }}
                        className="w-px h-5 origin-top" style={{ background: 'rgba(var(--accent-rgb),0.2)' }} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }} animate={visible ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.35, delay: 1.05 + bi * 0.08 + li * 0.06 }}
                        onMouseEnter={() => setHovered(b.id + li)}
                        onMouseLeave={() => setHovered(null)}
                        className={cn(
                          'px-3 py-2 border font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-all duration-200 text-center',
                          hovered === b.id + li
                            ? 'border-accent/70 bg-accent/10 text-accent'
                            : 'border-border/40 text-muted hover:border-accent/40 hover:text-accent/80'
                        )}
                      >
                        {leaf}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}
          className="mt-10 font-mono text-[9px] uppercase tracking-widest text-muted/30 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-accent/40 rotate-45 animate-pulse inline-block" />
          {content[language].ui.manifesto.hoverHint}
        </motion.p>
      </div>
    </section>
  );
}


// ─── Stats Counter Section Component ─────────────────────────────────────────
// ─── Ring Gauge SVG helper ───────────────────────────────────────────────────
function RingGauge({ pct, size = 80, stroke = 6 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(var(--accent-rgb),0.12)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1.8s cubic-bezier(0.16,1,0.3,1)' }} />
    </svg>
  );
}

// ─── Stats Section — System Monitor Dashboard ────────────────────────────────
function StatsSection({ content, language }: { content: any, language: 'en' | 'zh' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const metrics = content[language].ui.stats.metrics;

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 md:px-0">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {content[language].ui.stats.label}
          </span>
        </div>
        <span className="font-mono text-[9px] text-muted/40 hidden sm:block">
          pid:{Math.floor(Math.random()*9000+1000)} · uptime:99.9%
        </span>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.id} m={m} visible={visible} delay={i * 150} />
        ))}
      </div>
    </div>
  );
}

function MetricCard({
  m, visible, delay
}: {
  m: { id: string; value: number; max: number; suffix: string; unit: string; label: string; sub: string; pct: number; icon: string };
  visible: boolean;
  delay: number;
}) {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [visible, delay]);
  const count = useCountUp(m.value, 1800, started);
  const ringPct = started ? m.pct : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-bg border border-border hover:border-accent/50 transition-all duration-500 p-5 sm:p-6 overflow-hidden cursor-default"
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/30 group-hover:border-accent transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/30 group-hover:border-accent transition-colors duration-300" />

      {/* Subtle bg glow */}
      <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/[0.03] transition-colors duration-500" />

      {/* Top row: icon + unit badge */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <span className="text-2xl leading-none">{m.icon}</span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-accent/60 border border-accent/20 px-2 py-0.5">
          {m.unit}
        </span>
      </div>

      {/* Ring + number */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="relative flex-shrink-0">
          <RingGauge pct={ringPct} size={64} stroke={5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[9px] text-accent/60">{m.pct}%</span>
          </div>
        </div>
        <div>
          <div className="font-display font-bold text-3xl sm:text-4xl leading-none tabular-nums text-ink group-hover:text-accent transition-colors duration-300">
            {count}{m.suffix}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50 mt-1">{m.sub}</div>
        </div>
      </div>

      {/* Label row */}
      <div className="relative z-10 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between">
          <span className="font-bold uppercase text-xs sm:text-sm tracking-wider">{m.label}</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-accent transition-all duration-300"
                style={{
                  height: started ? `${8 + Math.sin(i * 1.3 + m.pct) * 8}px` : '2px',
                  opacity: started ? 0.3 + i * 0.15 : 0.1,
                  transitionDelay: `${i * 80 + delay}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// ─── Process / Workflow Section Component ─────────────────────────────────────
function ProcessSection({ content, language }: { content: any, language: 'en' | 'zh' }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = content[language].ui.process.steps;

  return (
    <section className="py-32 px-6 md:px-[10%] relative z-10 border-b border-border bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="mono-label section-reveal mb-4">
          {content[language].ui.process.label}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 section-reveal">
          <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none">
            {language === 'en' ? 'How I' : ''}{' '}
            <span className="text-accent">{content[language].ui.process.titleHighlight}</span>
          </h2>
          <p className="max-w-xs text-muted font-light italic text-sm">
            {language === 'en'
              ? 'A disciplined, battle-tested engineering methodology.'
              : '经过实战检验的工程方法论。'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              layout
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className={cn(
                'relative p-8 md:p-10 bg-bg cursor-pointer group transition-all duration-500 overflow-hidden',
                activeStep === i ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
              )}
            >
              {/* Step number background */}
              <div className="absolute top-4 right-6 font-display font-bold text-[5rem] leading-none text-border/40 select-none pointer-events-none group-hover:text-accent/10 transition-colors duration-500">
                {step.num}
              </div>

              {/* Icon */}
              <div className={cn(
                'w-14 h-14 border flex items-center justify-center mb-6 transition-all duration-500',
                activeStep === i
                  ? 'bg-accent text-bg border-accent'
                  : 'border-border text-accent group-hover:border-accent/50'
              )}>
                <TechIcon name={step.iconName || 'Code'} size={28} />
              </div>

              <h3 className={cn(
                'text-xl font-bold uppercase tracking-tight mb-3 transition-colors duration-300',
                activeStep === i ? 'text-accent' : 'group-hover:text-accent'
              )}>
                {step.title}
              </h3>

              <p className="text-muted font-light text-sm leading-relaxed">{step.short}</p>

              {/* Expanded detail */}
              <AnimatePresence>
                {activeStep === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted/80 font-light leading-relaxed">{step.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Accent bottom bar */}
              <div className={cn(
                'absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-500',
                activeStep === i ? 'w-full' : 'w-0 group-hover:w-1/2'
              )} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 text-muted/40 font-mono text-[10px] uppercase tracking-widest section-reveal">
          <div className="w-2 h-2 bg-accent/40 rotate-45 animate-pulse" />
          {content[language].ui.process.clickHint}
        </div>
      </div>
    </section>
  );
}