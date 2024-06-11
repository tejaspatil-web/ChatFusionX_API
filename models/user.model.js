import mongoose from "mongoose";

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

const User = mongoose.model("userDetails", userSchema);
export { User };
