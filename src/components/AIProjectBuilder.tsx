import React, { useMemo, useRef, useState } from "react";
import { ArrowLeft, Bot, Copy, Download, FileCode, Folder, Sparkles, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import CodeTerminal from "./CodeTerminal";
import { motion, AnimatePresence } from "motion/react";

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

function prettyTree(files: GeneratedFile[]) {
  type Node = { name: string; path: string; isFile: boolean; children: Node[] };
  const root: Node = { name: "root", path: "", isFile: false, children: [] };

  const ensureChild = (parent: Node, name: string, path: string, isFile: boolean) => {
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

  const sortNode = (n: Node) => {
    n.children.sort((a, b) => {
      if (a.isFile !== b.isFile) return a.isFile ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
    n.children.forEach(sortNode);
  };
  sortNode(root);

  return root;
}

function TreeNode({
  node,
  level,
  onPickFile,
  selectedPath,
}: {
  node: any;
  level: number;
  onPickFile: (path: string) => void;
  selectedPath: string | null;
}) {
  return (
    <div className="select-none">
      {node.path !== "" ? (
        <div
          onClick={() => node.isFile && onPickFile(node.path)}
          className={cn(
            "flex items-center gap-2 px-2 py-1 rounded-lg cursor-default",
            node.isFile && selectedPath === node.path ? "bg-cyan-500/15 border border-cyan-400/30" : "hover:bg-white/5"
          )}
          style={{ paddingLeft: 8 + level * 12 }}
        >
          {node.isFile ? <FileCode size={14} className="text-cyan-300" /> : <Folder size={14} className="text-indigo-300" />}
          <span className={cn("text-[12px] font-mono truncate", node.isFile ? "text-gray-200" : "text-gray-400")}>
            {node.name}
          </span>
        </div>
      ) : null}

      {node.children?.length > 0 ? (
        <div className="mt-1">
          {node.children.map((c: any) => (
            <TreeNode
              key={c.path}
              node={c}
              level={node.path === "" ? 0 : level + 1}
              onPickFile={onPickFile}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AIProjectBuilder() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resp, setResp] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const fileMap = useMemo(() => {
    const map = new Map<string, GeneratedFile>();
    (resp?.files || []).forEach((f) => map.set(f.path, f));
    return map;
  }, [resp]);

  const selectedFile = selectedFilePath ? fileMap.get(selectedFilePath) : null;
  const tree = useMemo(() => prettyTree(resp?.files || []), [resp]);

  const promptRef = useRef<HTMLTextAreaElement | null>(null);

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
      const r = await fetch("/api/ai/project/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          designVibe: "google-io-dark",
          stack: "react-vite-tailwind-ts",
          maxFiles: 20,
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Generation failed");

      setResp({ summary: data.summary || "Generated", files: data.files || [] });
      const first = (data.files || [])[0]?.path;
      if (first) setSelectedFilePath(first);
    } catch (e: any) {
      setError(e?.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const copySelected = async () => {
    if (!selectedFile) return;
    await navigator.clipboard.writeText(selectedFile.content);
  };

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(6,182,212,0.22),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.22),transparent_40%),radial-gradient(circle_at_60%_90%,rgba(236,72,153,0.18),transparent_45%)]" />
      <div className="relative">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/35 backdrop-blur-md px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="md:hidden text-gray-400 hover:text-cyan-400 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Sparkles size={18} />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">AI Project Builder</h1>
                <p className="text-[10px] text-gray-500 font-mono">Google-vibe · generate · preview · download</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                system: ar-neural-v2
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
            {/* Left panel */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="text-cyan-300" size={18} />
                  <h2 className="text-sm font-semibold">What should we build?</h2>
                </div>
                <p className="text-[12px] text-gray-400 leading-relaxed">
                  Describe your app. The AI will return a project snapshot as JSON (file tree + contents).
                </p>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[12px] text-gray-300 font-mono">Prompt</label>
                  <textarea
                    ref={promptRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-2 w-full min-h-[160px] resize-none rounded-xl bg-white/[0.06] border border-white/15 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50"
                    placeholder="Example: Build a SaaS dashboard with login, sidebar, analytics cards, and a messages page. Use clean Google Material vibe UI."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all border",
                      isGenerating
                        ? "bg-white/5 text-gray-500 border-white/10 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:shadow-lg hover:shadow-cyan-500/20 text-white border-white/10"
                    )}
                  >
                    <Wand2 size={18} />
                    {isGenerating ? "Generating..." : "Generate project"}
                  </button>
                </div>

                <div className="rounded-xl bg-black/20 border border-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[12px] text-gray-400 font-mono">
                      <span className="text-cyan-300">Default</span>: React + Vite + Tailwind + TypeScript
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">max files: 20</div>
                  </div>
                  <div className="mt-3 text-[12px] text-gray-300 leading-relaxed">
                    Tip: Ask for specific pages, routes, and a design style to get better results.
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                    <p className="text-[12px] text-rose-200 font-mono">{error}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Right panel */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold">Project output</h2>
                  <p className="text-[12px] text-gray-400 font-mono">
                    {resp ? `${resp.files.length} files` : "Generate to see files"}
                  </p>
                </div>

                {resp && resp.files.length > 0 && (
                  <div className="flex items-center gap-2">
                    {selectedFile && (
                      <button
                        onClick={copySelected}
                        className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-[12px] flex items-center gap-2"
                      >
                        <Copy size={16} />
                        Copy file
                      </button>
                    )}

                    {selectedFile && (
                      <button
                        onClick={() => downloadTextFile(selectedFile.path, selectedFile.content)}
                        className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-[12px] flex items-center gap-2"
                      >
                        <Download size={16} />
                        Download selected
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const files = resp.files || [];
                        for (const f of files) downloadTextFile(f.path, f.content);
                      }}
                      className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-[12px] flex items-center gap-2"
                      title="Downloads each generated file as a separate text file"
                    >
                      <Folder size={16} />
                      Download all
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5">
                {/* Generating state */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CodeTerminal />
                      <div className="mt-4 text-center text-[12px] text-gray-400 font-mono">
                        Building project snapshot… generating file tree + contents
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Output state */}
                {!isGenerating && !resp && !error && (
                  <div className="h-full flex items-center justify-center py-10">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-indigo-600/30 border border-white/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles />
                      </div>
                      <h3 className="text-white font-semibold">Ready when you are</h3>
                      <p className="text-gray-400 text-[12px] mt-1 font-mono">
                        Describe an app → AI returns files → you preview instantly.
                      </p>
                    </div>
                  </div>
                )}

                {!isGenerating && resp && (
                  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
                    {/* Tree */}
                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-[12px] font-mono text-gray-400">File tree</p>
                      </div>
                      <div className="p-2 max-h-[520px] overflow-y-auto">
                        {resp.files.length === 0 ? (
                          <p className="text-[12px] text-gray-400 font-mono p-3">No files returned.</p>
                        ) : (
                          <TreeNode
                            node={tree}
                            level={0}
                            onPickFile={(p) => setSelectedFilePath(p)}
                            selectedPath={selectedFilePath}
                          />
                        )}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <div className="p-3 border-b border-white/10 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[12px] font-mono text-gray-400 truncate">
                            {selectedFile ? selectedFile.path : "Select a file"}
                          </p>
                          {resp.summary && (
                            <p className="text-[12px] text-gray-300 mt-1 leading-relaxed">{resp.summary}</p>
                          )}
                        </div>
                        {selectedFile && (
                          <div className="text-[10px] font-mono text-gray-500">
                            {extractLanguageFromPath(selectedFile.path)}
                          </div>
                        )}
                      </div>

                      <div className="p-3 max-h-[520px] overflow-y-auto">
                        {selectedFile ? (
                          <pre className="bg-white/[0.03] border border-white/10 rounded-xl p-4 overflow-x-auto text-[12px] text-gray-200 font-mono whitespace-pre">
                            {selectedFile.content}
                          </pre>
                        ) : (
                          <div className="p-6 text-center text-gray-400 font-mono text-[12px]">
                            Pick a file from the tree.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Safety note */}
                {resp ? (
                  <div className="mt-4 text-[11px] text-gray-600 font-mono text-center">
                    Generated code preview only. Validate before running.
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
