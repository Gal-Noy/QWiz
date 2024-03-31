import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import "./styles/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token") && !!localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <HomePage onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage formType={"login"} onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" replace /> : <AuthPage formType={"signup"} />} />
      </Routes>
    </Router>
  );
}

export default App;
