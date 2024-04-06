import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError } from "../../utils/axiosUtils";

function ExamRating(props) {
  const { difficultyRating, examId, editMode, setExam } = props;
  const { totalRatings, averageRating } = difficultyRating;
  const user = JSON.parse(localStorage.getItem("user"));

  const currRating = user.exams_ratings?.find((rating) => rating.exam === examId)?.difficulty_rating;
  const [rating, setRating] = useState(currRating ? currRating : null);

  const rateExam = async (rating) => {
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_URL}/exams/${examId}/rate`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        const { updatedExam, user } = res.data;
        setExam(updatedExam);
        localStorage.setItem("user", JSON.stringify(user));
        setRating(rating);
      })
      .catch((err) =>
        handleError(err, () => {
          console.error(err.response.data.message);
          alert("שגיאה בדירוג הבחינה, אנא נסה שנית.");
        })
      );
  };

  return (
    <div className="table-element row rate">
      {editMode && !rating && (
        <div className="exam-rating">
          <a className="rate-exam-header">דרג/י את הבחינה:</a>
          <form className="star-rating">
            {[5, 4, 3, 2, 1].map((star) => (
              <React.Fragment key={star}>
                <input className="radio-input" type="radio" id={`${star}-stars-${examId}`} name="rating" value={star} />
                <label className="radio-label" htmlFor={`${star}-stars-${examId}`} onClick={() => rateExam(star)} />
              </React.Fragment>
            ))}
          </form>
        </div>
      )}

      {editMode && rating && (
        <div className="exam-rating">
          <a className="rate-exam-header">הדירוג שלך:</a>
          <form className="star-rating">
            {[5, 4, 3, 2, 1].map((star) => (
              <React.Fragment key={star}>
                <input className="radio-input" type="radio" id={`${star}-stars-${examId}`} name="rating" value={star} />
                <label
                  className={`radio-label ${star <= rating ? "selected" : ""}`}
                  htmlFor={`${star}-stars-${examId}`}
                  onClick={() => rateExam(star)}
                />
              </React.Fragment>
            ))}
          </form>
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
