import mongoose from "mongoose";
import {
  deleteFaculty,
  deleteFaculties,
  deleteDepartment,
  deleteDepartments,
  populateDepartment,
  deleteCourse,
  deleteCourses,
  populateCourse,
} from "../middleware/categoriesMiddleware.js";

const facultySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

facultySchema.pre("findOneAndDelete", deleteFaculty);
facultySchema.pre("deleteOne", deleteFaculty);
facultySchema.pre("deleteMany", deleteFaculties);

export const Faculty = mongoose.model("Faculty", facultySchema);

const departmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
});

departmentSchema.pre("findOneAndDelete", deleteDepartment);
departmentSchema.pre("deleteOne", deleteDepartment);
departmentSchema.pre("deleteMany", deleteDepartments);

departmentSchema.pre("findOne", populateDepartment);
departmentSchema.pre("find", populateDepartment);

export const Department = mongoose.model("Department", departmentSchema);

const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  lecturers: [
    {
      type: String,
    },
  ],
});

courseSchema.pre("findOneAndDelete", deleteCourse);
courseSchema.pre("deleteOne", deleteCourse);
courseSchema.pre("deleteMany", deleteCourses);

courseSchema.pre("findOne", populateCourse);
courseSchema.pre("find", populateCourse);

courseSchema.pre("save", async function (next) {
  const course = this;

  course.tags = course.tags.sort();
  course.lecturers = course.lecturers.sort();

  next();
});

export const Course = mongoose.model("Course", courseSchema);
