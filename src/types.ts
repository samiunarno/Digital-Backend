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
  achievements: {
    title: string;
    date: string;
    description: string;
  }[];
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
    skills: string[];
    techStack: TechStackItem[];
    projectImages: { [id: number]: string };
    projectTech: { [id: number]: string[] };
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
  role: 'admin' | 'editor';
  createdAt: string;
}
