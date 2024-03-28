import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  userMessage: { type: String, require: true },
  time:{type:String,require:true}
});

const userSchema = new mongoose.Schema({
  userName: { type: String, require: true },
});

const Chat = mongoose.model("chatHistory", chatSchema);
const User = mongoose.model("userDetails", userSchema);

export { Chat, User };
