import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import ExamsList from "../../components/ExamsList/ExamsList";

function FavoriteExams() {
  const [favoriteExams, setFavoriteExams] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsPending(true);
    axiosInstance
      .get("/exams/favorites", {})
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedExams = res.data;
          const sortedExams = fetchedExams.sort((a, b) => (a.course > b.course ? 1 : -1));
          setFavoriteExams(sortedExams);
        })
      )
      .then(() => setIsPending(false))
      .catch((err) =>
        handleError(err, () => {
          console.error(err.response.data.message);
          setError(err.response.data.message);
          setIsPending(false);
        })
      );
  }, []);

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
