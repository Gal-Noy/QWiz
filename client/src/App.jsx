import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NavBar from "./components/NavBar.jsx";
import "./styles/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token") && !!localStorage.getItem("user"));

  return (
    <Router>
      {isLoggedIn && (
        <NavBar
          onLogout={() => {
            setIsLoggedIn(false);
          }}
        />
      )}
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
        <Route path="/exams" element={isLoggedIn ? <SearchPage /> : <Navigate to="/" replace />} />
        <Route path="/upload" element={isLoggedIn ? <UploadPage /> : <Navigate to="/" replace />} />
        <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
