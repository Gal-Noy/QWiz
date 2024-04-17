import React, { useState } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import "./FavoriteToggle.css";

/**
 * A toggle component for adding or removing an exam from favorites.
 *
 * @component
  * @param {Object} props - The component props.
 * @param {string} props.examId - The ID of the exam.
 * @returns {JSX.Element} - The FavoriteToggle component.
 */
function FavoriteToggle({ examId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isPending, setIsPending] = useState(false);

  /**
   * Adds the exam to the user's favorite exams.
   *
   * @async
   * @function addToFavorites
   * @returns {Promise<void>}
   */
  const addToFavorites = async () =>
    await axiosInstance
      .post(`/exams/favorites/${examId}`)
      .then((res) =>
        handleResult(res, 200, () =>
          localStorage.setItem("user", JSON.stringify({ ...user, favorite_exams: res.data }))
        )
      )
      .catch((err) => handleError(err, "שגיאה בהוספת הבחינה למועדפים, אנא נסה שנית."))
      .finally(() => setIsPending(false));

  /**
   * Removes the exam from the user's favorite exams.
   *
   * @async
   * @function removeFromFavorites
   * @returns {Promise<void>}
   */
  const removeFromFavorites = async () =>
    await axiosInstance
      .delete(`/exams/favorites/${examId}`)
      .then((res) =>
        handleResult(res, 200, () =>
          localStorage.setItem("user", JSON.stringify({ ...user, favorite_exams: res.data }))
        )
      )
      .catch((err) => handleError(err, "שגיאה בהסרת הבחינה מהמועדפים, אנא נסה שנית."))
      .finally(() => setIsPending(false));

  /**
   * Handles the change event of the favorites checkbox.
   *
   * @function handleFavoritesChange
   * @param {Object} e - The event object.
   * @returns {void}
   */
  const handleFavoritesChange = (e) => {
    if (isPending) return;

    setIsPending(true);

    if (e.target.checked) {
      addToFavorites();
    } else {
      removeFromFavorites();
    }
  };

  return isPending ? (
    <div className="lds-dual-ring" id="loading-favorite"></div>
  ) : (
    <div className="checkbox-wrapper-22">
      <label className="switch" htmlFor={`checkbox-${examId}`}>
        <input
          type="checkbox"
          id={`checkbox-${examId}`}
          onChange={handleFavoritesChange}
          checked={user.favorite_exams.includes(examId)}
        />
        <div className="slider round"></div>
      </label>
    </div>
  );
}

export default FavoriteToggle;
