import mongoose from "mongoose";
import { Faculty, Department, Course } from "../src/models/infoModels.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "../.env" });

const init = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear all collections
    await Faculty.deleteMany();
    await Department.deleteMany();
    await Course.deleteMany();

    // Insert faculty
    const faculty = await Faculty.create({ name: "מדעי הטבע" });

    // Insert department
    const department = await Department.create({
      name: "מדעי המחשב",
      faculty: faculty._id,
    });

    // Insert courses
    const coursesData = fs.readFileSync("./courses.json");
    const courses = JSON.parse(coursesData);
    courses.forEach((course) => {
      course.department = department._id;
    });
    await Course.insertMany(courses);

    console.log("Data inserted");
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.disconnect();
  }
};

init();
