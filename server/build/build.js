import mongoose from "mongoose";
import { Faculty, Department, Course } from "../src/models/infoModels.js";
import dotenv from "dotenv";
import fs from "fs";

// This script is used to insert data from courses.json into the database
// Usage: node build.js

dotenv.config({ path: "../.env" });

const init = async () => {
  try {
    console.log("Building database");
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear all collections
    await Faculty.deleteMany();
    await Department.deleteMany();
    await Course.deleteMany();

    const coursesData = fs.readFileSync("./courses.json");
    console.log("Reading data from courses.json");
    const coursesJson = JSON.parse(coursesData);

    console.log("Inserting data");
    for (const facultyName in coursesJson) {
      // Insert faculty if not exists
      let existingFaculty = await Faculty.findOne({ name: facultyName });
      if (!existingFaculty) {
        const newFaculty = new Faculty({ name: facultyName });
        await newFaculty.save();
        existingFaculty = newFaculty;
      }

      for (const departmentName in coursesJson[facultyName]) {
        // Insert department if not exists
        let existingDepartment = await Department.findOne({ name: departmentName });
        if (!existingDepartment) {
          const newDepartment = new Department({ name: departmentName, faculty: existingFaculty._id });
          await newDepartment.save();
          existingDepartment = newDepartment;
        }

        // Insert courses
        const departmentCourses = coursesJson[facultyName][departmentName].map((courseJson) => {
          return {
            code: courseJson.code,
            name: courseJson.name,
            department: existingDepartment._id,
          };
        });

        await Course.insertMany(departmentCourses);
        console.log(`Inserted ${departmentCourses.length} courses for ${departmentName}`);
      }
    }
    
    console.log("Data inserted");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

init();
