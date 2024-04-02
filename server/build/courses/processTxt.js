import fs from "fs";

const init = async () => {
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.log("Usage: node processTxt.js <fileName> <faculty> <department>");
    return;
  }
  const fileName = args[0];
  const faculty = args[1];
  const department = args[2];

  const data = fs.readFileSync(fileName, "utf8");
  const courses = data.split("\n");

  // add faculty and department elements
  const dataWithFacDep = courses.map((line) => {
    const items = line.split("\t");
    items.splice(1, 1); // remove date
    items.splice(1, 0, faculty, department);
    return items.join("\t");
  });

  // Join the modified lines into a single string
  const modifiedData = dataWithFacDep.join("\n");

  fs.writeFileSync(fileName, modifiedData);
};

init();
