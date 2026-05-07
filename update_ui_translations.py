import json

# 1. Update src/types.ts
with open('src/types.ts', 'r') as f:
    types_content = f.read()

if 'ui: any;' not in types_content:
    types_content = types_content.replace('achievements: {', 'ui: any;\n  achievements: {')
    with open('src/types.ts', 'w') as f:
        f.write(types_content)

# 2. Extract UI_TRANSLATIONS from Portfolio.tsx
with open('src/components/Portfolio.tsx', 'r') as f:
    portfolio_content = f.read()

start_marker = "const UI_TRANSLATIONS = {"
start_idx = portfolio_content.find(start_marker)
end_idx = portfolio_content.find("};\n", start_idx) + 2

ui_translations_string = portfolio_content[start_idx:end_idx]

# Remove it from Portfolio.tsx
portfolio_content = portfolio_content[:start_idx] + portfolio_content[end_idx:]

# Replace UI_TRANSLATIONS[language] with (content[language].ui)
portfolio_content = portfolio_content.replace('UI_TRANSLATIONS[language]', 'content[language].ui')

with open('src/components/Portfolio.tsx', 'w') as f:
    f.write(portfolio_content)

# We can parse the UI_TRANSLATIONS object using a simple JS script to JSON, or just do it by replacing formatting.
# Wait, I'll just hardcode the parsed dict since I know the exact content.

ui_translations = {
  "en": {
    "nav": { "about": "About", "services": "Services", "work": "Work", "experience": "Experience", "contact": "Contact", "terminal": "Terminal", "studio": "Studio" },
    "hero": { "status": "Status: Operational", "node": "Node_ID", "viewProjects": "View Projects", "contact": "Contact", "scroll": "Scroll to Explore", "system": "System.Core.Architecture" },
    "about": { "label": "01 / Profile_Module", "title": "The Architect", "competencies": "Core_Competencies", "resume": "Download CV", "stats": { "node": "Node_Status", "active": "Active", "exp": "5+ Years_Exp" }, "goals": "Strategic_Goals", "optimization": "Optimizing for Scalability" },
    "services": { "label": "02 / Expertise", "title": "Strategic Services" },
    "tech": { "label": "03 / Core_Modules", "title": "Technical Arsenal", "status": "System_Status: Operational" },
    "projects": { "label": "04 / Portfolio", "title": "Selected Works", "view": "View Project" },
    "testimonials": { "label": "05 / Feedback", "title": "Client Insights" },
    "education": { "label": "07 / Foundation", "title": "Education" },
    "achievements": { "label": "08 / Milestones", "title": "Achievements" },
    "gallery": { "label": "09 / Archives", "title": "Memories & Moments", "desc": "Capturing the journey through seminars, workshops, and collaborative sessions." },
    "contact": { "label": "10 / Connection", "title": "Initialize Contact", "desc": "Have a project in mind or just want to say hello? Drop a message and let's build something exceptional together.", "email": "Direct_Email", "name": "Full_Name", "emailLabel": "Email_Address", "message": "Message_Payload", "placeholderName": "John Doe", "placeholderMessage": "Describe your project requirements...", "transmit": "Transmit Message", "transmitting": "Transmitting...", "received": "Message Received" },
    "footer": { "rights": "All Rights Reserved.", "cms": "CMS Dashboard", "built": "Built for Scalability & Performance" }
  },
  "zh": {
    "nav": { "about": "关于", "services": "服务", "work": "作品", "experience": "经验", "contact": "联系", "terminal": "终端", "studio": "工作室" },
    "hero": { "status": "状态：运行中", "node": "节点_ID", "viewProjects": "查看项目", "contact": "联系我", "scroll": "向下滚动探索", "system": "系统.核心.架构" },
    "about": { "label": "01 / 个人资料模块", "title": "架构师", "competencies": "核心能力", "resume": "下载简历", "stats": { "node": "节点状态", "active": "活跃", "exp": "5年以上经验" }, "goals": "战略目标", "optimization": "优化可扩展性" },
    "services": { "label": "02 / 专业知识", "title": "战略服务" },
    "tech": { "label": "03 / 核心模块", "title": "技术军械库", "status": "系统状态：正常运行" },
    "projects": { "label": "04 / 作品集", "title": "精选作品", "view": "查看项目" },
    "testimonials": { "label": "05 / 反馈", "title": "客户见解" },
    "education": { "label": "07 / 基础", "title": "教育背景" },
    "achievements": { "label": "08 / 里程碑", "title": "成就" },
    "gallery": { "label": "09 / 档案", "title": "回忆与时刻", "desc": "通过研讨会、工作坊和协作会议记录旅程。" },
    "contact": { "label": "10 / 连接", "title": "初始化联系", "desc": "有项目想法或只是想打个招呼？发个消息，让我们一起打造卓越的作品。", "email": "直接邮箱", "name": "全名", "emailLabel": "电子邮箱", "message": "消息内容", "placeholderName": "张三", "placeholderMessage": "描述您的项目需求...", "transmit": "发送消息", "transmitting": "正在发送...", "received": "消息已收到" },
    "footer": { "rights": "保留所有权利。", "cms": "CMS 控制面板", "built": "为可扩展性和性能而构建" }
  }
}

with open('src/data/portfolioData.ts', 'r') as f:
    data_content = f.read()

en_ui_string = "ui: " + json.dumps(ui_translations['en'], indent=6) + ",\n    "
data_content = data_content.replace('en: {\n', 'en: {\n    ' + en_ui_string)

zh_ui_string = "ui: " + json.dumps(ui_translations['zh'], indent=6, ensure_ascii=False) + ",\n    "
data_content = data_content.replace('zh: {\n', 'zh: {\n    ' + zh_ui_string)

with open('src/data/portfolioData.ts', 'w') as f:
    f.write(data_content)

print("Success")
