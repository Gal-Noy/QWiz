import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import ExamsList from "../../components/ExamsList/ExamsList";

/**
 * The favorite exams component.
 *
 * @component
 * @returns {JSX.Element} The rendered FavoriteExams component.
 */
function FavoriteExams() {
  const [favoriteExams, setFavoriteExams] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavoriteExams = async () => {
    setIsPending(true);
    await axiosInstance
      .get("/exams/favorites")
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedExams = res.data;
          const sortedExams = fetchedExams.sort((a, b) => (a.course > b.course ? 1 : -1));
          setFavoriteExams(sortedExams);
        })
      )
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת הבחינות המועדפות, אנא נסה שנית.")))
      .finally(() => setIsPending(false));
  };

  useEffect(() => fetchFavoriteExams(), []); // Initial fetch

  return (
    <ExamsList
      exams={favoriteExams}
      setExams={setFavoriteExams}
      showExams={true}
      isProfilePage={true}
      isPending={isPending}
      error={error}
    />
  );
}

export default FavoriteExams;
