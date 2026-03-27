import mongoose from "mongoose";

const translatableSchema = new mongoose.Schema({
  hero: {
    name: String,
    role: String,
    tagline: String,
  },
  about: {
    text: String,
  },
  experience: [{
    company: String,
    role: String,
    period: String,
    desc: String,
  }],
  projects: [{
    id: Number,
    title: String,
    description: String,
  }],
  testimonials: [{
    name: String,
    role: String,
    text: String,
  }],
  education: [{
    school: String,
    degree: String,
    year: String,
  }],
  services: [{
    id: Number,
    title: String,
    description: String,
  }],
  achievements: [{
    title: String,
    date: String,
    description: String,
  }],
}, { _id: false, minimize: false });

const portfolioSchema = new mongoose.Schema({
  en: translatableSchema,
  zh: translatableSchema,
  common: {
    heroImage: String,
    skills: [String],
    techStack: [{
      name: String,
      iconName: String,
      category: String,
      level: Number,
      desc: String,
      span: String
    }],
    projectImages: { type: Object, default: {} },
    projectTech: { type: Object, default: {} },
    serviceIcons: { type: Object, default: {} },
    contact: {
      email: String,
      social: {
        github: String,
        linkedin: String,
        instagram: String,
      },
    },
  },
}, { minimize: false, timestamps: true });

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
