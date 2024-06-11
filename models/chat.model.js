import mongoose from "mongoose";

const chatFusionXSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  userMessage: { type: String, require: true },
  time: { type: String, require: true },
});

const chatSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  userMessage: { type: String, require: true },
  time: { type: String, require: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
});

const ChatFusionX = mongoose.model("chatFusionX", chatFusionXSchema);
const Chat = mongoose.model("chatHistory", chatSchema);

export { Chat, ChatFusionX };
