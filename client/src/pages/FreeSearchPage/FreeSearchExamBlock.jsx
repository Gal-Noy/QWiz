import React from "react";
import ExamRating from "../../components/ExamRating/ExamRating";
import { examToStringVerbose } from "../../utils/generalUtils";

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
          <ExamRating difficultyRating={exam.difficultyRating} examId={exam._id} editMode={false} />
        </div>
      </div>
    </li>
  );
}

export default FreeSearchExamBlock;
