import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connection } from "./connection/db.connection.js";
import { soketIO } from "./connection/socket.connection.js";
import userRoute from "./routes/chat.route.js";

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

// This Route Use For Manage User Details
app.use("/api/user", userRoute);


// Handler function for Netlify function
export async function handler(event, context) {
  return new Promise((resolve, reject) => {
    server(event, context, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve();
    });
  });
}

server.listen(8080, () => {
  console.log("server is running on port 8080");
});
