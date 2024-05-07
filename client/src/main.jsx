import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-custom-alert";
import "react-custom-alert/dist/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    <ToastContainer floatingTime={5000} /> {/* Custom alerts */}
  </>
);
