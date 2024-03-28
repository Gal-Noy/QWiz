import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
// import router from './router.js';

export default server = (app) => {
  dotenv.config();

  app.use(express.json());

  app.use(cors());

  app.use("/api", router);

  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log(error));
};
