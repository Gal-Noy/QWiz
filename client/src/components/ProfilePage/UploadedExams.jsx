import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError } from "../../utils/axiosUtils";
import ExamsList from "../ExamsList/ExamsList";

function UploadedExams() {
  const [uploadedExams, setUploadedExams] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/exams/uploaded`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const fetchedExams = res.data;
          const sortedExams = fetchedExams.sort((a, b) => (a.course > b.course ? 1 : -1));
          setUploadedExams(sortedExams);
        }
      })
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
