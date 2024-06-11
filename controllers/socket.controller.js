import { saveChatHistory } from "./chat.controller.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { Group } from "../models/group.model.js";

export class socketContoller {
  socketMethods(io) {
    io.on("connection", (socket) => {
      try {
        console.log("User Connected", socket.id);

        socket.on("login", async (userId) => {
          try {
            let user = await User.findById(userId);
            if (!user) {
              throw new Error("User not found");
            }
            socket.userId = userId;
            socket.username = user.userName;
            user.groups.forEach((group) => {
              socket.join(group.groupId.toString());
            });
          } catch (error) {
            console.error("Error during login:", error);
            socket.emit("error", "An error occurred during login");
          }
        });

        socket.on("groupList", async (userId) => {
          try {
            let user = await User.findById(userId);
            if (!user) {
              throw new Error("User not found");
            }
            socket.emit("getGroupsList", {
              groupDetails: user.groups,
            });
          } catch (error) {
            console.error("Error getting group list:", error);
            socket.emit("error", "An error occurred during getting group list");
          }
        });

        socket.on("createGroup", async (groupName, userId) => {
          try {
            let group = new Group({
              name: groupName,
              groupId: "",
              members: [userId],
            });
            // added group id here
            group.groupId = group.id;

            await group.save();

            const user = await User.findById(userId);
            user.groups.push({
              groupId: group._id,
              groupName: groupName,
              unreadCount: 0,
            });
            await user.save();

            socket.join(group._id.toString());
            io.to(group._id.toString()).emit("groupCreated", {
              groupId: group._id,
              groupName: groupName,
              message: `Group ${groupName} created`,
            });
            console.log(`Group ${groupName} created`);
          } catch (error) {
            console.error("Error creating group:", error);
            socket.emit("error", "An error occurred while creating the group");
          }
        });

        // this code may be use in future
        // socket.on("joinGroup", async (groupId, userId) => {
        //   try {
        //     let group = await Group.findOne({ groupId: groupId });
        //     if (group) {
        //       if (!group.members.includes(userId)) {
        //         group.members.push(userId);
        //         await group.save();

        //         const user = await User.findById(userId);
        //         user.groups.push({
        //           groupId: group._id,
        //           groupName: group.name,
        //           unreadCount: 0,
        //         });
        //         await user.save();
        //       }
        //       socket.join(group._id.toString());
        //       // io.to(group._id.toString()).emit(
        //       //   "newMember",
        //       //   `A new member has joined ${group.name}`
        //       // );
        //       console.log(`A new member has joined ${group.name}`);
        //     } else {
        //       socket.emit("error", "Group does not exist");
        //     }
        //   } catch (error) {
        //     console.error("Error joining group:", error);
        //     socket.emit("error", "An error occurred while joining the group");
        //   }
        // });

        socket.on("getGroupMessages", async (groupId) => {
          try {
            // Find all messages for the given group
            const messages = await Chat.find({ groupId });

            // Send the messages to the client
            socket.emit("groupMessages", messages);
          } catch (error) {
            console.error("Error fetching group messages:", error);
            socket.emit(
              "error",
              "An error occurred while fetching group messages"
            );
          }
        });

        socket.on(
          "message",
          async ({ groupId, time, userId, userMessage, userName }) => {
            try {
              // Add groupId to the chat message
              const chatMessage = new Chat({
                userName: userName,
                userId: userId,
                userMessage: userMessage,
                time: time,
                groupId: groupId, // Add the groupId to the message
              });
              await chatMessage.save();

              // Retrieve the group from the database
              const group = await Group.findById(groupId);

              if (!group) {
                throw new Error("Group not found");
              }

              io.to(groupId).emit("message", {
                groupId: groupId,
                userName: userName,
                userMessage: userMessage,
                time: time,
                userId: userId,
              });

              for (let memberId of group.members) {
                if (memberId.toString()) {
                  const user = await User.findById(memberId);
                  const groupInfo = user.groups.find((g) =>
                    g.groupId.equals(groupId)
                  );
                  groupInfo.unreadCount++;
                  await user.save();
                  io.to(memberId.toString()).emit("unreadCount", {
                    groupId: groupId,
                    groupName: group.name,
                    count: groupInfo.unreadCount,
                  });
                }
              }
            } catch (error) {
              console.error("Error sending message:", error);
              socket.emit(
                "error",
                "An error occurred while sending the message"
              );
            }
          }
        );

        socket.on("inviteUser", async (groupId, userId, userName) => {
          try {
            const userToInvite = await User.findOne({ _id: userId });
            if (userToInvite) {
              let group = await Group.findById(groupId);
              if (group) {
                if (!group.members.includes(userToInvite._id)) {
                  group.members.push(userToInvite._id);
                  await group.save();

                  userToInvite.groups.push({
                    groupId: group._id,
                    groupName: group.name,
                    unreadCount: 0,
                  });
                  await userToInvite.save();
                  socket.join(groupId);
                  socket.join(userId);
                  io.to(userId).emit("newMember", {
                    message: `User ${userName} has been added to ${group.name}`,
                    groupName: group.name,
                    groupId: groupId,
                  });
                } else {
                  socket.emit("error", "User is already a member of the group");
                }
              } else {
                socket.emit("error", "Group does not exist");
              }
            } else {
              socket.emit("error", "User does not exist");
            }
          } catch (error) {
            console.error("Error inviting user:", error);
            socket.emit("error", "An error occurred while inviting the user");
          }
        });

        socket.on("readMessages", async ({ userId, groupId }) => {
          try {
            const user = await User.findById(userId);
            if (!user) {
              throw new Error("User not found");
            }
            const groupInfo = user.groups.find((g) =>
              g.groupId.equals(groupId)
            );
            if (groupInfo) {
              groupInfo.unreadCount = 0;
              await user.save();
              socket.emit("unreadCount", {
                groupId: groupId,
                groupName: groupInfo.groupName,
                unreadCount: 0,
              });
            } else {
              socket.emit("error", "Group not found in user's groups");
            }
          } catch (error) {
            console.error("Error marking messages as read:", error);
            socket.emit(
              "error",
              "An error occurred while marking the messages as read"
            );
          }
        });

        socket.on("joinChatFusionXRoom", (room) => {
          socket.join(room);
          console.log(`User joined room: ${room}`);
        });

        socket.on(
          "chatFusionXMessage",
          (room, { userName, userId, userMessage, time }) => {
            saveChatHistory(userName, userId, userMessage, time);
            io.to(room).emit("chatFusionXMessage", {
              userName,
              userId,
              userMessage,
              time,
            });
          }
        );

        socket.on("disconnect", () => {
          console.log("User disconnected", socket.id);
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
}
