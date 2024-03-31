import React, { useEffect } from "react";

function ExamsList(props) {
  const { filteredExams, showExams } = props;

  if (showExams) {
    console.log(filteredExams);
  }
  return (
    <div className="exams-list">
      {/* {filteredExams.map((exam) => (
        <div key={exam._id} className="exam-card">
          <div className="exam-card-title">{exam.title}</div>
          <div className="exam-card-details">
            <div>{exam.year}</div>
            <div>{exam.semester}</div>
            <div>{exam.term}</div>
            <div>{exam.type}</div>
            <div>{exam.grade}</div>
            <div>{exam.lecturers.join(", ")}</div>
            <div>{exam.difficultyRating.averageRating}</div>
          </div>
        </div>
      ))} */}
    </div>
  );
}

export default ExamsList;
