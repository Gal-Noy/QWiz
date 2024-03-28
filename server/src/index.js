import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import examsRouter from "./routes/examsRoute.js";
import infoRouter from "./routes/infoRoute.js";

const app = express();

dotenv.config();

app.use(express.json());

app.use(cors());

app.use("/exams", examsRouter);
app.use("/info", infoRouter);

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

// Health check
app.get("/", (req, res) => {
  res.send("Server is running!");
});
