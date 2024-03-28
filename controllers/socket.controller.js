import {saveChatHistory} from './chat.controller.js'

export class socketContoller{
socketMethods(io){
    io.on("connection", (socket) => {
        try {
          console.log("User Connected",socket.id);
          socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
          });
  
          socket.on("message", (room,message) => {
            console.log('Message received:', message);
            const {userName,userId,userMessage,time} = JSON.parse(message)
            saveChatHistory(userName,userId,userMessage,time)
            socket.broadcast.to(room).emit('message', message);
          });
  
          socket.on("disconnect", () => {
            console.log("User disconnected",socket.id);
          });
        } catch (error) {
          console.log(error);
        }
      });
}
}