import { Chat, User } from "../models/chat.model.js";

async function getChatHistory(req, res) {
  try {
    const userId = req.params.id;
    const adminId = process.env.ADMINID;
    const chatHistory = await Chat.find({}, "-__v");
    if (adminId === userId) {
      const modifiedChatHistory = chatHistory.map((chat) => ({
        ...chat.toObject(),
        isAdmin: true,
      }));
      res.status(200).json(modifiedChatHistory);
    } else {
      res.status(200).json(chatHistory);
    }
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

async function deleteChat(req, res) {
  try {
    const chatId = req.params.chatId;
    const userId = req.params.userId;
    const adminId = process.env.ADMINID;
    if (userId === adminId) {
      await Chat.deleteOne({ _id: chatId }).then((result) => {
        if (result) {
          res.status(200).json({ message: "Chat deleted successfully" });
        } else {
          res.status(500).json({ message: "Error while deleting chat" });
        }
      });
    } else {
      res.status(404).json({ message: "invalid url" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

export {
  saveChatHistory,
  getUserId,
  getChatHistory,
  updateUserName,
  deleteChat,
};
