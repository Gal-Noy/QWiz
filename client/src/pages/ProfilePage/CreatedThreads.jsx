import React, { useState, useEffect } from "react";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";
import ThreadsList from "../../components/ThreadsList/ThreadsList";

/**
 * The created threads component.
 *
 * @component
 * @returns {JSX.Element} The rendered CreatedThreads component.
 */
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
      .catch((err) => handleError(err, null, () => setError("שגיאה בטעינת הדיונים שנוצרו")))
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
