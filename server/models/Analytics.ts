import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  visitorCount: { type: Number, default: 0 },
});

export const Analytics = mongoose.model("Analytics", analyticsSchema);
