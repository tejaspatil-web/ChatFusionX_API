import express from "express";
import http from "http";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connection } from "./connection/db-connection.js";
import { soketIO } from "./connection/socket-connection.js";

const app = express();
const server = http.createServer(app);

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

server.listen(8080, () => {
  console.log("server is running on port 8080");
});
