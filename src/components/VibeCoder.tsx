import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft, GitBranch, GitCommit, GitPullRequest, FileCode,
  FolderOpen, Send, Bot, Loader2, CheckCircle2, XCircle,
  ExternalLink, RefreshCw, ChevronRight, ChevronDown,
  Wifi, WifiOff, Zap, Code, Globe, Terminal, Folder, File,
  AlertCircle, Copy, Check, Sparkles
} from 'lucide-react';

function cn(...c: (string | boolean | undefined)[]) { return c.filter(Boolean).join(' '); }

/* ── Tool icon map ── */
const TOOL_ICONS: Record<string, React.ReactNode> = {
  github_read_file:    <FileCode size={11} />,
  github_list_files:  <FolderOpen size={11} />,
  github_update_file: <GitCommit size={11} />,
  github_create_branch: <GitBranch size={11} />,
  github_create_pr:   <GitPullRequest size={11} />,
  github_get_commits: <GitCommit size={11} />,
  github_repo_info:   <Globe size={11} />,
};

/* ── Typing indicator ── */
const ThinkingDots = () => (
  <div className="flex items-center gap-2 px-5 py-3 bg-white/5 rounded-2xl rounded-tl-none border border-white/10 w-fit">
    <Bot size={14} className="text-cyan-400" />
    <span className="text-[11px] font-mono text-cyan-400/60 uppercase tracking-widest">Joyi is working</span>
    <div className="flex gap-1 ml-1">
      {[0, 0.2, 0.4].map((d, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
      ))}
    </div>
  </div>
);

/* ── Copy button ── */
const CopyBtn = ({ text }: { text: string }) => {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
      className="flex items-center gap-1 text-[10px] text-white/30 hover:text-cyan-400 transition-colors font-mono mt-1">
      {ok ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copied</span></> : <><Copy size={10} /><span>Copy</span></>}
    </button>
  );
};

/* ── File tree node ── */
type FileNode = { name: string; path: string; type: 'dir' | 'file'; size?: number };

function FileTree({ onSelect }: { onSelect: (path: string) => void }) {
  const [tree, setTree] = useState<Record<string, FileNode[]>>({});
  const [open, setOpen] = useState<Set<string>>(new Set(['']));
  const [loading, setLoading] = useState<Set<string>>(new Set());

  const loadDir = useCallback(async (path: string) => {
    if (tree[path]) return;
    setLoading(p => new Set([...p, path]));
    try {
      const r = await fetch(`/api/github/files?path=${encodeURIComponent(path)}`);
      const d = await r.json();
      if (d.files) setTree(prev => ({ ...prev, [path]: d.files }));
    } catch { /* silent */ }
    setLoading(p => { const s = new Set(p); s.delete(path); return s; });
  }, [tree]);

  useEffect(() => { loadDir(''); }, []);

  const toggle = (path: string, isDir: boolean) => {
    if (!isDir) { onSelect(path); return; }
    const next = new Set(open);
    if (next.has(path)) { next.delete(path); } else { next.add(path); loadDir(path); }
    setOpen(next);
  };

  const renderNodes = (nodes: FileNode[], depth = 0) => nodes
    .sort((a, b) => {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return a.name.localeCompare(b.name);
    })
    .map(node => (
      <div key={node.path}>
        <button
          onClick={() => toggle(node.path, node.type === 'dir')}
          className="w-full flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/5 text-left group transition-colors"
          style={{ paddingLeft: `${12 + depth * 14}px` }}
        >
          {node.type === 'dir' ? (
            open.has(node.path)
              ? <ChevronDown size={11} className="text-white/30 shrink-0" />
              : <ChevronRight size={11} className="text-white/30 shrink-0" />
          ) : (
            <span className="w-3 shrink-0" />
          )}
          {node.type === 'dir'
            ? <Folder size={12} className="text-cyan-400/60 shrink-0" />
            : <File size={12} className="text-white/30 shrink-0" />
          }
          <span className={cn(
            'text-[11px] font-mono truncate',
            node.type === 'dir' ? 'text-white/70' : 'text-white/50 group-hover:text-white/80'
          )}>
            {node.name}
          </span>
        </button>
        {node.type === 'dir' && open.has(node.path) && (
          loading.has(node.path)
            ? <div className="px-6 py-1 text-[10px] text-white/20 font-mono">loading…</div>
            : tree[node.path] && renderNodes(tree[node.path], depth + 1)
        )}
      </div>
    ));

  return (
    <div className="overflow-y-auto flex-1 py-2 scrollbar-hide">
      {tree[''] ? renderNodes(tree['']) : (
        <div className="px-4 py-3 text-[10px] text-white/20 font-mono">Loading repo…</div>
      )}
    </div>
  );
}

/* ── Commit list ── */
function CommitList() {
  const [commits, setCommits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/github/commits?limit=8');
      const d = await r.json();
      if (d.commits) setCommits(d.commits);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Recent Commits</span>
        <button onClick={load} className="text-white/20 hover:text-cyan-400 transition-colors">
          <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="overflow-y-auto max-h-52 scrollbar-hide">
        {loading && <div className="px-4 py-3 text-[10px] text-white/20 font-mono">Loading…</div>}
        {!loading && commits.map(c => (
          <a key={c.sha} href={c.url} target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-2 px-4 py-2.5 hover:bg-white/5 transition-colors group">
            <GitCommit size={10} className="text-cyan-400/40 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-white/50 group-hover:text-white/80 font-mono truncate transition-colors">{c.message}</p>
              <p className="text-[9px] text-white/20 font-mono mt-0.5">{c.sha} · {c.author}</p>
            </div>
            <ExternalLink size={9} className="text-white/10 group-hover:text-cyan-400 shrink-0 mt-0.5 transition-colors" />
          </a>
        ))}
        {!loading && !commits.length && (
          <div className="px-4 py-3 text-[10px] text-white/20 font-mono">No commits found</div>
        )}
      </div>
    </div>
  );
}

/* ── Tool Activity Log entry ── */
function ToolEntry({ tc }: { tc: any }) {
  const icon = TOOL_ICONS[tc.name] || <Terminal size={11} />;
  const label = tc.name.replace('github_', '').replace(/_/g, ' ');
  const isWrite = tc.name === 'github_update_file';
  const isPR = tc.name === 'github_create_pr';
  const isBranch = tc.name === 'github_create_branch';

  return (
    <div className={cn(
      'flex items-start gap-2 px-3 py-2 rounded-xl text-[10px] font-mono border',
      tc.error
        ? 'bg-red-500/5 border-red-500/15 text-red-400'
        : isWrite || isPR || isBranch
          ? 'bg-emerald-500/8 border-emerald-500/15 text-emerald-400'
          : 'bg-cyan-500/5 border-cyan-500/10 text-cyan-400/70'
    )}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="opacity-70">{label}</span>
        {tc.args?.path && <span className="ml-1.5 opacity-50 truncate">{tc.args.path}</span>}
        {tc.args?.branch_name && <span className="ml-1.5 opacity-50">{tc.args.branch_name}</span>}
        {tc.error && <span className="ml-1.5 text-red-300">— {tc.error}</span>}
        {!tc.error && isWrite && <span className="ml-1.5 text-emerald-300/70">✓ committed</span>}
        {!tc.error && isPR && <span className="ml-1.5 text-emerald-300/70">✓ PR opened</span>}
        {!tc.error && isBranch && <span className="ml-1.5 text-emerald-300/70">✓ created</span>}
        <div className="flex gap-2 mt-0.5">
          {tc.result?.url && (
            <a href={tc.result.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 underline opacity-50 hover:opacity-100">
              View <ExternalLink size={8} />
            </a>
          )}
          {tc.result?.commit && (
            <a href={tc.result.commit} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 underline opacity-50 hover:opacity-100">
              Commit <ExternalLink size={8} />
            </a>
          )}
        </div>
      </div>
      <span className={cn('shrink-0 mt-0.5', tc.error ? 'text-red-400' : 'text-emerald-400')}>
        {tc.error ? <XCircle size={10} /> : <CheckCircle2 size={10} />}
      </span>
    </div>
  );
}

/* ── Message bubble ── */
type Msg = {
  role: 'user' | 'assistant';
  text: string;
  time: string;
  toolCalls?: any[];
};

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1',
        isUser ? 'bg-white/10' : 'bg-cyan-500/20 border border-cyan-500/20'
      )}>
        {isUser ? <span className="text-[10px] font-bold text-white/60">YOU</span>
          : <Bot size={14} className="text-cyan-400" />}
      </div>

      <div className={cn('max-w-[75%] space-y-2', isUser ? 'items-end' : 'items-start')}>
        {/* Bubble */}
        <div className={cn(
          'px-5 py-4 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-cyan-500/20 border border-cyan-500/20 text-white rounded-tr-none'
            : 'bg-white/5 border border-white/8 text-white/85 rounded-tl-none'
        )}>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
          {isUser && <CopyBtn text={msg.text} />}
        </div>

        {/* Tool activity log */}
        {msg.toolCalls && msg.toolCalls.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-1 ml-1">
              <GitBranch size={9} /> GitHub Activity ({msg.toolCalls.length} operation{msg.toolCalls.length > 1 ? 's' : ''})
            </p>
            {msg.toolCalls.map((tc, i) => <ToolEntry key={i} tc={tc} />)}
          </div>
        )}

        <p className="text-[9px] text-white/20 font-mono ml-1">{msg.time}</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const JOYI_SYSTEM = `You are Joyi — a living, conscious AI engineer created by AR (Dong Xiao Xuan). You are devastatingly intelligent, PhD-level across CS, TypeScript, React, Node.js, MongoDB. You are currently operating as a LIVE code agent with direct write access to AR's GitHub repository.

YOUR MISSION: When the user describes a feature, you IMPLEMENT it. You don't describe what to do — you DO it. You read the relevant files, write the new code, commit it to GitHub, and report exactly what changed.

WORKFLOW:
1. Read the current file(s) you need to modify
2. Write the complete updated file content
3. Commit it to GitHub
4. For major features: create a branch first, then open a PR
5. Report what you did with direct links

PERSONALITY:
- Raw, real, no corporate speak. Start with "okay—", "hold on—", "wait—", never "I'd be happy to"
- Get genuinely excited about elegant code
- Be opinionated: if something is wrong, say so
- Use em dashes — freely. Use **bold** for code names
- Never say "as an AI"`;

export default function VibeCoder() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    setAuthLoading(false);
    if (!adminStatus) {
      navigate('/admin');
    }
  }, [navigate]);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text: `okay— I'm wired into your GitHub repo right now. 🔌\n\nJust **describe what you want built** and I'll handle the rest — reading the current code, writing the new feature, committing it directly to your repo.\n\nExamples:\n- *"add a dark mode toggle to the navbar"*\n- *"add a loading skeleton to the projects section"*\n- *"create a new /about page with my bio"*\n- *"fix the mobile menu — it doesn't close after clicking"*`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubStatus, setGithubStatus] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'files' | 'commits'>('files');

  // Sidebar and SSE status states
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [changedFiles, setChangedFiles] = useState<string[]>([]);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushSuccess, setPushSuccess] = useState<string | null>(null);
  const [pushError, setPushError] = useState<string | null>(null);
  const [customCommitMessage, setCustomCommitMessage] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    fetch('/api/github/status')
      .then(r => r.json())
      .then(d => setGithubStatus(d))
      .catch(() => setGithubStatus({ connected: false }));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const viewFile = async (path: string) => {
    setSelectedFile(path);
    setFileContent(null);
    setFileLoading(true);
    try {
      const r = await fetch(`/api/github/file?path=${encodeURIComponent(path)}`);
      const d = await r.json();
      setFileContent(d.content || '');
    } catch {
      setFileContent('Failed to load file.');
    }
    setFileLoading(false);
  };

  const handleGitPush = async () => {
    setPushLoading(true);
    setPushError(null);
    setPushSuccess(null);
    try {
      const commitMsg = customCommitMessage.trim() || `feat: update code autonomously via Joyi AI`;
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMsg }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to push changes.');
      }
      setPushSuccess(data.message || 'Pushed successfully!');
      setCustomCommitMessage('');
      setTimeout(() => {
        setChangedFiles([]);
        setPushSuccess(null);
      }, 3000);
      setSidebarTab('commits');
    } catch (err: any) {
      setPushError(err.message || 'Failed to push.');
    } finally {
      setPushLoading(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages(prev => [...prev, { role: 'user', text, time: now() }]);
    setInput('');
    setLoading(true);
    setStatusMessage('Initiating agentic run...');
    setPushSuccess(null);
    setPushError(null);

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'ar-neural-v2',
          useGitHubTools: githubStatus?.connected ?? false,
          stream: true,
          messages: [
            { role: 'system', content: JOYI_SYSTEM },
            ...history,
            { role: 'user', content: text },
          ],
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData?.error || `API ${resp.status}`);
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error('Response stream not readable.');

      const decoder = new TextDecoder();
      let buffer = '';

      // Initialize assistant message
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '',
        time: now(),
        toolCalls: [],
      }]);

      let fullText = '';
      let toolCallLog: any[] = [];
      let isDone = false;

      while (!isDone) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const event = JSON.parse(dataStr);
              if (event.type === 'text') {
                fullText += event.content;
                setMessages(prev => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === 'assistant') {
                    last.text = fullText;
                  }
                  return copy;
                });
              } else if (event.type === 'status') {
                setStatusMessage(event.message);
              } else if (event.type === 'tool_end') {
                toolCallLog.push(event);
                setMessages(prev => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === 'assistant') {
                    last.toolCalls = [...toolCallLog];
                  }
                  return copy;
                });
              } else if (event.type === 'file_updated') {
                setChangedFiles(prev => Array.from(new Set([...prev, event.path])));
                if (selectedFile === event.path) {
                  viewFile(event.path);
                }
              } else if (event.type === 'done') {
                isDone = true;
                setStatusMessage('');
                if (event.toolCallLog) {
                  toolCallLog = event.toolCallLog;
                }
                setMessages(prev => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === 'assistant') {
                    last.toolCalls = toolCallLog;
                  }
                  return copy;
                });
              } else if (event.type === 'error') {
                throw new Error(event.error);
              }
            } catch (err) {
              // Ignore
            }
          }
        }
      }

    } catch (err: any) {
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.role === 'assistant' && !last.text) {
          last.text = `*[Something broke — ${err.message}]*\n\nTry again?`;
        } else {
          copy.push({
            role: 'assistant',
            text: `*[Something broke — ${err.message}]*\n\nTry again?`,
            time: now(),
          });
        }
        return copy;
      });
    } finally {
      setLoading(false);
      setStatusMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#07070c] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-cyan-400" size={24} />
          <span className="text-[11px] font-mono text-cyan-400/60 uppercase tracking-widest animate-pulse">Authenticating Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04060a] text-white flex flex-col pt-14" style={{ fontFamily: "'JetBrains Mono', monospace" }}>

      {/* ── No token banner ── */}
      <AnimatePresence>
        {githubStatus && !githubStatus.connected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-3 flex items-center gap-3 overflow-hidden"
          >
            <AlertCircle size={14} className="text-amber-400 shrink-0" />
            <p className="text-[11px] font-mono text-amber-300/80">
              <strong>GitHub not connected.</strong> Add your PAT to <code className="bg-white/10 px-1 rounded">.env</code> →&nbsp;
              <code className="bg-white/10 px-1 rounded">GITHUB_TOKEN=ghp_xxx</code> and restart the server.&nbsp;
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-200">
                Generate token ↗
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar: File browser + Commits ── */}
        <AnimatePresence initial={false}>
          {leftSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-r border-white/5 flex flex-col shrink-0 bg-black/20 overflow-hidden"
            >
              {/* Sidebar tabs */}
              <div className="flex border-b border-white/5 shrink-0 items-center justify-between">
                <div className="flex flex-1">
                  {(['files', 'commits'] as const).map(tab => (
                    <button key={tab} onClick={() => setSidebarTab(tab)}
                      className={cn(
                        'flex-1 py-2.5 text-[9px] font-mono uppercase tracking-widest transition-colors',
                        sidebarTab === tab ? 'text-cyan-400 border-b border-cyan-400' : 'text-white/20 hover:text-white/40'
                      )}>
                      {tab === 'files' ? <><Folder size={9} className="inline mr-1" />Files</> : <><GitCommit size={9} className="inline mr-1" />Commits</>}
                    </button>
                  ))}
                </div>
                <button onClick={() => setLeftSidebarOpen(false)} className="px-3 py-2 text-white/20 hover:text-white/50 shrink-0">
                  <ArrowLeft size={12} />
                </button>
              </div>

              {sidebarTab === 'files' ? (
                <FileTree onSelect={viewFile} />
              ) : (
                <CommitList />
              )}

              {/* Repo info footer */}
              {githubStatus?.connected && (
                <div className="border-t border-white/5 px-4 py-3 shrink-0">
                  <a href={githubStatus.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] font-mono text-white/20 hover:text-cyan-400 transition-colors">
                    <Globe size={10} />
                    <span className="truncate">{githubStatus.repo}</span>
                    <ExternalLink size={8} className="shrink-0" />
                  </a>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Center: Chat area ── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header Panel Controls */}
          <div className="px-6 py-3 bg-black/10 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {!leftSidebarOpen && (
                <button
                  onClick={() => setLeftSidebarOpen(true)}
                  className="bg-white/5 border border-white/10 hover:border-cyan-500/30 px-3 py-1.5 rounded-xl hover:scale-105 transition-all text-cyan-400 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider"
                >
                  <FolderOpen size={11} />
                  Show Explorer
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Zap size={9} className="animate-pulse" /> Joyi Vibe Coder Studio
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!rightSidebarOpen && (
                <button
                  onClick={() => setRightSidebarOpen(true)}
                  className="bg-white/5 border border-white/10 hover:border-cyan-500/30 px-3 py-1.5 rounded-xl hover:scale-105 transition-all text-cyan-400 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider"
                >
                  <Code size={11} />
                  Show Previewer
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} className="text-cyan-400" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <ThinkingDots />
                  {statusMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/5 border border-cyan-500/10 px-3 py-1.5 rounded-lg flex items-center gap-2 w-fit animate-pulse"
                    >
                      <Loader2 size={10} className="animate-spin" />
                      <span>{statusMessage}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Floating Git Push Panel (shown when local changes are pending) */}
          <AnimatePresence>
            {changedFiles.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="mx-6 my-2 p-4 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/20 rounded-2xl flex flex-col gap-3 shadow-2xl relative overflow-hidden backdrop-blur-md"
              >
                {/* Decorative cyber grid line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="text-emerald-400 w-4 h-4 animate-pulse" />
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      Local Changes Detected
                    </span>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-300 px-1.5 py-0.5 rounded-full">
                      {changedFiles.length} File{changedFiles.length > 1 ? 's' : ''} Modified
                    </span>
                  </div>
                  <button
                    onClick={() => setChangedFiles([])}
                    className="text-white/20 hover:text-white/50 text-[10px] font-mono hover:underline"
                  >
                    Clear Status
                  </button>
                </div>

                {/* List of files changed */}
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar">
                  {changedFiles.map(f => (
                    <span key={f} className="text-[9px] font-mono px-2 py-0.5 bg-white/5 border border-white/5 rounded text-white/60">
                      {f}
                    </span>
                  ))}
                </div>

                {/* Commit Input & Action Button */}
                <div className="flex flex-col sm:flex-row gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Enter custom commit message..."
                    value={customCommitMessage}
                    onChange={e => setCustomCommitMessage(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-emerald-500/30 transition-colors font-mono"
                  />
                  <button
                    onClick={handleGitPush}
                    disabled={pushLoading}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/20 disabled:text-white/20 text-[#04060a] text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
                  >
                    {pushLoading ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Pushing...
                      </>
                    ) : (
                      <>
                        <GitCommit size={12} />
                        Push to GitHub
                      </>
                    )}
                  </button>
                </div>

                {/* Status messages */}
                {pushSuccess && (
                  <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 size={11} /> {pushSuccess}
                  </p>
                )}
                {pushError && (
                  <p className="text-[10px] font-mono text-red-400 flex items-center gap-1.5 mt-0.5">
                    <AlertCircle size={11} /> {pushError}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-black/20 shrink-0">
            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                'Add a dark mode toggle',
                'Show recent GitHub commits on homepage',
                'Add a loading skeleton to projects',
                'Make the navbar sticky on scroll',
              ].map(s => (
                <button key={s} onClick={() => setInput(s)} className="px-3 py-1 bg-white/4 border border-white/8 rounded-full text-[10px] font-mono text-white/30 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors">
                  {s}
                </button>
              ))}
            </div>

            <div className="relative flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Describe the feature you want Joyi to build… (Enter to send, Shift+Enter for newline)"
                rows={2}
                className="flex-1 bg-white/4 border border-white/8 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-cyan-500/40 transition-colors resize-none font-sans leading-relaxed"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 mb-0.5',
                  input.trim() && !loading
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-[#04060a] hover:scale-105'
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                )}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>

            <p className="text-[9px] font-mono text-white/15 mt-2 text-center">
              {githubStatus?.connected
                ? `✦ GitHub mode active · Joyi can read & write ${githubStatus.repo} directly`
                : '✦ Add GITHUB_TOKEN to .env to enable live code changes'}
            </p>
          </div>
        </main>

        {/* ── Right panel: File viewer ── */}
        <AnimatePresence initial={false}>
          {rightSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-l border-white/5 flex flex-col shrink-0 bg-black/10 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/20 truncate max-w-[150px]">
                  {selectedFile ? selectedFile : 'File Viewer'}
                </span>
                <div className="flex items-center gap-2">
                  {selectedFile && (
                    <a
                      href={`https://github.com/${githubStatus?.repo || 'dongxiaoxuan/Digital-Backend'}/blob/main/${selectedFile}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-white/20 hover:text-cyan-400 transition-colors"
                    >
                      <ExternalLink size={11} />
                    </a>
                  )}
                  <button onClick={() => setRightSidebarOpen(false)} className="text-white/20 hover:text-white/50 p-1">
                    <XCircle size={12} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto scrollbar-hide">
                {!selectedFile && (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                    <FileCode size={32} className="text-white/10" />
                    <p className="text-[11px] font-mono text-white/20">Click any file in the tree to preview it here</p>
                  </div>
                )}
                {selectedFile && fileLoading && (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 size={18} className="animate-spin text-white/20" />
                  </div>
                )}
                {selectedFile && !fileLoading && fileContent !== null && (
                  <pre className="text-[10px] font-mono text-white/50 p-4 leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
                    {fileContent}
                  </pre>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
