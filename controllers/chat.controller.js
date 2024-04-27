import { Chat, User } from "../models/chat.model.js";

async function getChatHistory(req, res) {
  try {
    const chatHistory = await Chat.find({}, "-_id -__v");
    res.status(200).json(chatHistory);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
}

async function saveChatHistory(userName, userId, userMessage, time) {
  try {
    const chat = new Chat({
      userName: userName,
      userId: userId,
      userMessage: userMessage,
      time: time,
    });

    await chat.save();
    console.log({ message: "Chat Saved Successfully" });
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
}

async function getUserId(req, res) {
  try {
    const userName = req.params.username;
    const user = new User({
      userName: userName,
    });
    const savedUser = await user.save();
    res.status(200).json(savedUser._id);
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
          Chat.updateMany(
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

export { saveChatHistory, getUserId, getChatHistory, updateUserName };
