import React, { useMemo, useRef, useState, useEffect } from "react";
import { 
  ArrowLeft, Bot, Copy, Download, FileCode, Folder, Sparkles, Wand2, 
  Moon, Sun, Check, Code2, Layers, Zap, Palette, Eye, Activity,
  Maximize2, Minimize2, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type GeneratedFile = { path: string; content: string };
type GenerateResponse = { summary: string; files: GeneratedFile[] };

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.replaceAll("/", "_").replaceAll("\\", "_");
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function extractLanguageFromPath(path: string) {
  const ext = (path.split(".").pop() || "").toLowerCase();
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    css: "css",
    html: "html",
    json: "json",
    md: "markdown",
    yml: "yaml",
    yaml: "yaml",
    py: "python",
    go: "go",
    java: "java",
    sql: "sql",
    txt: "text",
  };
  return map[ext] || ext || "text";
}

interface TreeNodeType {
  name: string;
  path: string;
  isFile: boolean;
  children: TreeNodeType[];
}

function prettyTree(files: GeneratedFile[]): TreeNodeType {
  const root: TreeNodeType = { name: "root", path: "", isFile: false, children: [] };

  const ensureChild = (parent: TreeNodeType, name: string, path: string, isFile: boolean) => {
    let child = parent.children.find((c) => c.name === name && c.path === path && c.isFile === isFile);
    if (!child) {
      child = { name, path, isFile, children: [] };
      parent.children.push(child);
    }
    return child;
  };

  for (const f of files) {
    const parts = f.path.split("/").filter(Boolean);
    let cur = root;
    let acc = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      acc = acc ? `${acc}/${part}` : part;
      const isFile = i === parts.length - 1;
      cur = ensureChild(cur, part, acc, isFile);
    }
  }

  const sortNode = (n: TreeNodeType) => {
    n.children.sort((a, b) => {
      if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
    n.children.forEach(sortNode);
  };
  sortNode(root);

  return root;
}

interface TreeNodeProps {
  node: TreeNodeType;
  level: number;
  onPickFile: (path: string) => void;
  selectedPath: string | null;
  isDarkMode: boolean;
}

function TreeNode({ node, level, onPickFile, selectedPath, isDarkMode }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  
  if (node.path === "" && node.children?.length === 0) return null;
  
  return (
    <div className="select-none">
      {node.path !== "" && (
        <div
          onClick={() => {
            if (node.isFile) {
              onPickFile(node.path);
            } else {
              setIsExpanded(!isExpanded);
            }
          }}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-150 group",
            node.isFile && selectedPath === node.path 
              ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/10" 
              : "hover:bg-white/5",
            !node.isFile && "hover:bg-white/5"
          )}
          style={{ paddingLeft: 8 + level * 16 }}
        >
          {!node.isFile && (
            <div className={cn("text-[10px] transition-colors w-4", isDarkMode ? "text-gray-500 group-hover:text-cyan-400" : "text-gray-400 group-hover:text-cyan-600")}>
              {isExpanded ? "▼" : "▶"}
            </div>
          )}
          {node.isFile ? (
            <FileCode size={14} className="text-cyan-400" />
          ) : (
            <Folder size={14} className={cn("transition-colors", isExpanded ? "text-cyan-400" : "text-indigo-400")} />
          )}
          <span className={cn(
            "text-[12px] font-mono truncate flex-1 transition-colors",
            node.isFile ? (isDarkMode ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-gray-900") : (isDarkMode ? "text-gray-400 group-hover:text-gray-200" : "text-gray-500 group-hover:text-gray-700")
          )}>
            {node.name}
          </span>
          {node.isFile && selectedPath === node.path && (
            <Check size={12} className="text-cyan-400 animate-in fade-in" />
          )}
        </div>
      )}

      {!node.isFile && isExpanded && node.children?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="ml-2"
        >
          {node.children.map((c) => (
            <TreeNode
              key={c.path}
              node={c}
              level={node.path === "" ? 0 : level + 1}
              onPickFile={onPickFile}
              selectedPath={selectedPath}
              isDarkMode={isDarkMode}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

const vibeTemplates = [
  { name: "SaaS Dashboard", icon: <Layers size={16} />, prompt: "Build a modern SaaS dashboard with analytics charts, user management, billing page, and dark mode. Use shadcn/ui style components." },
  { name: "AI Chat App", icon: <Bot size={16} />, prompt: "Create a full-stack AI chat application with message history, file upload, markdown support, and real-time streaming." },
  { name: "Portfolio Site", icon: <Palette size={16} />, prompt: "Build a developer portfolio with project showcase, blog section, contact form, and smooth animations using Framer Motion." },
  { name: "E-commerce Store", icon: <Zap size={16} />, prompt: "Create an e-commerce store with product listing, cart, checkout flow, and admin dashboard for inventory management." },
  { name: "Code Editor", icon: <Code2 size={16} />, prompt: "Build a browser-based code editor with syntax highlighting, file tree, multiple tabs, and live preview functionality." },
  { name: "Analytics Tool", icon: <Activity size={16} />, prompt: "Create an analytics dashboard with real-time metrics, custom reports, data visualization using Recharts, and export features." }
];

const quickSnippets = [
  { label: "React Component", content: "import React from 'react';\n\ninterface Props {\n  title: string;\n  className?: string;\n}\n\nexport const Component: React.FC<Props> = ({ title, className }) => {\n  return (\n    <div className={className}>\n      <h1>{title}</h1>\n    </div>\n  );\n};" },
  { label: "API Route", content: "import { NextResponse } from 'next/server';\n\nexport async function GET(request: Request) {\n  try {\n    const data = await fetch('https://api.example.com/data');\n    return NextResponse.json({ data });\n  } catch (error) {\n    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });\n  }\n}" },
  { label: "Tailwind Config", content: "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],\n  theme: {\n    extend: {\n      colors: {\n        primary: '#6366f1',\n        secondary: '#8b5cf6',\n      },\n    },\n  },\n  plugins: [],\n};" },
  { label: "Custom Hook", content: "import { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(key: string, initialValue: T) {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      return initialValue;\n    }\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(storedValue));\n  }, [key, storedValue]);\n\n  return [storedValue, setStoredValue] as const;\n}" }
];

export default function AIProjectBuilder() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resp, setResp] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'templates' | 'snippets'>('generate');
  const [vibeMode, setVibeMode] = useState<'chill' | 'focused' | 'creative'>('creative');

  const fileMap = useMemo(() => {
    const map = new Map<string, GeneratedFile>();
    (resp?.files || []).forEach((f) => map.set(f.path, f));
    return map;
  }, [resp]);

  const selectedFile = selectedFilePath ? fileMap.get(selectedFilePath) : null;
  const tree = useMemo(() => prettyTree(resp?.files || []), [resp]);

  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const onGenerate = async () => {
    setError(null);
    setResp(null);
    setSelectedFilePath(null);

    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Enter what you want to build.");
      promptRef.current?.focus();
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/project/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${trimmed}\n\nVibe mode: ${vibeMode}. Create something ${vibeMode === 'creative' ? 'innovative and unique' : vibeMode === 'focused' ? 'clean and minimal' : 'relaxed but functional'}.`,
          designVibe: "google-io-dark",
          stack: "react-vite-tailwind-ts",
          maxFiles: 20,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Generation failed");

      setResp({ summary: data.summary || "Generated", files: data.files || [] });
      const firstFile = (data.files || [])[0]?.path;
      if (firstFile) setSelectedFilePath(firstFile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Generation failed";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const copySelected = async () => {
    if (!selectedFile) return;
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopiedFile(selectedFile.path);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const useTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    setActiveTab('generate');
    setTimeout(() => promptRef.current?.focus(), 100);
  };

  const addSnippet = (content: string) => {
    setPrompt(prev => prev + (prev ? '\n\n' : '') + content);
    setActiveTab('generate');
    setTimeout(() => promptRef.current?.focus(), 100);
  };

  return (
    <div ref={containerRef} className={cn(
      "relative min-h-screen transition-all duration-300",
      isDarkMode ? "text-white" : "text-gray-900",
      isDarkMode ? "bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950" : "bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50"
    )}>
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute inset-0 transition-opacity duration-700",
          isDarkMode 
            ? "bg-[radial-gradient(circle_at_20%_10%,rgba(6,182,212,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_60%_90%,rgba(236,72,153,0.12),transparent_45%)]"
            : "bg-[radial-gradient(circle_at_20%_10%,rgba(6,182,212,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.08),transparent_40%)]"
        )} />
        {isDarkMode && (
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        )}
      </div>

      <div className="relative">
        <header className={cn(
          "sticky top-0 z-20 border-b transition-all duration-300 backdrop-blur-xl",
          isDarkMode 
            ? "border-white/10 bg-black/50" 
            : "border-gray-200 bg-white/70"
        )}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Link to="/" className={cn(
                  "transition-colors",
                  isDarkMode ? "text-gray-400 hover:text-cyan-400" : "text-gray-600 hover:text-cyan-600"
                )}>
                  <ArrowLeft size={20} />
                </Link>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold leading-tight">Vibe Code Studio</h1>
                  <p className="text-[10px] font-mono opacity-60">AI-powered · generate · preview · vibe</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Vibe mode selector */}
                <div className={cn(
                  "hidden sm:flex items-center gap-1 rounded-xl border p-1",
                  isDarkMode ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-100"
                )}>
                  {(['chill', 'focused', 'creative'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setVibeMode(mode)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[11px] font-mono capitalize transition-all",
                        vibeMode === mode
                          ? isDarkMode 
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                            : "bg-cyan-500 text-white"
                          : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isDarkMode 
                      ? "border border-white/10 hover:bg-white/10" 
                      : "border border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isDarkMode 
                      ? "border border-white/10 hover:bg-white/10" 
                      : "border border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>

                <div className="flex items-center gap-2 text-[10px] font-mono opacity-60">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">ar-neural-v2</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-6">
            {/* Left panel */}
            <div className={cn(
              "rounded-2xl border transition-all duration-300 overflow-hidden",
              isDarkMode 
                ? "border-white/10 bg-white/[0.03]" 
                : "border-gray-200 bg-white shadow-sm"
            )}>
              {/* Tabs */}
              <div className="flex border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                {([
                  { id: 'generate' as const, label: 'Generate', icon: <Wand2 size={14} /> },
                  { id: 'templates' as const, label: 'Templates', icon: <Layers size={14} /> },
                  { id: 'snippets' as const, label: 'Snippets', icon: <Code2 size={14} /> }
                ]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? isDarkMode 
                          ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5"
                          : "text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50"
                        : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                <AnimatePresence mode="wait">
                  {/* Generate Tab */}
                  {activeTab === 'generate' && (
                    <motion.div
                      key="generate"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className={cn("text-[12px] font-mono", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                          What should we build?
                        </label>
                        <textarea
                          ref={promptRef}
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className={cn(
                            "mt-2 w-full min-h-[200px] resize-none rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
                            isDarkMode 
                              ? "bg-white/[0.06] border-white/15 text-white placeholder:text-gray-600" 
                              : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                          )}
                          placeholder="Example: Build a SaaS dashboard with login, sidebar, analytics cards, and a messages page. Use clean Google Material vibe UI."
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={onGenerate}
                          disabled={isGenerating}
                          className={cn(
                            "flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all border font-medium",
                            isGenerating
                              ? isDarkMode
                                ? "bg-white/5 text-gray-500 border-white/10 cursor-not-allowed"
                                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:shadow-lg hover:shadow-cyan-500/20 text-white border-transparent"
                          )}
                        >
                          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                          {isGenerating ? "Generating..." : "Generate project"}
                        </button>
                      </div>

                      <div className={cn(
                        "rounded-xl p-4 transition-all",
                        isDarkMode ? "bg-black/20 border border-white/10" : "bg-gray-50 border border-gray-200"
                      )}>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="text-[12px] font-mono">
                            <span className="text-cyan-500">Stack</span>
                            <span className={cn("ml-2", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                              React + Vite + Tailwind + TS
                            </span>
                          </div>
                          <div className="text-[10px] font-mono opacity-60">max files: 20</div>
                        </div>
                      </div>

                      {error && (
                        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                          <p className="text-[12px] text-rose-200 font-mono">{error}</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Templates Tab */}
                  {activeTab === 'templates' && (
                    <motion.div
                      key="templates"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <p className={cn("text-[12px] mb-3", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                        Quick start with curated templates
                      </p>
                      <div className="grid gap-2 max-h-[400px] overflow-y-auto">
                        {vibeTemplates.map((template, idx) => (
                          <button
                            key={idx}
                            onClick={() => useTemplate(template.prompt)}
                            className={cn(
                              "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group",
                              isDarkMode 
                                ? "hover:bg-white/5 border border-white/10" 
                                : "hover:bg-gray-50 border border-gray-200"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
                              isDarkMode ? "bg-cyan-500/10 group-hover:bg-cyan-500/20" : "bg-cyan-100 group-hover:bg-cyan-200"
                            )}>
                              {template.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-medium truncate", isDarkMode ? "text-gray-200" : "text-gray-800")}>
                                {template.name}
                              </p>
                              <p className="text-[10px] font-mono opacity-60 truncate">
                                {template.prompt.slice(0, 80)}...
                              </p>
                            </div>
                            <Sparkles size={14} className={cn("opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0", isDarkMode ? "text-cyan-400" : "text-cyan-600")} />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Snippets Tab */}
                  {activeTab === 'snippets' && (
                    <motion.div
                      key="snippets"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <p className={cn("text-[12px] mb-3", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                        Add code snippets to your prompt
                      </p>
                      <div className="grid gap-2 max-h-[400px] overflow-y-auto">
                        {quickSnippets.map((snippet, idx) => (
                          <button
                            key={idx}
                            onClick={() => addSnippet(snippet.content)}
                            className={cn(
                              "w-full text-left p-3 rounded-xl transition-all group",
                              isDarkMode 
                                ? "hover:bg-white/5 border border-white/10" 
                                : "hover:bg-gray-50 border border-gray-200"
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={cn("text-xs font-mono", isDarkMode ? "text-cyan-400" : "text-cyan-600")}>
                                {snippet.label}
                              </span>
                              <Code2 size={12} className="opacity-50" />
                            </div>
                            <pre className={cn(
                              "text-[10px] font-mono p-2 rounded overflow-x-auto",
                              isDarkMode ? "bg-black/40 text-gray-400" : "bg-gray-100 text-gray-600"
                            )}>
                              {snippet.content.slice(0, 100)}...
                            </pre>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right panel */}
            <div className={cn(
              "rounded-2xl border transition-all duration-300 overflow-hidden",
              isDarkMode 
                ? "border-white/10 bg-white/[0.03]" 
                : "border-gray-200 bg-white shadow-sm"
            )}>
              <div className="p-5 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-sm font-semibold">Project Output</h2>
                    <p className="text-[12px] font-mono opacity-60">
                      {resp ? `${resp.files.length} files generated` : "Ready for your vision"}
                    </p>
                  </div>

                  {resp && resp.files.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedFile && (
                        <>
                          <button
                            onClick={copySelected}
                            className={cn(
                              "px-3 py-2 rounded-xl transition-colors text-[12px] flex items-center gap-2",
                              isDarkMode 
                                ? "border border-white/10 hover:bg-white/10" 
                                : "border border-gray-200 hover:bg-gray-100"
                            )}
                          >
                            {copiedFile === selectedFile.path ? <Check size={14} /> : <Copy size={14} />}
                            {copiedFile === selectedFile.path ? "Copied!" : "Copy"}
                          </button>

                          <button
                            onClick={() => downloadTextFile(selectedFile.path, selectedFile.content)}
                            className={cn(
                              "px-3 py-2 rounded-xl transition-colors text-[12px] flex items-center gap-2",
                              isDarkMode 
                                ? "border border-white/10 hover:bg-white/10" 
                                : "border border-gray-200 hover:bg-gray-100"
                            )}
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          const files = resp.files || [];
                          for (const f of files) downloadTextFile(f.path, f.content);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-xl transition-colors text-[12px] flex items-center gap-2",
                          isDarkMode 
                            ? "border border-white/10 hover:bg-white/10" 
                            : "border border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        <Folder size={14} />
                        All Files
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <Loader2 size={48} className="animate-spin text-cyan-400 mx-auto mb-4" />
                          <p className="text-[12px] font-mono opacity-60">Building your project snapshot...</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isGenerating && !resp && !error && (
                  <div className="h-full flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
                        isDarkMode 
                          ? "bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-white/10" 
                          : "bg-gradient-to-br from-cyan-500/10 to-indigo-600/10 border border-gray-200"
                      )}>
                        <Zap size={24} className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} />
                      </div>
                      <h3 className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
                        Ready to vibe code
                      </h3>
                      <p className={cn("text-[12px] mt-1 font-mono", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                        Describe your app → AI generates files → Preview instantly
                      </p>
                    </div>
                  </div>
                )}

                {!isGenerating && resp && (
                  <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
                    {/* File Tree */}
                    <div className={cn(
                      "rounded-xl overflow-hidden",
                      isDarkMode ? "border border-white/10 bg-black/20" : "border border-gray-200 bg-gray-50"
                    )}>
                      <div className="p-3 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                        <p className="text-[11px] font-mono uppercase tracking-wider opacity-60">File Explorer</p>
                      </div>
                      <div className="p-2 max-h-[560px] overflow-y-auto">
                        {resp.files.length === 0 ? (
                          <p className="text-[12px] font-mono opacity-60 p-3">No files returned.</p>
                        ) : (
                          <TreeNode
                            node={tree}
                            level={0}
                            onPickFile={(p) => setSelectedFilePath(p)}
                            selectedPath={selectedFilePath}
                            isDarkMode={isDarkMode}
                          />
                        )}
                      </div>
                    </div>

                    {/* Code Preview */}
                    <div className={cn(
                      "rounded-xl overflow-hidden",
                      isDarkMode ? "border border-white/10 bg-black/20" : "border border-gray-200 bg-gray-50"
                    )}>
                      <div className="p-3 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-mono truncate">
                              {selectedFile ? selectedFile.path : "Select a file"}
                            </p>
                            {resp.summary && (
                              <p className="text-[11px] mt-1 opacity-60 line-clamp-2">{resp.summary}</p>
                            )}
                          </div>
                          {selectedFile && (
                            <div className="text-[10px] font-mono px-2 py-1 rounded opacity-60 bg-white/5 flex-shrink-0">
                              {extractLanguageFromPath(selectedFile.path)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-3 max-h-[560px] overflow-y-auto">
                        {selectedFile ? (
                          <pre className={cn(
                            "rounded-xl p-4 overflow-x-auto text-[12px] font-mono whitespace-pre leading-relaxed",
                            isDarkMode 
                              ? "bg-black/40 text-gray-200" 
                              : "bg-white text-gray-800 border border-gray-200"
                          )}>
                            {selectedFile.content}
                          </pre>
                        ) : (
                          <div className="p-6 text-center font-mono text-[12px] opacity-60">
                            Pick a file from the explorer to preview
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {resp && (
                  <div className="mt-4 text-[10px] font-mono text-center opacity-40">
                    Generated code preview only. Validate before production.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}