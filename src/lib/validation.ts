import { z } from 'zod';

const TranslatableContentSchema = z.object({
  hero: z.object({
    name: z.string().min(1, "Name is required").max(100),
    role: z.string().min(1, "Role is required").max(100),
    tagline: z.string().min(1, "Tagline is required").max(300),
  }),
  about: z.object({
    text: z.string().min(1, "About text is required").max(2000),
  }),
  experience: z.array(z.object({
    company: z.string().min(1, "Company is required").max(100),
    role: z.string().min(1, "Role is required").max(100),
    period: z.string().min(1, "Period is required").max(50),
    desc: z.string().min(1, "Description is required").max(1000),
  })).max(10),
  projects: z.array(z.object({
    id: z.number(),
    title: z.string().min(1, "Project title is required").max(100),
    description: z.string().min(1, "Project description is required").max(1000),
  })).max(20),
  testimonials: z.array(z.object({
    name: z.string().min(1, "Testimonial name is required").max(100),
    role: z.string().min(1, "Testimonial role is required").max(100),
    text: z.string().min(1, "Testimonial text is required").max(1000),
  })).max(10),
  education: z.array(z.object({
    school: z.string().min(1, "School is required").max(150),
    degree: z.string().min(1, "Degree is required").max(150),
    year: z.string().min(1, "Year is required").max(50),
  })).max(10),
  services: z.array(z.object({
    id: z.number(),
    title: z.string().min(1, "Service title is required").max(100),
    description: z.string().min(1, "Service description is required").max(500),
  })).max(10),
  achievements: z.array(z.object({
    title: z.string().min(1, "Achievement title is required").max(150),
    date: z.string().min(1, "Achievement date is required").max(50),
    description: z.string().min(1, "Achievement description is required").max(500),
  })).max(20),
});

export const PortfolioContentSchema = z.object({
  en: TranslatableContentSchema,
  zh: TranslatableContentSchema,
  common: z.object({
    heroImage: z.string().url("Invalid hero image URL").max(500),
    skills: z.array(z.string().max(50)).max(50),
    techStack: z.array(z.object({
      name: z.string().min(1, "Tech name is required").max(50),
      iconName: z.string().min(1, "Icon name is required").max(50),
      category: z.string().min(1, "Category is required").max(50),
      level: z.number().min(0).max(100),
      desc: z.string().min(1, "Description is required").max(300),
      span: z.string().max(50).optional(),
    })).max(30),
    projectImages: z.record(z.string(), z.string().url("Invalid project image URL").max(500)),
    projectTech: z.record(z.string(), z.array(z.string().max(50)).max(20)),
    serviceIcons: z.record(z.string(), z.string().max(50)),
    contact: z.object({
      email: z.string().email("Invalid contact email").max(150),
      social: z.object({
        github: z.string().url("Invalid GitHub URL").max(300),
        linkedin: z.string().url("Invalid LinkedIn URL").max(300),
        instagram: z.string().url("Invalid Instagram URL").max(300),
      }),
    }),
  }),
});
