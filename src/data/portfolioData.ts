import { PortfolioContent } from '../types';

export const initialPortfolioData: PortfolioContent = {
  en: {
    hero: {
      name: "Joyi Ahmed",
      role: "Senior Full Stack Engineer",
      tagline: "Architecting high-performance digital ecosystems with precision and purpose."
    },
    about: {
      text: "I am a dedicated software architect with over 8 years of experience in building scalable web applications. My expertise lies at the intersection of robust backend systems and immersive frontend experiences. I thrive on solving complex technical challenges and pushing the boundaries of what's possible on the web."
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
        text: "Joyi is a rare talent who understands both the business logic and the technical intricacies required to build world-class software."
      },
      {
        name: "Marcus Thorne",
        role: "Product Director",
        text: "The level of detail and performance Joyi brings to every project is truly remarkable. A true professional in every sense."
      }
    ],
    education: [
      {
        school: "Global Institute of Technology",
        degree: "M.S. in Software Engineering",
        year: "2019"
      }
    ],
    services: [
      {
        id: 1,
        title: "Full Stack Development",
        description: "End-to-end development of robust, scalable, and secure web applications."
      },
      {
        id: 2,
        title: "Technical Architecture",
        description: "Designing complex system architectures that are built for growth and performance."
      }
    ],
    achievements: [
      {
        title: "Open Source Contributor of the Year",
        date: "2024",
        description: "Awarded for significant contributions to the React and Three.js ecosystems."
      },
      {
        title: "Tech Innovation Award",
        date: "2023",
        description: "Recognized for developing a novel algorithm for real-time data compression."
      }
    ]
  },
  zh: {
    hero: {
      name: "艾哈迈德",
      role: "高级全栈工程师",
      tagline: "以精准和目标构建高性能数字生态系统。"
    },
    about: {
      text: "我是一名敬业的软件架构师，在构建可扩展的 Web 应用程序方面拥有超过 8 年的经验。我的专业知识在于强大的后端系统和沉浸式前端体验的交汇处。我热衷于解决复杂的技术挑战并突破 Web 的可能性边界。"
    },
    experience: [
      {
        company: "量子动力",
        role: "首席全栈开发人员",
        period: "2022 - 至今",
        desc: "领导云原生分析平台的开发。优化数据库查询，性能提升 40%。指导 12 名工程师团队。"
      },
      {
        company: "Nexus 数字",
        role: "高级前端工程师",
        period: "2019 - 2022",
        desc: "为财富 500 强客户开发高保真交互式用户界面。实施了用于 5 个主要产品线的自定义设计系统。"
      }
    ],
    projects: [
      {
        id: 1,
        title: "NeuralLink 仪表板",
        description: "一个 AI 驱动的数据可视化平台，使用 WebWorkers 和 Canvas API 实时处理数百万个数据点。"
      },
      {
        id: 2,
        title: "Aether 3D 引擎",
        description: "一个基于 WebGL 的自定义渲染引擎，用于交互式建筑漫游，使用 Three.js 和自定义 GLSL 着色器构建。"
      }
    ],
    testimonials: [
      {
        name: "莎拉·詹金斯",
        role: "InnovateX 首席技术官",
        text: "艾哈迈德是一位罕见的人才，他既了解业务逻辑，也了解构建世界级软件所需的技术复杂性。"
      },
      {
        name: "马库斯·索恩",
        role: "产品总监",
        text: "艾哈迈德为每个项目带来的细节水平和性能确实令人瞩目。在任何意义上都是真正的专业人士。"
      }
    ],
    education: [
      {
        school: "全球理工学院",
        degree: "软件工程硕士",
        year: "2019"
      }
    ],
    services: [
      {
        id: 1,
        title: "全栈开发",
        description: "端到端开发强大、可扩展且安全的 Web 应用程序。"
      },
      {
        id: 2,
        title: "技术架构",
        description: "设计专为增长和性能而构建的复杂系统架构。"
      }
    ],
    achievements: [
      {
        title: "年度开源贡献者",
        date: "2024",
        description: "因对 React 和 Three.js 生态系统的重大贡献而获奖。"
      },
      {
        title: "技术创新奖",
        date: "2023",
        description: "因开发了一种实时数据压缩的新算法而获得认可。"
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
      email: "joyi.ahmed@example.com",
      social: {
        github: "https://github.com/joyiahmed",
        linkedin: "https://linkedin.com/in/joyiahmed",
        instagram: "https://instagram.com/joyiahmed"
      }
    }
  }
};
