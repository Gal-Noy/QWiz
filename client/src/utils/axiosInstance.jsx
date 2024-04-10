import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.headers.authorization;
    if (newToken) {
      localStorage.setItem("token", newToken.split(" ")[1]);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const handleResult = (res, status, callback) => {
  if (res.status === status) {
    if (callback) {
      callback();
    }
  } else {
    alert(res.data.message);
  }
};

export const handleError = (error, callback) => {
  if (error.response.status === 401) {
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
