import { PortfolioContent } from '../types';

export const initialPortfolioData: PortfolioContent = {
  en: {
    hero: {
      name: "Dong Xiao Xuan",
      role: "Software Engineer",
      tagline: "Architecting high-performance digital ecosystems with precision and purpose."
    },
    about: {
      text: "I am a dedicated software engineer with over 1 year of experience in building scalable web applications. My expertise lies at the intersection of robust backend systems and immersive frontend experiences. I thrive on solving complex technical challenges and pushing the boundaries of what's possible on the web."
    },
    experience: [
      {
        company: "Quantum Dynamics",
        role: "Lead Full Stack Developer",
        period: "2022 - Present",
        desc: "Spearheading the development of a cloud-native analytics platform. Optimized database queries resulting in a 40% performance boost. Mentoring a team of 12 engineers."
      },
      {
        company: "Nexus Digital",
        role: "Senior Frontend Engineer",
        period: "2019 - 2022",
        desc: "Developed high-fidelity interactive user interfaces for Fortune 500 clients. Implemented a custom design system used across 5 major product lines."
      }
    ],
    projects: [
      {
        id: 1,
        title: "NeuralLink Dashboard",
        description: "An AI-powered data visualization platform that processes millions of data points in real-time using WebWorkers and Canvas API."
      },
      {
        id: 2,
        title: "Aether 3D Engine",
        description: "A custom WebGL-based rendering engine for interactive architectural walkthroughs, built with Three.js and custom GLSL shaders."
      }
    ],
    testimonials: [
      {
        name: "Sarah Jenkins",
        role: "CTO, InnovateX",
        text: "Dong is a rare talent who understands both the business logic and the technical intricacies required to build world-class software."
      },
      {
        name: "Marcus Thorne",
        role: "Product Director",
        text: "The level of detail and performance Dong brings to every project is truly remarkable. A true professional in every sense."
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
        title: "Problem Solving",
        description: "Expertise in diagnosing issues and implementing effective solutions across the tech stack."
      },
      {
        id: 2,
        title: "Full Stack Web Development",
        description: "End-to-end development of responsive, scalable, and secure web applications using modern frontend and backend technologies."
      },
      {
        id: 3,
        title: "Technical Architecture",
        description: "Designing complex system architectures that are built for growth and performance."
      },
      {
        id: 4,
        title: "Artificial Intelligence",
        description: "Leveraging AI/ML technologies to build intelligent applications and automate processes."
      }
    ],
    achievements: [
      {
        title: "Blue Bridge Competition",
        date: "2026",
        description: "Awarded for outstanding performance in the Blue Bridge Coding Competition."
      }
    ]
  },
  zh: {
    hero: {
      name: "董小轩",
      role: "软件工程师",
      tagline: "精准且富有目的地构建高性能数字生态系统。"
    },
    about: {
      text: "我是一名敬业的软件工程师，在构建可扩展的 Web 应用方面拥有超过 8 年的经验。我擅长将强大的后端系统与沉浸式的前端体验相结合，热衷于解决复杂的技术难题，不断探索 Web 技术的边界。"
    },
    experience: [
      {
        company: "量子动力",
        role: "首席全栈开发",
        period: "2022 – 至今",
        desc: "主导云原生分析平台的开发，优化数据库查询，性能提升 40%；带领 12 人工程师团队。"
      },
      {
        company: "Nexus 数字",
        role: "高级前端工程师",
        period: "2019 – 2022",
        desc: "为财富 500 强客户开发高保真交互界面，设计并实现了一套被 5 条主要产品线采用的自定义设计系统。"
      }
    ],
    projects: [
      {
        id: 1,
        title: "NeuralLink 仪表板",
        description: "基于 AI 的数据可视化平台，借助 WebWorkers 和 Canvas API 实时处理数百万数据点。"
      },
      {
        id: 2,
        title: "Aether 3D 引擎",
        description: "基于 WebGL 的自定义渲染引擎，用于交互式建筑漫游，使用 Three.js 和自定义 GLSL 着色器实现。"
      }
    ],
    testimonials: [
      {
        name: "张莎拉",
        role: "InnovateX 首席技术官",
        text: "董小轩是一位难得的人才，既能理解业务逻辑，又深谙构建世界级软件所需的技术细节。"
      },
      {
        name: "马库斯·索恩",
        role: "产品总监",
        text: "董小轩为每个项目带来的细致程度和性能表现令人惊叹，无论在哪个层面都是真正的专业人士。"
      }
    ],
    education: [
      {
        school: "吉林大学",
        degree: "软件工程 学士学位",
        year: "在读"
      }
    ],
    services: [
      {
        id: 1,
        title: "问题解决",
        description: "擅长诊断技术问题并在全栈范围内实施有效解决方案。"
      },
      {
        id: 2,
        title: "全栈 Web 开发",
        description: "端到端开发响应式、可扩展、安全的 Web 应用，使用现代前端和后端技术。"
      },
      {
        id: 3,
        title: "技术架构设计",
        description: "设计面向增长和高性能的复杂系统架构。"
      },
      {
        id: 4,
        title: "人工智能应用",
        description: "利用 AI/ML 技术构建智能应用，实现流程自动化。"
      }
    ],
    achievements: [
      {
        title: "蓝桥杯竞赛",
        date: "2026",
        description: "在蓝桥杯编程竞赛中取得优异成绩并获得奖项。"
      }
    ]
  },
  common: {
    heroImage: "https://picsum.photos/seed/joyi/1920/1080",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "Three.js", "GSAP", "Docker", "AWS"],
    techStack: [
      { name: "React", iconName: "Code", category: "Frontend", level: 95, desc: "Building complex UIs with hooks and context API.", span: "md:col-span-1" },
      { name: "Node.js", iconName: "Server", category: "Backend", level: 90, desc: "Scalable server-side applications and microservices.", span: "md:col-span-1" },
      { name: "MongoDB", iconName: "Database", category: "Database", level: 85, desc: "NoSQL database design and aggregation pipelines.", span: "md:col-span-1" },
      { name: "Three.js", iconName: "Box", category: "Graphics", level: 80, desc: "3D web graphics and interactive experiences.", span: "md:col-span-1" }
    ],
    projectImages: {
      1: "https://picsum.photos/seed/neural/800/600",
      2: "https://picsum.photos/seed/aether/800/600"
    },
    projectTech: {
      1: ["React", "D3.js", "WebWorkers"],
      2: ["Three.js", "WebGL", "GLSL"]
    },
    serviceIcons: {
      1: "Code",
      2: "Layers"
    },
    contact: {
      email: "dong.xiaoxuan@example.com",
      social: {
        github: "https://github.com/dongxiaoxuan",
        linkedin: "https://linkedin.com/in/dongxiaoxuan",
        instagram: "https://instagram.com/dongxiaoxuan"
      }
    }
  }
};