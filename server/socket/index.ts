import { Server } from "socket.io";
import { Analytics } from "../models/Analytics.js";
import { Message } from "../models/Message.js";

export let activeUsers = 0;
export let ioInstance: Server;

export const getAnalyticsData = async () => {
  const analytics = await Analytics.findOne();
  const messageCount = await Message.countDocuments();
  return {
    activeUsers,
    visitorCount: analytics?.visitorCount || 0,
    messageCount,
  };
};

export const initSocket = (io: Server) => {
  ioInstance = io;
  io.on("connection", async (socket) => {
    activeUsers++;
    const data = await getAnalyticsData();
    io.emit("analytics_update", data);

    socket.on("track_interaction", async (interaction) => {
      // For now we just log it or we could store it in a more detailed analytics schema
      // console.log("Interaction tracked:", interaction);
    });

    socket.on("disconnect", async () => {
      activeUsers--;
      const data = await getAnalyticsData();
      io.emit("analytics_update", data);
    });
  });
};
