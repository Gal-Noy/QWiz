import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import ExamsList from "../../components/ExamsList/ExamsList";

/**
 * The uploaded exams component.
 *
 * @component
 * @returns {JSX.Element} The rendered UploadedExams component.
 */
function UploadedExams() {
  const [uploadedExams, setUploadedExams] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches the uploaded exams.
   *
   * @async
   * @function fetchUploadedExams
   * @returns {Promise<void>} The result of the axios request.
   */
  const fetchUploadedExams = async () => {
    setIsPending(true);
    await axiosInstance
      .get("/exams/uploaded")
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedExams = res.data;
          const sortedExams = fetchedExams.sort((a, b) => (a.course > b.course ? 1 : -1));
          setUploadedExams(sortedExams);
        })
      )
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת הבחינות שהועלו, אנא נסה שנית.")))
      .finally(() => setIsPending(false));
  };

  // Initial fetch
  useEffect(() => {
    fetchUploadedExams();
  }, []);

  return (
    <ExamsList
      exams={uploadedExams}
      setExams={setUploadedExams}
      showExams={true}
      isProfilePage={true}
      isPending={isPending}
      error={error}
    />
  );
}

export default UploadedExams;
