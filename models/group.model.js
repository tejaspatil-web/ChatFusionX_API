import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Group = mongoose.model("GroupDetails", groupSchema);

export { Group };
