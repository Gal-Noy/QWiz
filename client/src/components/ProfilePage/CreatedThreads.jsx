import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import ThreadsList from "../ThreadsList/ThreadsList";

function CreatedThreads() {
  const [createdThreads, setCreatedThreads] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/threads/created")
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedThreads = res.data;
          setCreatedThreads(fetchedThreads);
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
