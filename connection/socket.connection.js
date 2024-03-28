import { Server } from "socket.io";
import { socketContoller } from "../controllers/socket.controller.js";

export class soketIO {
  socketContoller = new socketContoller()
  soketConnection(server) {
    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:4200","http://localhost:5200"],
        methods: ["GET", "POST"],
      },
    });
    this.socketContoller.socketMethods(io)
  }
}
