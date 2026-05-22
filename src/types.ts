export interface TranslatableContent {
  hero: {
    name: string;
    role: string;
    tagline: string;
  };
  about: {
    text: string;
  };
  experience: {
    company: string;
    role: string;
    period: string;
    desc: string;
  }[];
  projects: {
    id: number;
    title: string;
    description: string;
    githubUrl?: string;
    liveUrl?: string;
  }[];
  testimonials: {
    name: string;
    role: string;
    text: string;
  }[];
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
  services: {
    id: number;
    title: string;
    description: string;
  }[];
  ui: any;
  achievements: {
    title: string;
    date: string;
    description: string;
  }[];
  techStack: TechStackItem[];
  skills: string[];
  projectTech: { [id: number]: string[] };
}

export interface TechStackItem {
  name: string;
  iconName: string; // Name of the Lucide icon
  category: string;
  level: number;
  desc: string;
  span?: string;
}

export interface PortfolioContent {
  en: TranslatableContent;
  zh: TranslatableContent;
  common: {
    heroImage: string;
    projectImages: { [id: number]: string };
    serviceIcons: { [id: number]: string };
    contact: {
      email: string;
      social: {
        github: string;
        linkedin: string;
        instagram: string;
      };
    };
  };
}

export type Language = 'en' | 'zh';

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  replied: boolean;
}

export interface ReplyTemplate {
  _id: string;
  title: string;
  body: string;
}

export interface User {
  _id: string;
  username: string;
  role: 'admin' | 'editor' | 'user';
  createdAt: string;
}
