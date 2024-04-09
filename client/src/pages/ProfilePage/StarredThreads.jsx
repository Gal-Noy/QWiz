import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import ThreadsList from "../../components/ThreadsList/ThreadsList";

function StarredThreads() {
  const [starredThreads, setStarredThreads] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/threads/starred")
      .then((res) =>
        handleResult(res, 200, () => {
          const fetchedThreads = res.data;
          console.log(fetchedThreads);
          const sortedThreads = fetchedThreads.sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1));
          setStarredThreads(sortedThreads);
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
      threads={starredThreads}
      setThreads={setStarredThreads}
      showThreads={true}
      isProfilePage={true}
      isPending={isPending}
      error={error}
    />
  );
}

export default StarredThreads;
