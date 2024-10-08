import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import router from "./routes/index.js";

const app = express();

dotenv.config();

// Middleware
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// Routes
app.use("/", router);

// Database connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error(error));

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
