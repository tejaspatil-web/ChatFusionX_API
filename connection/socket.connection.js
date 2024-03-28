import { Server } from "socket.io";
import { socketContoller } from "../controllers/socket.controller.js";

export class soketIO {
  socketContoller = new socketContoller();
  soketConnection(server) {
    const io = new Server(server, {
      cors: {
        origin: [process.env.MAINAPPURL, process.env.DEVURL],
        methods: ["GET", "POST"],
      },
    });
    this.socketContoller.socketMethods(io);
  }
}
