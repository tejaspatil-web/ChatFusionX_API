import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connection } from "./connection/db.connection.js";
import { soketIO } from "./connection/socket.connection.js";
import chatRoute from "./routes/chat.route.js";
import userRoute from "./routes/user.route.js";
import genAiRoute from "./routes/ai.route.js";

// Dot env Configuration
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: [process.env.MAINAPPURL, process.env.DEVURL] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// DB Connection
const dbConnection = new connection();
dbConnection.dbConnection();

// Socket Connection
const soketConnection = new soketIO();
soketConnection.soketConnection(server);

// This Route Use For Manage Chat Details
app.use("/api/chat", chatRoute);

// This Route Use For Manage User Details
app.use("/api/user", userRoute);

// This Route Use For Genrative AI
app.use("/api/genai", genAiRoute);

server.listen(8080, () => {
  console.log("server is running on port 8080");
});
