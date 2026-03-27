import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as contactService from "../services/contactService.js";

export const submitContact = catchAsync(async (req: Request, res: Response) => {
  await contactService.processContactSubmission(req.body);
  res.status(201).json({ success: true });
});
