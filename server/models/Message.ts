import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  replied: { type: Boolean, default: false },
});

export const Message = mongoose.model("Message", messageSchema);
