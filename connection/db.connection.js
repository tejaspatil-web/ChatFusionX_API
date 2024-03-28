import { mongoose } from "mongoose";
export class connection {
  dbConnection() {
    const username = process.env.USER;
    const password = process.env.PASSWORD;
    const clusterName = process.env.CLUSTERNAME;
    const dbName = process.env.DBNAME;

    const connectionString = `mongodb+srv://${username}:${password}@${clusterName}.el7ojsj.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
    mongoose.connect(connectionString)
      .then(() => {
        console.log("Connected to MongoDB Atlas");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB Atlas:", error);
      });
  }
}