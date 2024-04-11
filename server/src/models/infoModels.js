import mongoose from "mongoose";

const facultySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

facultySchema.pre("remove", async function (next) {
  await Department.deleteMany({ faculty: this._id });
  next();
});

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

departmentSchema.pre("remove", async function (next) {
  await Course.deleteMany({ department: this._id });
  next();
});

const populateDepartment = function (next) {
  this.populate("faculty", "name");
  next();
};

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
});

courseSchema.pre("remove", async function (next) {
  await Exam.deleteMany({ course: this._id });
  next();
});

const populateCourse = function (next) {
  this.populate("department", "name");
  next();
};

courseSchema.pre("findOne", populateCourse);
courseSchema.pre("find", populateCourse);

export const Course = mongoose.model("Course", courseSchema);
