import { Server } from "socket.io";

export class soketIO {
  soketConnection(server) {
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      try {
        console.log("A user connected",socket.id);
        socket.on("join", (data) => {
          console.log(data);
        });

        socket.on("message", (msg) => {
          console.log("message: " + msg);
          io.emit('chat message', msg);
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
