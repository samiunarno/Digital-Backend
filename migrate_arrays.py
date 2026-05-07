import re
import json

# 1. Update Portfolio.tsx
with open('src/components/Portfolio.tsx', 'r') as f:
    code = f.read()

# Replace branches
branches_en_zh = r"""  const branches = language === 'en'
    \? \[
        \{ id: 'perf', label: 'Performance', desc: 'Sub-100ms p99', leaves: \['Lazy Loading', 'Edge Cache'\] \},
        \{ id: 'arch', label: 'Architecture', desc: 'Scale-first design', leaves: \['Domain-Driven', 'Event-Sourced'\] \},
        \{ id: 'rel',  label: 'Reliability',  desc: '99.99% uptime',   leaves: \['Circuit Breaker', 'Observability'\] \},
      \]
    : \[
        \{ id: 'perf', label: '性能', desc: 'P99低于100ms', leaves: \['懒加载', '边缘缓存'\] \},
        \{ id: 'arch', label: '架构', desc: '扩展优先设计', leaves: \['领域驱动', '事件溯源'\] \},
        \{ id: 'rel',  label: '可靠性', desc: '99.99%可用', leaves: \['熔断器', '可观测性'\] \},
      \];"""
code = re.sub(branches_en_zh, "  const branches = content[language].ui.manifesto.branches;", code)

# Replace metrics
metrics_en_zh = r"""  const metrics = language === 'en'
    \? \[
        \{ id: 'exp',      value: 5,  max: 10, suffix: '\+', unit: 'yrs',  label: 'Experience',   sub: 'Production environments', pct: 50, icon: '⚙' \},
        \{ id: 'projects', value: 50, max: 100, suffix: '\+', unit: 'apps', label: 'Projects',     sub: 'Web · Mobile · API',      pct: 50, icon: '🚀' \},
        \{ id: 'comp',     value: 20, max: 30,  suffix: '\+', unit: 'wins', label: 'Competitions', sub: 'Hackathons & contests',    pct: 80, icon: '🏆' \},
      \]
    : \[
        \{ id: 'exp',      value: 5,  max: 10, suffix: '\+', unit: 'yrs',  label: '年经验',   sub: '生产环境',     pct: 50, icon: '⚙' \},
        \{ id: 'projects', value: 50, max: 100, suffix: '\+', unit: 'apps', label: '项目',     sub: 'Web · 移动端', pct: 50, icon: '🚀' \},
        \{ id: 'comp',     value: 20, max: 30,  suffix: '\+', unit: 'wins', label: '竞赛',     sub: '黑客马拉松',   pct: 80, icon: '🏆' \},
      \];"""
code = re.sub(metrics_en_zh, "  const metrics = content[language].ui.stats.metrics;", code)

# Replace steps
# I will use a simple split or replace for the steps since regex is hard with multiline React components.
steps_start = "  const steps = language === 'en'"
steps_end = "      ];"
start_idx = code.find(steps_start)
end_idx = code.find(steps_end, start_idx) + len(steps_end)

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + "  const steps = content[language].ui.process.steps;" + code[end_idx:]

# We need to render the icon properly in ProcessSection. Currently it uses `step.icon` directly as ReactNode.
# Wait, let's fix ProcessSection step mapping to use TechIcon.
# Search for `<div className="text-accent group-hover:scale-110 transition-transform duration-500 origin-left">\n                      {step.icon}\n                    </div>`
# I'll replace it with TechIcon if needed. Wait, in `Portfolio.tsx`, the original steps had icons like `<Search size={28} />`. We can just replace `{step.icon}` with `<TechIcon name={step.iconName} size={28} />`
code = code.replace("{step.icon}", "<TechIcon name={step.iconName || 'Code'} size={28} />")

# Replace About Section text
code = code.replace("Distributed Systems Architecture", "{content[language].ui.about.competenciesList[0]}")
code = code.replace("Cloud-Native Infrastructure", "{content[language].ui.about.competenciesList[1]}")
code = code.replace("High-Performance Computing", "{content[language].ui.about.competenciesList[2]}")
code = code.replace("Architectural Integrity First", "{content[language].ui.about.philosophyList[0]}")
code = code.replace("Operational Excellence", "{content[language].ui.about.philosophyList[1]}")
code = code.replace("User-Centric System Design", "{content[language].ui.about.philosophyList[2]}")

code = code.replace("System_Operator", "{content[language].ui.about.systemOperator}")
code = code.replace("Joyi_OS // v2.5", "{content[language].ui.about.osVersion}")
code = code.replace("System_Online<br/>v1.0.4", "{content[language].ui.hero.systemBadge.split('<br/>').map((txt: string, i: number) => <React.Fragment key={i}>{txt}{i === 0 && <br/>}</React.Fragment>)}")

# ADD DOWNLOAD CV BUTTON
cv_button = """
                <div className="absolute top-6 right-6 z-20">
                  <a href="/resume.pdf" target="_blank" className="px-4 py-2 border border-accent text-accent text-[10px] uppercase tracking-widest hover:bg-accent hover:text-bg transition-colors duration-300 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] block">
                    {content[language].ui.about.resume}
                  </a>
                </div>
"""
# Insert right after: <div className="absolute -inset-8 border border-accent/5 rounded-full pointer-events-none" />
# or near portrait. Let's find "System_Operator" card start: <div className="flex-1 section-reveal relative group overflow-hidden border border-border bg-white/[0.02] flex flex-col items-center justify-center p-8 sm:p-12 min-h-[350px] md:min-h-[400px]">
portrait_card_start = '<div className="flex-1 section-reveal relative group overflow-hidden border border-border bg-white/[0.02] flex flex-col items-center justify-center p-8 sm:p-12 min-h-[350px] md:min-h-[400px]">'
if portrait_card_start in code:
    code = code.replace(portrait_card_start, portrait_card_start + cv_button)

with open('src/components/Portfolio.tsx', 'w') as f:
    f.write(code)

# 2. UPDATE portfolioData.ts
with open('src/data/portfolioData.ts', 'r') as f:
    data_content = f.read()

en_manifesto_branches = """
        "branches": [
          { "id": "perf", "label": "Performance", "desc": "Sub-100ms p99", "leaves": ["Lazy Loading", "Edge Cache"] },
          { "id": "arch", "label": "Architecture", "desc": "Scale-first design", "leaves": ["Domain-Driven", "Event-Sourced"] },
          { "id": "rel",  "label": "Reliability",  "desc": "99.99% uptime",   "leaves": ["Circuit Breaker", "Observability"] }
        ]
"""

zh_manifesto_branches = """
        "branches": [
          { "id": "perf", "label": "性能", "desc": "P99低于100ms", "leaves": ["懒加载", "边缘缓存"] },
          { "id": "arch", "label": "架构", "desc": "扩展优先设计", "leaves": ["领域驱动", "事件溯源"] },
          { "id": "rel",  "label": "可靠性", "desc": "99.99%可用", "leaves": ["熔断器", "可观测性"] }
        ]
"""

en_stats_metrics = """
        "metrics": [
          { "id": "exp",      "value": 5,  "max": 10, "suffix": "+", "unit": "yrs",  "label": "Experience",   "sub": "Production environments", "pct": 50, "icon": "⚙" },
          { "id": "projects", "value": 50, "max": 100, "suffix": "+", "unit": "apps", "label": "Projects",     "sub": "Web · Mobile · API",      "pct": 50, "icon": "🚀" },
          { "id": "comp",     "value": 20, "max": 30,  "suffix": "+", "unit": "wins", "label": "Competitions", "sub": "Hackathons & contests",    "pct": 80, "icon": "🏆" }
        ]
"""

zh_stats_metrics = """
        "metrics": [
          { "id": "exp",      "value": 5,  "max": 10, "suffix": "+", "unit": "yrs",  "label": "年经验",   "sub": "生产环境",     "pct": 50, "icon": "⚙" },
          { "id": "projects", "value": 50, "max": 100, "suffix": "+", "unit": "apps", "label": "项目",     "sub": "Web · 移动端", "pct": 50, "icon": "🚀" },
          { "id": "comp",     "value": 20, "max": 30,  "suffix": "+", "unit": "wins", "label": "竞赛",     "sub": "黑客马拉松",   "pct": 80, "icon": "🏆" }
        ]
"""

en_process_steps = """
        "steps": [
          { "num": "01", "iconName": "Search", "title": "Discovery", "short": "Understanding the problem space deeply.", "detail": "I conduct thorough stakeholder interviews, competitor analysis, and technical audits to map every constraint before writing a single line of code." },
          { "num": "02", "iconName": "Zap", "title": "Architecture", "short": "Designing scalable system blueprints.", "detail": "Every system starts with its data model. I design API contracts, database schemas, and component hierarchies before opening an IDE." },
          { "num": "03", "iconName": "Wrench", "title": "Build", "short": "Iterative, test-driven development.", "detail": "Feature branches, pull requests, and CI/CD pipelines from day one. I write code that the next engineer will thank me for." },
          { "num": "04", "iconName": "GitBranch", "title": "Integrate", "short": "Seamless API & service integration.", "detail": "Third-party services, webhooks, real-time sync, payment gateways — I wire up complex integrations with bulletproof error handling." },
          { "num": "05", "iconName": "Shield", "title": "Test & QA", "short": "Zero bugs in production is the goal.", "detail": "Unit tests, integration tests, E2E automation, load testing and security auditing. Nothing ships without passing the gauntlet." },
          { "num": "06", "iconName": "Rocket", "title": "Deploy", "short": "Zero-downtime production releases.", "detail": "Blue-green deployments, automated rollbacks, monitoring dashboards and on-call runbooks. Launch day is just another Tuesday." }
        ]
"""

zh_process_steps = """
        "steps": [
          { "num": "01", "iconName": "Search", "title": "发现", "short": "深入了解问题空间。", "detail": "我进行深入的利益相关者访谈、竞争对手分析和技术审计，在编写任何代码之前映射每个约束。" },
          { "num": "02", "iconName": "Zap", "title": "架构", "short": "设计可扩展的系统蓝图。", "detail": "每个系统都从其数据模型开始。我在打开IDE之前设计API合同、数据库模式和组件层次结构。" },
          { "num": "03", "iconName": "Wrench", "title": "构建", "short": "迭代的测试驱动开发。", "detail": "从第一天起就有功能分支、拉取请求和CI/CD管道。我写的代码让下一个工程师感谢我。" },
          { "num": "04", "iconName": "GitBranch", "title": "集成", "short": "无缝API和服务集成。", "detail": "第三方服务、webhooks、实时同步、支付网关——我用防弹错误处理来连接复杂的集成。" },
          { "num": "05", "iconName": "Shield", "title": "测试", "short": "零错误是目标。", "detail": "单元测试、集成测试、E2E自动化、负载测试和安全审计。没有通过测试的东西不会发布。" },
          { "num": "06", "iconName": "Rocket", "title": "部署", "short": "零停机生产发布。", "detail": "蓝绿部署、自动回滚、监控仪表板和值班手册。发布日只是另一个星期二。" }
        ]
"""

# Inject into portfolioData.ts
data_content = data_content.replace('"manifesto": {', '"manifesto": {\n' + en_manifesto_branches + ',', 1)
data_content = data_content.replace('"stats": {', '"stats": {\n' + en_stats_metrics + ',', 1)
data_content = data_content.replace('"process": {', '"process": {\n' + en_process_steps + ',', 1)

parts = data_content.split('"manifesto": {')
if len(parts) == 3:
    data_content = parts[0] + '"manifesto": {' + parts[1] + '"manifesto": {\n' + zh_manifesto_branches + ',' + parts[2]

parts = data_content.split('"stats": {')
if len(parts) == 3:
    data_content = parts[0] + '"stats": {' + parts[1] + '"stats": {\n' + zh_stats_metrics + ',' + parts[2]

parts = data_content.split('"process": {')
if len(parts) == 3:
    data_content = parts[0] + '"process": {' + parts[1] + '"process": {\n' + zh_process_steps + ',' + parts[2]

# Add about and hero static texts
en_about_additions = """
      "competenciesList": ["Distributed Systems Architecture", "Cloud-Native Infrastructure", "High-Performance Computing"],
      "philosophyList": ["Architectural Integrity First", "Operational Excellence", "User-Centric System Design"],
      "systemOperator": "System_Operator",
      "osVersion": "Joyi_OS // v2.5",
"""
zh_about_additions = """
      "competenciesList": ["分布式系统架构", "云原生基础设施", "高性能计算"],
      "philosophyList": ["架构完整性优先", "卓越运营", "以用户为中心的系统设计"],
      "systemOperator": "系统_操作员",
      "osVersion": "Joyi_OS // v2.5",
"""

data_content = data_content.replace('"about": {', '"about": {\n' + en_about_additions, 1)
parts = data_content.split('"about": {')
if len(parts) == 3:
    data_content = parts[0] + '"about": {' + parts[1] + '"about": {\n' + zh_about_additions + parts[2]

en_hero_additions = """
      "systemBadge": "System_Online<br/>v1.0.4",
"""
zh_hero_additions = """
      "systemBadge": "系统在线<br/>v1.0.4",
"""

data_content = data_content.replace('"hero": {', '"hero": {\n' + en_hero_additions, 1)
parts = data_content.split('"hero": {')
if len(parts) == 3:
    data_content = parts[0] + '"hero": {' + parts[1] + '"hero": {\n' + zh_hero_additions + parts[2]


with open('src/data/portfolioData.ts', 'w') as f:
    f.write(data_content)

print("Done")
