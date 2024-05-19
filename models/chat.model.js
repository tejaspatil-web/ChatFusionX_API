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

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userId: { type: String, require: true },
  groups: [
    {
      groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
      groupName: { type: String },
      unreadCount: { type: Number, default: 0 },
    },
  ],
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const ChatFusionX = mongoose.model("chatFusionX", chatFusionXSchema);
const Chat = mongoose.model("chatHistory", chatSchema);
const User = mongoose.model("userDetails", userSchema);
const Group = mongoose.model("GroupDetails", groupSchema);

export { Chat, User, Group, ChatFusionX };
