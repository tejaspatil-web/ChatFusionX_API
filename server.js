import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connection } from "./connection/db.connection.js";
import { soketIO } from "./connection/socket.connection.js";
import userRoute from './routes/chat.route.js'

const app = express();
const server = http.createServer(app);

app.use(cors({origin:["http://localhost:4200","http://localhost:5200"]}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Dot env Configuration
dotenv.config();

// DB Connection
const dbConnection = new connection();
dbConnection.dbConnection();

// Socket Connection
const soketConnection = new soketIO();
soketConnection.soketConnection(server);


// This Route Use For Manage User Details
app.use("/api/user", userRoute);

server.listen(8080, () => {
  console.log("server is running on port 8080");
});
