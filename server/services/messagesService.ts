import { Message } from "../models/Message.js";
import { AppError } from "../utils/AppError.js";

export const getAllMessages = async () => {
  return await Message.find().sort({ timestamp: -1 });
};

export const updateMessageStatus = async (id: string, replied: boolean) => {
  const message = await Message.findByIdAndUpdate(id, { replied }, { new: true });
  
  if (!message) {
    throw new AppError("Message not found", 404);
  }
  
  return message;
};
