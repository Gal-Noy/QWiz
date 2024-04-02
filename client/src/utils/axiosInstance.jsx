import axios from "axios";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

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
    navigate("/login");
  } else {
    if (callback) {
      callback();
    }
  }
};

export default axiosInstance;
