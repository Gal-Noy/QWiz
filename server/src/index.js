import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/index.js";

const app = express();

dotenv.config();

app.use(express.json());

app.use(cors());

app.use("/", router);

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});
