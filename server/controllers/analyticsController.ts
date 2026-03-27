import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as analyticsService from "../services/analyticsService.js";

export const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getAnalytics();
  res.status(200).json(data);
});

export const trackVisit = catchAsync(async (req: Request, res: Response) => {
  await analyticsService.trackVisit();
  res.status(200).json({ success: true });
});
