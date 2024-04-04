import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleError } from "../../utils/axiosUtils";
import ExamsList from "../ExamsList/ExamsList";

function UploadedExams({ user }) {
  const [uploadedExams, setUploadedExams] = useState([]);

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
      .catch((err) => handleError(err, () => console.error(err.response.data.message)));
  }, []);

  return <ExamsList filteredExams={uploadedExams} showExams={true} isProfilePage={true} />;
}

export default UploadedExams;
