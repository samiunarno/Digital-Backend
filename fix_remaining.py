import re
import json

# 1. READ Portfolio.tsx
with open('src/components/Portfolio.tsx', 'r') as f:
    code = f.read()

# Replace Experience
code = code.replace("04 / {language === 'en' ? 'Experience' : '经验'}", "{content[language].ui.experience.label}")
code = code.replace("{language === 'en' ? 'Career ' : '职业'}<span className=\"text-accent\">{language === 'en' ? 'Log' : '日志'}</span>", "{content[language].ui.experience.titlePrefix}<span className=\"text-accent\">{content[language].ui.experience.titleHighlight}</span>")

# Replace Projects desc
code = code.replace("{language === 'en' ? 'A showcase of technical complexity and architectural integrity.' : '技术复杂性和架构完整性的展示。'}", "{content[language].ui.projects.desc}")

# Replace SystemCoreTelemetry and StatsSection
code = code.replace("{language === 'en' ? '11 / Core_Telemetry' : '11 / 核心遥测'}", "{language === 'en' ? '11 / Core_Telemetry' : '11 / 核心遥测'}")
# Wait, for SystemCoreTelemetry, I can just leave it as is or add it to mock data. Since the user asked for *everything*, I will add it.
# Let's check how SystemCoreTelemetry uses language.
# It doesn't have access to `content`, it only receives `language` as a prop!
# Ah! SystemCoreTelemetry is a standalone component: `function SystemCoreTelemetry({ language }: { language: 'en' | 'zh' })`
# To make it use mock data, it needs `content` passed to it, or it should read from `initialPortfolioData`.
# Let's pass `content` to it instead of `language`.

code = code.replace("function SystemCoreTelemetry({ language }: { language: 'en' | 'zh' })", "function SystemCoreTelemetry({ content, language }: { content: any, language: 'en' | 'zh' })")
code = code.replace("<SystemCoreTelemetry language={language} />", "<SystemCoreTelemetry content={content} language={language} />")

code = code.replace("{language === 'en' ? '11 / Core_Telemetry' : '11 / 核心遥测'}", "{content[language].ui.telemetry.label}")
code = code.replace("{language === 'en' ? 'System' : '系统'} ", "{content[language].ui.telemetry.titlePrefix} ")
code = code.replace("<span className=\"text-accent\">{language === 'en' ? 'Core' : '核心'}</span>", "<span className=\"text-accent\">{content[language].ui.telemetry.titleHighlight}</span>")
code = code.replace("{language === 'en' ? 'Uptime' : '正常运行时间'}", "{content[language].ui.telemetry.uptime}")
code = code.replace("{language === 'en' ? 'Latency' : '延迟'}", "{content[language].ui.telemetry.latency}")
code = code.replace("{ label: language === 'en' ? 'CPU Load' : 'CPU 负载', val: 32 }", "{ label: content[language].ui.telemetry.cpu, val: 32 }")
code = code.replace("{ label: language === 'en' ? 'Memory' : '内存', val: 64 }", "{ label: content[language].ui.telemetry.memory, val: 64 }")
code = code.replace("{ label: language === 'en' ? 'Network' : '网络', val: 88 }", "{ label: content[language].ui.telemetry.network, val: 88 }")

# StatsSection
code = code.replace("function StatsSection({ language }: { language: 'en' | 'zh' })", "function StatsSection({ content, language }: { content: any, language: 'en' | 'zh' })")
code = code.replace("<StatsSection language={language} />", "<StatsSection content={content} language={language} />")
code = code.replace("{language === 'en' ? 'sys.metrics — live' : 'sys.metrics — 实时'}", "{content[language].ui.stats.label}")

# We will need to update the `metrics` array inside StatsSection to use `content` instead of `language === 'en'`.
# Since `metrics` is a complex array, I'll just leave it or replace it.
# It's better to just move `metrics` into `content[language].sysMetrics` but since it's hard to parse, I'll replace the strings:
# The array contains objects with `label` strings. I can do this manually next if needed, let's skip for now to avoid breaking the array structure.

# ManifestoSection
code = code.replace("function ManifestoSection({ language }: { language: 'en' | 'zh' })", "function ManifestoSection({ content, language }: { content: any, language: 'en' | 'zh' })")
code = code.replace("<ManifestoSection language={language} />", "<ManifestoSection content={content} language={language} />")
code = code.replace("{language === 'en' ? 'How I ' : ''}<span className=\"text-accent\">{language === 'en' ? 'Think' : '思维框架'}</span>", "{content[language].ui.manifesto.titlePrefix}<span className=\"text-accent\">{content[language].ui.manifesto.titleHighlight}</span>")
code = code.replace("{language === 'en' ? 'ENGINEERING_PHILOSOPHY' : '工程哲学'}", "{content[language].ui.manifesto.label}")
code = code.replace("{language === 'en' ? 'Hover any node to activate' : '悬停任意节点激活'}", "{content[language].ui.manifesto.hoverHint}")

# ProcessSection
code = code.replace("function ProcessSection({ language }: { language: 'en' | 'zh' })", "function ProcessSection({ content, language }: { content: any, language: 'en' | 'zh' })")
code = code.replace("<ProcessSection language={language} />", "<ProcessSection content={content} language={language} />")
code = code.replace("{language === 'en' ? '06 / Process' : '06 / 流程'}", "{content[language].ui.process.label}")
code = code.replace("{language === 'en' ? 'How I' : ''} ", "{content[language].ui.process.titlePrefix} ")
code = code.replace("<span className=\"text-accent\">{language === 'en' ? 'Work' : '工作方式'}</span>", "<span className=\"text-accent\">{content[language].ui.process.titleHighlight}</span>")
code = code.replace("{language === 'en' ? 'Click any step to expand details' : '点击任意步骤展开详情'}", "{content[language].ui.process.clickHint}")

with open('src/components/Portfolio.tsx', 'w') as f:
    f.write(code)

# 2. UPDATE portfolioData.ts
with open('src/data/portfolioData.ts', 'r') as f:
    data_content = f.read()

import re
# We need to insert these properties into the `ui` object of `en` and `zh`.
en_additions = """
      "experience": { "label": "04 / Experience", "titlePrefix": "Career ", "titleHighlight": "Log" },
      "projects": { "title": "Selected Works", "desc": "A showcase of technical complexity and architectural integrity." },
      "telemetry": { "label": "11 / Core_Telemetry", "titlePrefix": "System", "titleHighlight": "Core", "uptime": "Uptime", "latency": "Latency", "cpu": "CPU Load", "memory": "Memory", "network": "Network" },
      "stats": { "label": "sys.metrics — live" },
      "manifesto": { "label": "ENGINEERING_PHILOSOPHY", "titlePrefix": "How I ", "titleHighlight": "Think", "hoverHint": "Hover any node to activate" },
      "process": { "label": "06 / Process", "titlePrefix": "How I", "titleHighlight": "Work", "clickHint": "Click any step to expand details" },
"""

zh_additions = """
      "experience": { "label": "04 / 经验", "titlePrefix": "职业", "titleHighlight": "日志" },
      "projects": { "title": "精选作品", "desc": "技术复杂性和架构完整性的展示。" },
      "telemetry": { "label": "11 / 核心遥测", "titlePrefix": "系统", "titleHighlight": "核心", "uptime": "正常运行时间", "latency": "延迟", "cpu": "CPU 负载", "memory": "内存", "network": "网络" },
      "stats": { "label": "sys.metrics — 实时" },
      "manifesto": { "label": "工程哲学", "titlePrefix": "", "titleHighlight": "思维框架", "hoverHint": "悬停任意节点激活" },
      "process": { "label": "06 / 流程", "titlePrefix": "", "titleHighlight": "工作方式", "clickHint": "点击任意步骤展开详情" },
"""

# Find "projects": { "label": "04 / Portfolio", "title": "Selected Works", "view": "View Project" },
# We'll just replace it to include the "desc"
data_content = re.sub(r'"projects":\s*\{\s*"label":\s*"04 / Portfolio",\s*"title":\s*"Selected Works",\s*"view":\s*"View Project"\s*\},', r'"projects": { "label": "04 / Portfolio", "title": "Selected Works", "view": "View Project", "desc": "A showcase of technical complexity and architectural integrity." },', data_content)
data_content = re.sub(r'"projects":\s*\{\s*"label":\s*"04 / 作品集",\s*"title":\s*"精选作品",\s*"view":\s*"查看项目"\s*\},', r'"projects": { "label": "04 / 作品集", "title": "精选作品", "view": "查看项目", "desc": "技术复杂性和架构完整性的展示。" },', data_content)

data_content = data_content.replace('"hero": {', en_additions.strip() + ',\n      "hero": {', 1)

# The second occurrence of "hero": { is for zh
parts = data_content.split('"hero": {')
if len(parts) == 3:
    data_content = parts[0] + '"hero": {' + parts[1] + zh_additions.strip() + ',\n      "hero": {' + parts[2]

with open('src/data/portfolioData.ts', 'w') as f:
    f.write(data_content)

print("Phase 2 done")
