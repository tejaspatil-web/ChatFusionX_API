import { ChatFusionX } from "../models/chat.model.js";

async function getChatHistory(req, res) {
  try {
    const userId = req.params.id;
    const adminId = process.env.ADMINID;
    const chatHistory = await ChatFusionX.find({}, "-__v");
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
    const chat = new ChatFusionX({
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

async function deleteChat(req, res) {
  try {
    const chatId = req.params.chatId;
    const userId = req.params.userId;
    const adminId = process.env.ADMINID;
    if (userId === adminId) {
      await ChatFusionX.deleteOne({ _id: chatId }).then((result) => {
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

export { saveChatHistory, getChatHistory, deleteChat };
