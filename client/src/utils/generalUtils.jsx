const formatDate = (date) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date).toLocaleDateString("he-IL", options);
};

const formatDateAndTime = (date) => {
  const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };
  return new Date(date).toLocaleDateString("he-IL", options);
};

const examToString = (exam) => {
  return `${exam.course.name} - ${exam.year} - ${exam.type === "test" ? "מבחן" : "בוחן"} - ${
    exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "ג'"
  } - ${exam.term === 1 ? "א'" : exam.term === 2 ? "ב'" : "ג'"}`;
};

const examToStringVerbose = (exam) => {
  return `${exam.course.name} - ${exam.year} - ${exam.type === "test" ? "מבחן" : "בוחן"} - ${
    exam.semester === 1 ? "סמסטר א" : exam.semester === 2 ? "סמסטר ב" : "סמסטר קיץ"
  } - ${exam.term === 1 ? "מועד א" : exam.term === 2 ? "מועד ב" : "מועד ג"}`;
};

const sumComments = (comments) => {
  let sum = comments.length;
  comments.forEach((comment) => {
    sum += sumComments(comment.replies);
  });
  return sum;
};

const handleClickOutside = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };
  document.addEventListener("mousedown", handleClick);
  return () => {
    document.removeEventListener("mousedown", handleClick);
  };
};

const calcAvgRating = (difficultyRatings) =>
  difficultyRatings.reduce((acc, curr) => acc + curr.rating, 0) / difficultyRatings.length;

export {
  formatDate,
  formatDateAndTime,
  examToString,
  examToStringVerbose,
  sumComments,
  calcAvgRating,
  handleClickOutside,
};
