import React from "react";
import ExamRating from "../../components/ExamRating/ExamRating";
import { examToStringVerbose, isTextRTL } from "../../utils/generalUtils";

function FreeSearchExamBlock({ exam }) {
  return (
    <li className="free-search-list-item" key={exam._id} onClick={() => (window.location.href = `/exam/${exam._id}`)}>
      <div className="free-search-list-item-main-details">
        <a>{examToStringVerbose(exam)}</a>
      </div>
      <div className="free-search-list-item-secondary-details">
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">מחלקה: </a>
          <a className="secondary-details-pair-value">{exam.course.department.name}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">פקולטה: </a>
          <a className="secondary-details-pair-value">{exam.course.department.faculty.name}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">הועלה ע"י: </a>
          <a className="secondary-details-pair-value">{exam.uploadedBy.name}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">דירוג קושי: </a>
          <ExamRating exam={exam} editMode={false} />
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">מרצים: </a>
          <a className="secondary-details-pair-value">{exam.lecturers.join(", ")}</a>
        </div>
        <div className="free-search-list-item-secondary-details-pair">
          <a className="secondary-details-pair-key">תגיות: </a>
          <a className="secondary-details-pair-value">
            {exam.tags.map((tag, index) => (
              <span className="thread-page-tag" key={index}>
                <a href={`/search/${tag}`}>
                  {isTextRTL(tag) ? <span dir="rtl">#{tag}</span> : <span dir="ltr">{tag}#</span>}
                </a>
                {index !== exam.tags.length - 1 && ", "}
              </span>
            ))}
          </a>
        </div>
      </div>
    </li>
  );
}

export default FreeSearchExamBlock;
