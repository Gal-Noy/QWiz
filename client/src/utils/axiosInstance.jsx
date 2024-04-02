import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const handleError = (error, callback) => {
  if (error.response.status === 401) {
    setAuthToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("תוקף ההתחברות פג, אנא התחבר מחדש");
    window.location.href = "/login";
  } else {
    if (callback) {
      callback();
    }
  }
};

export default axiosInstance;
