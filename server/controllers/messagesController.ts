import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import * as messagesService from "../services/messagesService.js";

export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const messages = await messagesService.getAllMessages();
  res.status(200).json(messages);
});

export const updateMessageStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { replied } = req.body;
  const message = await messagesService.updateMessageStatus(id as string, replied);
  res.status(200).json(message);
});
