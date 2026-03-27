import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as templatesService from "../services/templatesService.js";

export const getTemplates = catchAsync(async (req: Request, res: Response) => {
  const templates = await templatesService.getAllTemplates();
  res.status(200).json(templates);
});

export const createTemplate = catchAsync(async (req: Request, res: Response) => {
  const template = await templatesService.createTemplate(req.body);
  res.status(201).json(template);
});

export const deleteTemplate = catchAsync(async (req: Request, res: Response) => {
  await templatesService.deleteTemplate(req.params.id as string);
  res.status(200).json({ success: true });
});
