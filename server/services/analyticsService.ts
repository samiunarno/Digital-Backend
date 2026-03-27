import { Analytics } from "../models/Analytics.js";
import { getAnalyticsData, ioInstance } from "../socket/index.js";

export const getAnalytics = async () => {
  return await getAnalyticsData();
};

export const trackVisit = async () => {
  await Analytics.findOneAndUpdate({}, { $inc: { visitorCount: 1 } });
  const data = await getAnalyticsData();
  ioInstance.emit("analytics_update", data);
  return data;
};
