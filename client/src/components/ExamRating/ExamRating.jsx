import React, { useState } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import "./ExamRating.css";

function ExamRating(props) {
  const { difficultyRating, examId, editMode, setExam } = props;
  const { totalRatings, averageRating } = difficultyRating;
  const user = JSON.parse(localStorage.getItem("user"));
  const currRating = user.exams_ratings?.find((rating) => rating.exam === examId)?.difficultyRating;
  const [rating, setRating] = useState(currRating ? currRating : null);
  const [isPending, setIsPending] = useState(false);

  const rateExam = async (rating) => {
    if (isPending) return;

    setIsPending(true);

    await axiosInstance
      .post(`/exams/${examId}/rate`, { rating })
      .then((res) =>
        handleResult(res, 200, () => {
          const { updatedExam, user } = res.data;
          setExam(updatedExam);
          localStorage.setItem("user", JSON.stringify(user));
          setRating(rating);
        })
      )
      .catch((err) => handleError(err, "שגיאה בדירוג הבחינה, אנא נסה שנית."))
      .finally(() => setIsPending(false));
  };

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
                    id={`${star}-stars-${examId}`}
                    name="rating"
                    value={star}
                  />
                  <label className="radio-label" htmlFor={`${star}-stars-${examId}`} onClick={() => rateExam(star)} />
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
                    id={`${star}-stars-${examId}`}
                    name="rating"
                    value={star}
                  />
                  <label
                    className={`radio-label ${star <= rating ? "selected" : ""}`}
                    htmlFor={`${star}-stars-${examId}`}
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
          id={`average-rating-${examId}`}
          min="0"
          max="5"
          value={averageRating}
          title={`${averageRating} out of 5 stars`}
        >
          {averageRating} out of 5
          <style jsx="true">{`
            #average-rating-${examId}::before {
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
