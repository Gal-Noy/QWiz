import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import ThreadsList from "../../components/ThreadsList/ThreadsList";

function CreatedThreads() {
  const [createdThreads, setCreatedThreads] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/threads/user")
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedThreads = res.data;
          setCreatedThreads(fetchedThreads);
        })
      )
      .catch((err) => handleError(err, "שגיאה בטעינת הדיונים שנוצרו, אנא נסה שנית."))
      .finally(() => setIsPending(false));
  }, []);

  return (
    <ThreadsList
      threads={createdThreads}
      setThreads={setCreatedThreads}
      isProfilePage={true}
      isPending={isPending}
      error={error}
    />
  );
}

export default CreatedThreads;
