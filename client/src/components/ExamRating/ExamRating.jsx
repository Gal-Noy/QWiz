import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import { calcAvgRating } from "../../utils/generalUtils";
import "./ExamRating.css";

function ExamRating(props) {
  const { exam, setExam, editMode } = props;
  const { difficultyRatings } = exam;
  const user = JSON.parse(localStorage.getItem("user"));
  const existingRating = difficultyRatings.find((rating) => rating.user === user._id);
  const totalRatings = difficultyRatings.length;
  const averageRating = calcAvgRating(difficultyRatings);
  const [rating, setRating] = useState(existingRating ? existingRating.rating : null);
  const [isPending, setIsPending] = useState(false);

  const rateExam = async (rating) => {
    if (isPending) return;

    setIsPending(true);

    await axiosInstance
      .post(`/exams/${exam._id}/rate`, { rating })
      .then((res) => handleResult(res, 200, () => setExam(res.data)))
      .catch((err) => handleError(err, "שגיאה בדירוג הבחינה, אנא נסה שנית."))
      .finally(() => setIsPending(false));
  };

  useEffect(() => {
    setRating(existingRating ? existingRating.rating : null);
  }, [existingRating]);

  return (
    <div className="table-element row rate" id={editMode ? "rate_exam" : ""}>
      {editMode && !rating && (
        <div className="exam-rating">
          <a className="rate-exam-header">דרג/י את הבחינה:</a>
          {isPending ? (
            <div className="lds-dual-ring" id="rate-loading"></div>
          ) : (
            <form className="star-rating">
              {[5, 4, 3, 2, 1].map((star) => (
                <React.Fragment key={star}>
                  <input
                    className="radio-input"
                    type="radio"
                    id={`${star}-stars-${exam._id}`}
                    name="rating"
                    value={star}
                  />
                  <label className="radio-label" htmlFor={`${star}-stars-${exam._id}`} onClick={() => rateExam(star)} />
                </React.Fragment>
              ))}
            </form>
          )}
        </div>
      )}
      {editMode && rating && (
        <div className="exam-rating">
          <a className="rate-exam-header">הדירוג שלך:</a>
          {isPending ? (
            <div className="lds-dual-ring" id="rate-loading"></div>
          ) : (
            <form className="star-rating">
              {[5, 4, 3, 2, 1].map((star) => (
                <React.Fragment key={star}>
                  <input
                    className="radio-input"
                    type="radio"
                    id={`${star}-stars-${exam._id}`}
                    name="rating"
                    value={star}
                  />
                  <label
                    className={`radio-label ${star <= rating ? "selected" : ""}`}
                    htmlFor={`${star}-stars-${exam._id}`}
                    onClick={() => rateExam(star)}
                  />
                </React.Fragment>
              ))}
            </form>
          )}
        </div>
      )}

      {!editMode && (
        <meter
          className="average-rating"
          id={`average-rating-${exam._id}`}
          min="0"
          max="5"
          value={averageRating}
          title={`${averageRating} out of 5 stars`}
        >
          {averageRating} out of 5
          <style jsx="true">{`
            #average-rating-${exam._id}::before {
              --percent: calc(${averageRating} / 5 * 100%);
            }
          `}</style>
        </meter>
      )}
      {!editMode && <span className="total-ratings-text">{`(${totalRatings})`}</span>}
    </div>
  );
}

export default ExamRating;
