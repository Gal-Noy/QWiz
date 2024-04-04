import React from "react";

function ExamRating({ difficultyRating, examId, editMode }) {
  const { totalRatings, averageRating } = difficultyRating;
  const fixedAverageRating = averageRating.toFixed(1);

  return (
    <div className="table-element row rate">
      {editMode && (
        <form className="star-rating">
          <input className="radio-input" type="radio" id={`5-stars-${examId}`} name="rating" value="5" />
          <label className="radio-label" htmlFor={`5-stars-${examId}`} />
          <input className="radio-input" type="radio" id={`4-stars-${examId}`} name="rating" value="4" />
          <label className="radio-label" htmlFor={`4-stars-${examId}`} />
          <input className="radio-input" type="radio" id={`3-stars-${examId}`} name="rating" value="3" />
          <label className="radio-label" htmlFor={`3-stars-${examId}`} />
          <input className="radio-input" type="radio" id={`2-stars-${examId}`} name="rating" value="2" />
          <label className="radio-label" htmlFor={`2-stars-${examId}`} />
          <input className="radio-input" type="radio" id={`1-star"-${examId}`} name="rating" value="1" />
          <label className="radio-label" htmlFor={`1-star"-${examId}`} />
        </form>
      )}

      {!editMode && (
        <meter
          className="average-rating"
          min="0"
          max="5"
          value={fixedAverageRating}
          title={`${fixedAverageRating} out of 5 stars`}
        >
          {fixedAverageRating} out of 5
          <style jsx="true">{`
            .average-rating::before {
              --percent: calc(${fixedAverageRating} / 5 * 100%);
            }
          `}</style>
        </meter>
      )}
      {!editMode && <span className="total-ratings-text">{`(${totalRatings})`}</span>}
    </div>
  );
}

export default ExamRating;
