import { PortfolioContent } from '../types';

export const initialPortfolioData: PortfolioContent = {
  en: {
    ui: {
      "nav": {
        "about": "About",
        "services": "Services",
        "work": "Projects",
        "experience": "Education",
        "contact": "Contact",
        "terminal": "Terminal",
        "studio": "Studio",
        "ai": "Personal AI"
      },
      "experience": { "label": "04 / Education", "titlePrefix": "Academic ", "titleHighlight": "History" },
      "projects": { "titlePrefix": "Selected ", "titleHighlight": "Works", "desc": "A showcase of technical complexity and clean architecture." },
      "telemetry": { "label": "11 / Core_Telemetry", "titlePrefix": "System", "titleHighlight": "Core", "uptime": "Uptime", "latency": "Latency", "cpu": "CPU Load", "memory": "Memory", "network": "Network" },
      "stats": {
        "metrics": [
          { "id": "exp", "value": 5, "max": 10, "suffix": "+", "unit": "yrs", "label": "Experience", "sub": "Production environments", "pct": 50 },
          { "id": "apps", "value": 50, "max": 100, "suffix": "+", "unit": "apps", "label": "Projects", "sub": "Web · Mobile · API", "pct": 50 },
          { "id": "wins", "value": 20, "max": 40, "suffix": "+", "unit": "wins", "label": "Competitions", "sub": "Hackathons & contests", "pct": 80 }
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
          "exp": "5+ Years Experience",
          "expValue": "5+"
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
        company: "Jilin University",
        role: "B.Sc. in Software Engineering",
        period: "Present",
        desc: "Currently pursuing a Bachelor of Science degree in Software Engineering, focusing on core computer science principles and modern software development practices."
      },
      {
        company: "Yantai Economic and Technological Development Zone Senior High School",
        role: "Senior High School Student",
        period: "Graduated",
        desc: "Completed senior high school education with a strong foundation in science and mathematics."
      },
      {
        company: "Yantai Economic and Technological Development Zone Experimental School",
        role: "Junior High School Student",
        period: "Graduated",
        desc: "Completed junior high school education with excellence."
      }
    ],
    projects: [
      {
        id: 1,
        title: "XiaoXuan Competitive Programming Platform",
        description: "A full-stack competitive programming platform featuring real-time code collaboration, automated testing, and a rich problem library."
      },
      {
        id: 2,
        title: "Ward Management System Console Application",
        description: "A robust console application for managing ward activities, featuring user authentication, role-based access control, and a responsive UI."
      },
      {
        id: 3,
        title: "Hospital Management System",
        description: "A robust console application for managing hospital activities, featuring user authentication, role-based access control, and a responsive UI."
      },
      {
        id: 4,
        title: "Multiverse Code Editor",
        description: "A robust code editor application featuring real-time collaboration, extensive language support, and a customizable interface."
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
    ],
    techStack: [
      {
        name: "C",
        iconName: "Code",
        category: "Programming Language",
        level: 95,
        desc: "Strong foundation in system-level programming, memory management, and efficient algorithms.",
        span: "md:col-span-1",
      },
      {
        name: "C++",
        iconName: "Terminal",
        category: "Programming Language",
        level: 90,
        desc: "Object-oriented programming, STL, competitive programming, and performance optimization.",
        span: "md:col-span-2",
      },
      {
        name: "Python",
        iconName: "Server",
        category: "Programming Language",
        level: 88,
        desc: "Scalable backend services, automation scripts, and data-driven applications.",
        span: "md:col-span-1",
      },
      {
        name: "HTML",
        iconName: "Globe",
        category: "Frontend",
        level: 85,
        desc: "Semantic and accessible structure for modern web applications.",
        span: "md:col-span-1",
      },
      {
        name: "CSS",
        iconName: "Palette",
        category: "Frontend",
        level: 80,
        desc: "Responsive design, layouts, animations, and modern UI styling.",
        span: "md:col-span-1",
      },
      {
        name: "React",
        iconName: "Layers",
        category: "Frontend",
        level: 90,
        desc: "Building interactive and component-based user interfaces with modern hooks and state management.",
        span: "md:col-span-2",
      },
      {
        name: "Node.js",
        iconName: "Server",
        category: "Backend",
        level: 88,
        desc: "Backend development with scalable APIs, REST services, and real-time applications.",
        span: "md:col-span-1",
      }
    ],
    skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "PostgreSQL", "Docker", "Git", "REST API"],
    projectTech: {
      1: ["React", "Node.js", "PostgreSQL", "Redis"],
      2: ["Express", "TypeScript", "Jest", "Docker"]
    }
  },
  zh: {
    ui: {
      "nav": {
        "about": "关于我",
        "services": "专业技能",
        "work": "项目经验",
        "experience": "教育经历",
        "contact": "联系我",
        "terminal": "终端模式",
        "studio": "工作室模式",
        "ai": "个人AI助理"
      },
      "experience": { "label": "〇四 / 教育经历", "titlePrefix": "教育", "titleHighlight": "历程" },
      "projects": { "titlePrefix": "精选", "titleHighlight": "项目", "desc": "展示技术深度与代码架构能力的代表作品。" },
      "telemetry": { "label": "一一 / 系统监控", "titlePrefix": "系统", "titleHighlight": "核心", "uptime": "运行时间", "latency": "延迟", "cpu": "CPU使用率", "memory": "内存", "network": "网络吞吐" },
      "stats": {
        "metrics": [
          { "id": "exp", "value": 5, "max": 10, "suffix": "+", "unit": "年", "label": "开发经验", "sub": "生产环境实践", "pct": 50 },
          { "id": "apps", "value": 50, "max": 100, "suffix": "+", "unit": "项目", "label": "完成项目", "sub": "Web · 移动端 · 接口", "pct": 50 },
          { "id": "wins", "value": 20, "max": 40, "suffix": "+", "unit": "奖项", "label": "竞赛获奖", "sub": "黑客马拉松与比赛", "pct": 80 }
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
          { "num": "〇一", "iconName": "Search", "title": "需求分析", "short": "深入理解业务与痛点。", "detail": "在编写任何代码之前，我会进行详细的需求分析、梳理业务边界，并与利益相关者进行充分沟通。" },
          { "num": "〇二", "iconName": "Zap", "title": "系统设计", "short": "构建高可扩展的系统蓝图。", "detail": "设计数据库表结构、API接口规范和组件层级，确保系统的底层基础坚如磐石。" },
          { "num": "〇三", "iconName": "Wrench", "title": "代码实现", "short": "敏捷迭代与测试驱动开发。", "detail": "遵循最佳实践，利用现代框架和严格的类型检查，编写整洁、可维护的高质量代码。" },
          { "num": "〇四", "iconName": "GitBranch", "title": "系统集成", "short": "无缝对接API与第三方服务。", "detail": "整合第三方服务和支付网关，并配备完善的异常处理机制，保障集成环节的稳定性。" },
          { "num": "〇五", "iconName": "Shield", "title": "测试与质检", "short": "追求生产环境零Bug。", "detail": "通过单元测试、集成测试和E2E自动化测试，确保每一行提交的代码都能通过CI/CD流水线的严格检验。" },
          { "num": "〇六", "iconName": "Rocket", "title": "部署上线", "short": "实现零停机的平滑发布。", "detail": "配置自动化部署、应用监控与性能分析，让每一次产品发布都从容自信。" }
        ],
        "label": "〇六 / 开发流程", "titlePrefix": "我的", "titleHighlight": "工作流", "clickHint": "点击任意步骤展开详情"
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
        "label": "〇一 / 个人档案",
        "titlePrefix": "科技",
        "titleHighlight": "创新者",
        "competencies": "核心能力",
        "resume": "下载简历",
        "stats": {
          "node": "当前状态",
          "active": "寻求机会",
          "exp": "5年以上专业经验",
          "expValue": "五+"
        },
        "goals": "职业目标",
        "optimization": "持续优化系统性能"
      },
      "services": {
        "label": "〇二 / 核心优势",
        "titlePrefix": "核心",
        "titleHighlight": "技能"
      },
      "tech": {
        "label": "〇三 / 技术栈",
        "titlePrefix": "技术",
        "titleHighlight": "生态",
        "status": "持续学习与进化"
      },
      "testimonials": {
        "label": "〇五 / 同行评价",
        "titlePrefix": "同行",
        "titleHighlight": "评价"
      },
      "education": {
        "label": "〇七 / 学历背景",
        "titlePrefix": "教育",
        "titleHighlight": "经历"
      },
      "achievements": {
        "label": "〇八 / 荣誉奖项",
        "titlePrefix": "核心",
        "titleHighlight": "成就"
      },
      "gallery": {
        "label": "〇九 / 精彩瞬间",
        "titlePrefix": "高光",
        "titleHighlight": "时刻",
        "desc": "记录在黑客马拉松、团队建设和开源贡献中的点滴旅程。"
      },
      "contact": {
        "label": "一〇 / 建立联系",
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
        company: "吉林大学",
        role: "软件工程 学士",
        period: "在读",
        desc: "目前攻读软件工程专业学士学位，主修计算机科学核心课程与现代软件开发实践。"
      },
      {
        company: "烟台经济技术开发区高级中学",
        role: "高中",
        period: "毕业",
        desc: "完成高中学业，打下了扎实的理科与数学基础。"
      },
      {
        company: "烟台经济技术开发区实验中学",
        role: "初中",
        period: "毕业",
        desc: "以优异的成绩完成初中学业。"
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
        date: "二〇二六",
        description: "在蓝桥杯编程竞赛中展现出色的算法与编码能力，并荣获奖项。"
      }
    ],
    techStack: [
      { name: "React", iconName: "Code", category: "前端", level: 95, desc: "使用 Hooks 和 Context API 构建复杂用户界面", span: "md:col-span-1" },
      { name: "TypeScript", iconName: "Terminal", category: "语言", level: 90, desc: "为企业级应用提供严格类型检查", span: "md:col-span-2" },
      { name: "Node.js", iconName: "Server", category: "后端", level: 85, desc: "构建可扩展的事件驱动后端服务", span: "md:col-span-1" },
      { name: "Next.js", iconName: "Globe", category: "框架", level: 88, desc: "服务端渲染 (SSR) 与静态站点生成 (SSG)", span: "md:col-span-1" },
      { name: "PostgreSQL", iconName: "Database", category: "数据库", level: 80, desc: "关系型数据建模与复杂查询优化", span: "md:col-span-1" },
      { name: "Docker", iconName: "Cpu", category: "运维", level: 75, desc: "容器化部署与开发环境一致性保障", span: "md:col-span-2" }
    ],
    skills: ["React 开发", "Next.js 框架", "TypeScript 核心", "Node.js 后端", "MongoDB", "Tailwind CSS", "PostgreSQL 数据库", "Docker 容器化", "Git 版本控制", "REST API 设计"],
    projectTech: {
      1: ["React", "Node.js 后端", "PostgreSQL", "Redis 缓存"],
      2: ["Express", "TypeScript", "Jest 测试", "Docker"]
    }
  },
  common: {
    heroImage: "https://res.cloudinary.com/dtgoahusr/image/upload/v1778131174/joyce_josokz.jpg",
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