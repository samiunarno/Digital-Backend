import re

with open('src/components/Portfolio.tsx', 'r') as f:
    content = f.read()

# Replace the usage
content = content.replace(
    "{/* ── ACTIVITY HEATMAP ── */}\n      <ActivityHeatmap language={language} />",
    "{/* ── SYSTEM CORE TELEMETRY ── */}\n      <SystemCoreTelemetry language={language} />"
)

# Replace the function
# We know it starts with `// ─── Activity Heatmap ` and ends right before `// ─── Stats Counter Section Component`
start_marker = "// ─── Activity Heatmap ─────────────────────────────────────────────────────────\nfunction ActivityHeatmap"
end_marker = "// ─── Stats Counter Section Component ─────────────────────────────────────────"

new_func = """// ─── System Core Telemetry ───────────────────────────────────────────────────
function SystemCoreTelemetry({ language }: { language: 'en' | 'zh' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const initialLogs = Array.from({length: 8}).map((_, i) => 
      `[${new Date(Date.now() - i * 5000).toISOString().split('T')[1].slice(0,-1)}] Sys_OP_OK // Node_${Math.floor(Math.random()*1000)} routing stable.`
    );
    setLogs(initialLogs);

    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = `[${new Date().toISOString().split('T')[1].slice(0,-1)}] Sys_OP_OK // Node_${Math.floor(Math.random()*1000)} routing stable.`;
        return [newLog, ...prev.slice(0, 7)];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  
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

  return (
    <section ref={ref} className="py-32 px-6 md:px-[10%] relative z-10 border-t border-border overflow-hidden bg-white/[0.02]">
      <div className="absolute inset-0 bg-accent/5 opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-bg to-bg pointer-events-none z-0" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mono-label mb-4 section-reveal">
          {language === 'en' ? '11 / Core_Telemetry' : '11 / 核心遥测'}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 section-reveal">
          <h2 className="text-5xl md:text-7xl font-bold uppercase">
            {language === 'en' ? 'System' : '系统'}{' '}
            <span className="text-accent">{language === 'en' ? 'Core' : '核心'}</span>
          </h2>
          <div className="flex gap-8 text-right">
            <div>
              <div className="text-3xl font-bold tabular-nums text-accent animate-pulse">
                99.9%
              </div>
              <div className="mono-label text-[9px] opacity-40 uppercase mt-1">{language === 'en' ? 'Uptime' : '正常运行时间'}</div>
            </div>
            <div>
              <div className="text-3xl font-bold tabular-nums">0.2ms</div>
              <div className="mono-label text-[9px] opacity-40 uppercase mt-1">{language === 'en' ? 'Latency' : '延迟'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="order-2 lg:order-1 h-64 border border-border bg-bg/50 p-6 overflow-hidden relative font-mono text-[10px] leading-relaxed section-reveal shadow-inner">
            <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-bg to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-bg to-transparent z-10" />
            <div className="flex flex-col gap-3 opacity-80 transition-all duration-500">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 whitespace-nowrap animate-[pulse_2s_ease-in-out]">
                  <span className="text-accent/80">{log.split('] ')[0]}]</span>
                  <span className="text-muted/80">{log.split('] ')[1]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center items-center h-80 relative section-reveal">
            <div className="absolute w-64 h-64 border border-dashed border-accent/20 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-52 h-52 border border-accent/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute w-40 h-40 border-2 border-dotted border-accent/40 rounded-full animate-[spin_10s_linear_infinite]" />
            
            <div className="relative w-20 h-20 bg-accent/10 border border-accent flex justify-center items-center rotate-45 shadow-[0_0_40px_rgba(var(--accent-rgb),0.3)] group hover:scale-110 transition-transform duration-700">
              <div className="absolute inset-0 bg-accent/20 animate-ping" />
              <div className="w-10 h-10 border border-bg rotate-45 flex justify-center items-center bg-accent text-bg shadow-[0_0_20px_rgba(var(--accent-rgb),0.6)]">
                <Cpu size={20} className="-rotate-45" />
              </div>
            </div>

            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent -translate-y-1/2 -z-10" />
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-accent/40 to-transparent -translate-x-1/2 -z-10" />
          </div>

          <div className="order-3 lg:order-3 space-y-8 section-reveal">
            {[
              { label: language === 'en' ? 'CPU Load' : 'CPU 负载', val: 32 },
              { label: language === 'en' ? 'Memory' : '内存', val: 64 },
              { label: language === 'en' ? 'Network' : '网络', val: 88 }
            ].map((metric, i) => (
              <div key={i} className="group">
                <div className="flex justify-between font-mono text-[10px] uppercase mb-3 text-muted/60">
                  <span>{metric.label}</span>
                  <span className="text-accent tracking-widest">{metric.val}%</span>
                </div>
                <div className="h-[2px] bg-white/5 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={visible ? { width: `${metric.val}%` } : {}}
                    transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-accent group-hover:shadow-[0_0_10px_rgba(var(--accent-rgb),0.8)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
"""

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_func + "\n" + content[end_idx:]
    with open('src/components/Portfolio.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Markers not found.")
