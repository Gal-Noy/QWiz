import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ExamsSearchPage from "./pages/ExamsSearchPage/ExamsSearchPage.jsx";
import UploadPage from "./pages/UploadPage/UploadPage.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import ExamPage from "./pages/ExamPage/ExamPage.jsx";
import NewThreadPage from "./pages/NewThreadPage/NewThreadPage.jsx";
import ThreadPage from "./pages/ThreadPage/ThreadPage.jsx";
import FreeSearchPage from "./pages/FreeSearchPage/FreeSearchPage.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import "./App.css";

function App() {
  const isLoggedIn = !!localStorage.getItem("token") && !!localStorage.getItem("user");

  return (
    <Router>
      {isLoggedIn && <NavBar />}
      <Routes>
        {/* home routes */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/auth/login" replace />}
        />
        <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/auth/login" replace />} />

        {/* auth route */}
        <Route path="/auth/:formType" element={isLoggedIn ? <Navigate to="/" replace /> : <AuthPage />} />

        {/* profile routes */}
        <Route
          path="/profile"
          element={isLoggedIn ? <Navigate to="/profile/personal-details" replace /> : <Navigate to="/" replace />}
        />
        <Route path="/profile/:tab" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" replace />} />

        {/* upload exam route */}
        <Route path="/upload" element={isLoggedIn ? <UploadPage /> : <Navigate to="/" replace />} />

        {/* exams search route */}
        <Route path="/exams" element={isLoggedIn ? <ExamsSearchPage /> : <Navigate to="/" replace />} />

        {/* exam routes */}
        <Route path="/exam/:examId" element={isLoggedIn ? <ExamPage /> : <Navigate to="/" replace />} />
        <Route path="/exam/:examId/:tab" element={isLoggedIn ? <ExamPage /> : <Navigate to="/" replace />} />
        <Route path="/exam/:examId/new-thread" element={isLoggedIn ? <NewThreadPage /> : <Navigate to="/" replace />} />

        {/* thread routes */}
        <Route path="/thread/:threadId" element={isLoggedIn ? <ThreadPage /> : <Navigate to="/" replace />} />
        <Route
          path="/thread/:threadId/comment/:commentId"
          element={isLoggedIn ? <ThreadPage /> : <Navigate to="/" replace />}
        />

        {/* free search route */}
        <Route path="/search/:query" element={isLoggedIn ? <FreeSearchPage /> : <Navigate to="/" replace />} />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
