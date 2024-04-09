import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import SearchPage from "./pages/SearchPage/SearchPage.jsx";
import UploadPage from "./pages/UploadPage/UploadPage.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import ExamPage from "./pages/ExamPage/ExamPage.jsx";
import NewThreadPage from "./pages/NewThreadPage/NewThreadPage.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import "./App.css";

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
        <Route path="/exam/:examId" element={isLoggedIn ? <ExamPage /> : <Navigate to="/" replace />} />
        <Route path="/exam/:examId/new-thread" element={isLoggedIn ? <NewThreadPage /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
