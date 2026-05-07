import { PortfolioContent } from '../types';

export const initialPortfolioData: PortfolioContent = {
  en: {
    ui: {
      "nav": {
        "about": "About",
        "services": "Services",
        "work": "Projects",
        "experience": "Experience",
        "contact": "Contact",
        "terminal": "Terminal",
        "studio": "Studio"
      },
      "experience": { "label": "04 / Experience", "titlePrefix": "Career ", "titleHighlight": "Log" },
      "projects": { "titlePrefix": "Selected ", "titleHighlight": "Works", "desc": "A showcase of technical complexity and clean architecture." },
      "telemetry": { "label": "11 / Core_Telemetry", "titlePrefix": "System", "titleHighlight": "Core", "uptime": "Uptime", "latency": "Latency", "cpu": "CPU Load", "memory": "Memory", "network": "Network" },
      "stats": {
        "metrics": [
          { "id": "exp", "value": 5, "max": 10, "suffix": "+", "unit": "yrs", "label": "Experience", "sub": "Production environments", "pct": 50, "icon": "⚙" },
          { "id": "projects", "value": 50, "max": 100, "suffix": "+", "unit": "apps", "label": "Projects", "sub": "Web · Mobile · API", "pct": 50, "icon": "🚀" },
          { "id": "comp", "value": 20, "max": 30, "suffix": "+", "unit": "wins", "label": "Competitions", "sub": "Hackathons & contests", "pct": 80, "icon": "🏆" }
        ],
        "label": "sys.metrics — live"
      },
      "manifesto": {
        "branches": [
          { "id": "perf", "label": "Performance", "desc": "Sub-100ms p99", "leaves": ["Lazy Loading", "Edge Cache"] },
          { "id": "arch", "label": "Architecture", "desc": "Scale-first design", "leaves": ["Clean Code", "Microservices"] },
          { "id": "rel", "label": "Reliability", "desc": "99.99% uptime", "leaves": ["Type Safety", "TDD"] }
        ],
        "label": "ENGINEERING_PHILOSOPHY", "titlePrefix": "How I ", "titleHighlight": "Think", "hoverHint": "Hover any node to activate"
      },
      "process": {
        "steps": [
          { "num": "01", "iconName": "Search", "title": "Requirement Analysis", "short": "Understanding the problem space deeply.", "detail": "I analyze requirements, map out constraints, and communicate with stakeholders before writing a single line of code." },
          { "num": "02", "iconName": "Zap", "title": "System Design", "short": "Designing scalable system blueprints.", "detail": "I design database schemas, API contracts, and component hierarchies, ensuring a robust foundation." },
          { "num": "03", "iconName": "Wrench", "title": "Implementation", "short": "Iterative, test-driven development.", "detail": "I write clean, maintainable code following best practices, utilizing modern frameworks and strict typing." },
          { "num": "04", "iconName": "GitBranch", "title": "Integration", "short": "Seamless API & service integration.", "detail": "I wire up complex integrations with third-party services and payment gateways using bulletproof error handling." },
          { "num": "05", "iconName": "Shield", "title": "Testing", "short": "Zero bugs in production is the goal.", "detail": "Unit tests, integration tests, and E2E automation. Nothing ships without passing the CI/CD pipeline." },
          { "num": "06", "iconName": "Rocket", "title": "Deployment", "short": "Zero-downtime production releases.", "detail": "Automated deployments, monitoring dashboards, and performance profiling. Launching with confidence." }
        ],
        "label": "06 / Process", "titlePrefix": "How I", "titleHighlight": "Work", "clickHint": "Click any step to expand details"
      },
      "hero": {
        "systemBadge": "Available for<br/>New Opportunities",
        "status": "Status: Available",
        "node": "Location: Remote/Global",
        "viewProjects": "View Projects",
        "contact": "Contact",
        "scroll": "Scroll to Explore",
        "system": "Professional.Software.Portfolio"
      },
      "about": {
        "competenciesList": ["Full-Stack Development", "Cloud-Native Infrastructure", "System Architecture"],
        "philosophyList": ["Clean Code Practices", "Test-Driven Development", "User-Centric Engineering"],
        "systemOperator": "Professional",
        "osVersion": "Tech Stack Focus",
        "label": "01 / Identity",
        "titlePrefix": "Tech ",
        "titleHighlight": "Innovator",
        "competencies": "Core Competencies",
        "resume": "Download CV",
        "stats": {
          "node": "Availability",
          "active": "Open to Work",
          "exp": "5+ Years Experience"
        },
        "goals": "Strategic Goals",
        "optimization": "Optimizing for Scalability"
      },
      "services": {
        "label": "02 / Expertise",
        "titlePrefix": "Technical ",
        "titleHighlight": "Focus"
      },
      "tech": {
        "label": "03 / Core_Stack",
        "titlePrefix": "Technology ",
        "titleHighlight": "Stack",
        "status": "Continuously Learning & Evolving"
      },
      "testimonials": {
        "label": "05 / Feedback",
        "titlePrefix": "Peer ",
        "titleHighlight": "Reviews"
      },
      "education": {
        "label": "07 / Foundation",
        "titlePrefix": "Education ",
        "titleHighlight": "Background"
      },
      "achievements": {
        "label": "08 / Milestones",
        "titlePrefix": "Major ",
        "titleHighlight": "Achievements"
      },
      "gallery": {
        "label": "09 / Archives",
        "titlePrefix": "Memories & ",
        "titleHighlight": "Moments",
        "desc": "Capturing the journey through hackathons, team building, and open-source contributions."
      },
      "contact": {
        "label": "10 / Connection",
        "titlePrefix": "Initialize ",
        "titleHighlight": "Contact",
        "desc": "Looking for a skilled engineer for your next project? Drop a message and let's build something exceptional.",
        "email": "Direct_Email",
        "name": "Full_Name",
        "emailLabel": "Email_Address",
        "message": "Message_Payload",
        "placeholderName": "John Doe",
        "placeholderMessage": "Describe your project or inquiry...",
        "transmit": "Transmit Message",
        "transmitting": "Transmitting...",
        "received": "Message Received"
      },
      "footer": {
        "rights": "All Rights Reserved.",
        "cms": "Source Code",
        "built": "Built with React & TypeScript"
      }
    },
    hero: {
      name: "Dong Xiao Xuan",
      role: "Software Engineer",
      tagline: "Building scalable, high-performance software solutions with clean code and robust architecture."
    },
    about: {
      text: "I am a passionate Software Engineer with a strong foundation in modern web technologies and system architecture. I specialize in building responsive, accessible, and highly performant applications. My engineering philosophy revolves around writing clean, maintainable code and solving complex problems through elegant software design."
    },
    experience: [
      {
        company: "Tech Solutions Inc.",
        role: "Full Stack Software Engineer",
        period: "2022 - Present",
        desc: "Developed and maintained highly scalable web applications using React and Node.js. Improved database query performance by 40% and implemented CI/CD pipelines."
      },
      {
        company: "Digital Innovations",
        role: "Frontend Developer",
        period: "2020 - 2022",
        desc: "Built dynamic, interactive user interfaces for enterprise clients. Collaborated with designers to implement responsive layouts and optimize core web vitals."
      }
    ],
    projects: [
      {
        id: 1,
        title: "E-Commerce Platform",
        description: "A full-stack e-commerce solution featuring real-time inventory management, secure payment gateways, and an intuitive admin dashboard."
      },
      {
        id: 2,
        title: "Task Management API",
        description: "A robust RESTful API built with Node.js and Express, implementing JWT authentication, rate limiting, and comprehensive test coverage."
      }
    ],
    testimonials: [
      {
        name: "David Chen",
        role: "Engineering Manager",
        text: "Dong is an exceptional developer who consistently delivers high-quality code. Their ability to grasp complex architectures quickly is truly impressive."
      },
      {
        name: "Sarah Miller",
        role: "Product Owner",
        text: "Working with Dong is a breeze. They always ensure the technical implementations align perfectly with our product requirements and user needs."
      }
    ],
    education: [
      {
        school: "Jilin University",
        degree: "B.Sc. in Software Engineering",
        year: "Present"
      }
    ],
    services: [
      {
        id: 1,
        title: "Frontend Engineering",
        description: "Crafting responsive, accessible, and highly interactive user interfaces using React, Next.js, and modern CSS."
      },
      {
        id: 2,
        title: "Backend Development",
        description: "Building secure, scalable RESTful APIs and microservices using Node.js, Express, and database technologies."
      },
      {
        id: 3,
        title: "System Architecture",
        description: "Designing robust database schemas, planning scalable infrastructure, and optimizing system performance."
      },
      {
        id: 4,
        title: "DevOps & Tooling",
        description: "Setting up CI/CD pipelines, Docker containerization, and automating deployment workflows."
      }
    ],
    achievements: [
      {
        title: "Blue Bridge Cup",
        date: "2026",
        description: "Awarded for outstanding performance in the national Blue Bridge Coding Competition."
      }
    ]
  },
  zh: {
    ui: {
      "nav": {
        "about": "关于我",
        "services": "专业技能",
        "work": "项目经验",
        "experience": "工作经历",
        "contact": "联系我",
        "terminal": "终端模式",
        "studio": "工作室模式"
      },
      "experience": { "label": "04 / 工作经历", "titlePrefix": "职业", "titleHighlight": "轨迹" },
      "projects": { "titlePrefix": "精选", "titleHighlight": "项目", "desc": "展示技术深度与代码架构能力的代表作品。" },
      "telemetry": { "label": "11 / 系统监控", "titlePrefix": "系统", "titleHighlight": "核心", "uptime": "运行时间", "latency": "延迟", "cpu": "CPU使用率", "memory": "内存", "network": "网络吞吐" },
      "stats": { 
        "metrics": [
          { "id": "exp", "value": 5, "max": 10, "suffix": "+", "unit": "年", "label": "开发经验", "sub": "生产环境实践", "pct": 50, "icon": "⚙" },
          { "id": "projects", "value": 50, "max": 100, "suffix": "+", "unit": "个", "label": "项目交付", "sub": "Web · 移动端 · API", "pct": 50, "icon": "🚀" },
          { "id": "comp", "value": 20, "max": 30, "suffix": "+", "unit": "次", "label": "竞赛获奖", "sub": "黑客马拉松与编程竞赛", "pct": 80, "icon": "🏆" }
        ],
        "label": "系统指标 — 实时" 
      },
      "manifesto": {
        "branches": [
          { "id": "perf", "label": "极致性能", "desc": "P99响应<100ms", "leaves": ["懒加载", "边缘计算"] },
          { "id": "arch", "label": "健壮架构", "desc": "高扩展性设计", "leaves": ["整洁代码", "微服务"] },
          { "id": "rel", "label": "系统可靠", "desc": "99.99%可用性", "leaves": ["类型安全", "测试驱动开发"] }
        ],
        "label": "工程理念", "titlePrefix": "我的", "titleHighlight": "思维框架", "hoverHint": "悬停任意节点以查看详情"
      },
      "process": {
        "steps": [
          { "num": "01", "iconName": "Search", "title": "需求分析", "short": "深入理解业务与痛点。", "detail": "在编写任何代码之前，我会进行详细的需求分析、梳理业务边界，并与利益相关者进行充分沟通。" },
          { "num": "02", "iconName": "Zap", "title": "系统设计", "short": "构建高可扩展的系统蓝图。", "detail": "设计数据库表结构、API接口规范和组件层级，确保系统的底层基础坚如磐石。" },
          { "num": "03", "iconName": "Wrench", "title": "代码实现", "short": "敏捷迭代与测试驱动开发。", "detail": "遵循最佳实践，利用现代框架和严格的类型检查，编写整洁、可维护的高质量代码。" },
          { "num": "04", "iconName": "GitBranch", "title": "系统集成", "short": "无缝对接API与第三方服务。", "detail": "整合第三方服务和支付网关，并配备完善的异常处理机制，保障集成环节的稳定性。" },
          { "num": "05", "iconName": "Shield", "title": "测试与质检", "short": "追求生产环境零Bug。", "detail": "通过单元测试、集成测试和E2E自动化测试，确保每一行提交的代码都能通过CI/CD流水线的严格检验。" },
          { "num": "06", "iconName": "Rocket", "title": "部署上线", "short": "实现零停机的平滑发布。", "detail": "配置自动化部署、应用监控与性能分析，让每一次产品发布都从容自信。" }
        ],
        "label": "06 / 开发流程", "titlePrefix": "我的", "titleHighlight": "工作流", "clickHint": "点击任意步骤展开详情"
      },
      "hero": {
        "systemBadge": "开放<br/>新机会",
        "status": "状态：可接收新项目",
        "node": "位置：远程/全球",
        "viewProjects": "查看项目",
        "contact": "联系我",
        "scroll": "向下滚动浏览",
        "system": "专业.软件工程.作品集"
      },
      "about": {
        "competenciesList": ["全栈开发能力", "云原生基础设施", "系统架构设计"],
        "philosophyList": ["践行整洁代码规范", "测试驱动开发 (TDD)", "以用户体验为导向"],
        "systemOperator": "专业人士",
        "osVersion": "核心技术栈",
        "label": "01 / 个人档案",
        "titlePrefix": "科技",
        "titleHighlight": "创新者",
        "competencies": "核心能力",
        "resume": "下载简历",
        "stats": {
          "node": "当前状态",
          "active": "寻求机会",
          "exp": "5年以上专业经验"
        },
        "goals": "职业目标",
        "optimization": "持续优化系统性能"
      },
      "services": {
        "label": "02 / 核心优势",
        "titlePrefix": "核心",
        "titleHighlight": "技能"
      },
      "tech": {
        "label": "03 / 技术栈",
        "titlePrefix": "技术",
        "titleHighlight": "生态",
        "status": "持续学习与进化"
      },
      "testimonials": {
        "label": "05 / 同行评价",
        "titlePrefix": "同行",
        "titleHighlight": "评价"
      },
      "education": {
        "label": "07 / 学历背景",
        "titlePrefix": "教育",
        "titleHighlight": "经历"
      },
      "achievements": {
        "label": "08 / 荣誉奖项",
        "titlePrefix": "核心",
        "titleHighlight": "成就"
      },
      "gallery": {
        "label": "09 / 精彩瞬间",
        "titlePrefix": "高光",
        "titleHighlight": "时刻",
        "desc": "记录在黑客马拉松、团队建设和开源贡献中的点滴旅程。"
      },
      "contact": {
        "label": "10 / 建立联系",
        "titlePrefix": "建立",
        "titleHighlight": "联系",
        "desc": "正在为您的下一个项目寻找经验丰富的工程师？发送信息，让我们共同打造出色的产品。",
        "email": "直接邮件",
        "name": "您的姓名",
        "emailLabel": "电子邮箱",
        "message": "消息内容",
        "placeholderName": "例如：张三",
        "placeholderMessage": "请描述您的项目需求或咨询内容...",
        "transmit": "发送消息",
        "transmitting": "正在发送...",
        "received": "消息已成功接收！"
      },
      "footer": {
        "rights": "保留所有权利。",
        "cms": "获取源码",
        "built": "基于 React & TypeScript 构建"
      }
    },
    hero: {
      name: "董小轩",
      role: "软件工程师",
      tagline: "以清晰的代码和健壮的架构，构建可扩展、高性能的软件解决方案。"
    },
    about: {
      text: "我是一名充满激情的软件工程师，在现代Web技术和系统架构方面拥有扎实的基础。我专注于构建响应式、无障碍且高性能的应用程序。我的工程理念是以编写整洁、可维护的代码为核心，通过优雅的软件设计来解决复杂的业务问题。"
    },
    experience: [
      {
        company: "科技创新有限公司",
        role: "全栈软件工程师",
        period: "2022 - 至今",
        desc: "使用 React 和 Node.js 开发和维护高可扩展的 Web 应用。将数据库查询性能提升了40%，并从零搭建了 CI/CD 自动化部署流水线。"
      },
      {
        company: "数字前沿网络",
        role: "前端开发工程师",
        period: "2020 - 2022",
        desc: "为企业级客户构建动态交互式的用户界面。与设计团队紧密协作，实现复杂的响应式布局并持续优化 Web 核心性能指标 (Core Web Vitals)。"
      }
    ],
    projects: [
      {
        id: 1,
        title: "全栈电商平台",
        description: "一个功能完备的电子商务解决方案，包含实时库存管理、安全的支付网关集成以及直观的后台数据管理面板。"
      },
      {
        id: 2,
        title: "任务管理 API 系统",
        description: "基于 Node.js 和 Express 构建的健壮 RESTful API，实现了 JWT 身份认证、请求限流机制，并拥有极高的测试覆盖率。"
      }
    ],
    testimonials: [
      {
        name: "陈大卫",
        role: "研发经理",
        text: "小轩是一位极其优秀的开发者，总是能够交付高质量的代码。他对复杂架构的快速理解和掌控能力令人印象深刻。"
      },
      {
        name: "李莎拉",
        role: "产品负责人",
        text: "与小轩合作非常轻松愉快。他总是能确保技术实现与我们的产品需求和用户体验完美契合。"
      }
    ],
    education: [
      {
        school: "吉林大学",
        degree: "软件工程学士学位",
        year: "至今"
      }
    ],
    services: [
      {
        id: 1,
        title: "前端工程化",
        description: "使用 React、Next.js 和现代 CSS 技术，打造响应式、无障碍且高交互的用户界面。"
      },
      {
        id: 2,
        title: "后端开发",
        description: "利用 Node.js、Express 和主流数据库技术，构建安全、高可扩展的 RESTful API 和微服务。"
      },
      {
        id: 3,
        title: "系统架构设计",
        description: "设计稳健的数据库表结构，规划可扩展的系统基础设施，并进行深度性能优化。"
      },
      {
        id: 4,
        title: "DevOps & 自动化",
        description: "配置 CI/CD 流水线，使用 Docker 进行容器化部署，实现运维和发布的全面自动化。"
      }
    ],
    achievements: [
      {
        title: "蓝桥杯全国软件和信息技术专业人才大赛",
        date: "2026",
        description: "在蓝桥杯编程竞赛中展现出色的算法与编码能力，并荣获奖项。"
      }
    ]
  },
  common: {
    heroImage: "https://res.cloudinary.com/dtgoahusr/image/upload/v1778131174/joyce_josokz.jpg",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "PostgreSQL", "Docker", "Git", "REST API"],
    techStack: [
      { name: "React", iconName: "Code", category: "Frontend", level: 95, desc: "Building complex UIs with hooks and context API.", span: "md:col-span-1" },
      { name: "TypeScript", iconName: "Terminal", category: "Language", level: 90, desc: "Strict type-checking for enterprise scale apps.", span: "md:col-span-2" },
      { name: "Node.js", iconName: "Server", category: "Backend", level: 85, desc: "Scalable event-driven backend services.", span: "md:col-span-1" },
      { name: "Next.js", iconName: "Globe", category: "Framework", level: 88, desc: "Server-side rendering and static site generation.", span: "md:col-span-1" },
      { name: "PostgreSQL", iconName: "Database", category: "Database", level: 80, desc: "Relational data modeling and complex queries.", span: "md:col-span-1" },
      { name: "Docker", iconName: "Cpu", category: "DevOps", level: 75, desc: "Containerization and environment consistency.", span: "md:col-span-2" }
    ],
    serviceIcons: {
      1: "Layout",
      2: "Terminal",
      3: "Layers",
      4: "Workflow"
    },
    projectImages: {
      1: "https://picsum.photos/seed/p1/800/600",
      2: "https://picsum.photos/seed/p2/800/600"
    },
    projectTech: {
      1: ["React", "Node.js", "PostgreSQL", "Redis"],
      2: ["Express", "TypeScript", "Jest", "Docker"]
    },
    contact: {
      email: "contact@example.com",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        instagram: "https://instagram.com"
      }
    }
  }
};