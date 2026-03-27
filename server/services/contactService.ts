import { Message } from "../models/Message.js";
import { ioInstance, getAnalyticsData } from "../socket/index.js";

export const processContactSubmission = async (contactData: { name: string; email: string; message: string }) => {
  const newMessage = await Message.create(contactData);
  
  ioInstance.emit("new_message", newMessage);
  const data = await getAnalyticsData();
  ioInstance.emit("analytics_update", data);
  
  return newMessage;
};
