import { ReplyTemplate } from "../models/ReplyTemplate.js";
import { AppError } from "../utils/AppError.js";

export const getAllTemplates = async () => {
  return await ReplyTemplate.find();
};

export const createTemplate = async (templateData: any) => {
  return await ReplyTemplate.create(templateData);
};

export const deleteTemplate = async (id: string) => {
  const template = await ReplyTemplate.findByIdAndDelete(id);
  
  if (!template) {
    throw new AppError("Template not found", 404);
  }
  
  return template;
};
