import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as portfolioService from "../services/portfolioService.js";

export const getPortfolio = catchAsync(async (req: Request, res: Response) => {
  const data = await portfolioService.getPortfolioData();
  res.status(200).json(data);
});

export const updatePortfolio = catchAsync(async (req: Request, res: Response) => {
  console.log("POST /api/portfolio - Body keys:", Object.keys(req.body));
  const savedData = await portfolioService.updatePortfolioData(req.body);
  res.status(200).json(savedData);
});
