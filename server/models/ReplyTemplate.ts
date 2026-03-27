import mongoose from "mongoose";

const replyTemplateSchema = new mongoose.Schema({
  title: String,
  body: String,
});

export const ReplyTemplate = mongoose.model("ReplyTemplate", replyTemplateSchema);
