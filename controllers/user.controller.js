import { User } from "../models/user.model.js";
import { ChatFusionX } from "../models/chat.model.js";

async function getUserId(req, res) {
  try {
    const admin = process.env.ADMIN;
    const userName = req.params.username;
    if (userName === admin) {
      const adminId = process.env.ADMINID;
      res.status(200).json(adminId);
    } else {
      const user = new User({
        userName: userName,
      });
      const savedUser = await user.save();
      res.status(200).json(savedUser._id);
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

async function updateUserName(req, res) {
  try {
    const userId = req.params.id;
    const updateUserName = req.body.userName;
    await User.updateOne({ _id: userId }, { userName: updateUserName }).then(
      (result) => {
        if (result.modifiedCount > 0) {
          ChatFusionX.updateMany(
            { userId: userId },
            { $set: { userName: updateUserName } }
          ).then((result) => {
            if (result) {
              res.status(200).json({ message: "User updated successfully" });
            } else {
              res
                .status(404)
                .json({ message: "User not found or no changes were made" });
            }
          });
        } else {
          res
            .status(404)
            .json({ message: "User not found or no changes were made" });
        }
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
}

export { getUserId, updateUserName };
