import React from "react";
import { isTextRTL } from "../../utils/generalUtils";
import FavoriteToggle from "../FavoriteToggle/FavoriteToggle";
import ExamRating from "../ExamRating/ExamRating";

function ExamRow({ exam, isProfilePage }) {
  return (
    <div
      className={"exam-row" + (isProfilePage ? " is-profile-page" : "")}
      onClick={() => {
        window.location.href = `/exam/${exam._id}`;
      }}
    >
      <div className="table-element favorite" onClick={(e) => e.stopPropagation()}>
        <FavoriteToggle examId={exam._id} />
      </div>
      <div className="table-element course-num">{exam.course.code}</div>
      <div className="table-element course-name">{exam.course.name}</div>
      <div className="table-element lecturers">{exam.lecturers.join(", ")}</div>
      <div className="table-element type">{exam.type === "test" ? "מבחן" : "בוחן"}</div>
      <div className="table-element year">{exam.year}</div>
      <div className="table-element semester">{exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "קיץ"}</div>
      <div className="table-element term">{exam.semester === 1 ? "א'" : exam.semester === 2 ? "ב'" : "ג'"}</div>
      <div className="table-element grade">{exam.grade}</div>
      <ExamRating exam={exam} editMode={false} />
      <div className="table-element tags">
        {exam.tags.map((tag, index) => (
          <span className="thread-page-tag" key={index}>
            <a href={`/search/${tag}`}>
              {isTextRTL(tag) ? <span dir="rtl">#{tag}</span> : <span dir="ltr">{tag}#</span>}
            </a>
            {index !== exam.tags.length - 1 && ", "}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ExamRow;
