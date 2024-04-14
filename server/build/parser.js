import fs from "fs";

// This script is used to convert the courses.txt file into a JSON file with the following structure:
// {
//   "Faculty of Engineering": {
//     "Computer Science": [
//       {
//         "code": "CS 101",
//         "name": "Introduction to Computer Science"
//       },
//       {
//         "code": "CS 102",
//         "name": "Data Structures"
//       }
//     ]
//   }
// }
// Usage: node parser.js

const init = async () => {
  const data = fs.readFileSync("./courses.txt", "utf8");
  const courses = data.split("\n");

  const coursesJsons = courses.map((line) => {
    const [code, faculty, department, name] = line.split("\t");
    return { code, name, department, faculty };
  });

  const sortedCourses = coursesJsons.reduce((acc, course) => {
    const { department, faculty, ...courseWithoutDeptAndFaculty } = course;
    if (faculty && department) {
      if (!acc[faculty]) {
        acc[faculty] = {};
      }
      if (!acc[faculty][department]) {
        acc[faculty][department] = [];
      }
      acc[faculty][department].push(courseWithoutDeptAndFaculty);
    }
    return acc;
  }, {});

  fs.writeFileSync("./courses.json", JSON.stringify(sortedCourses, null, 2));
};

init();
