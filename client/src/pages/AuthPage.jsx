import React from "react";
import Login from "../components/AuthPage/Login";
import Signup from "../components/AuthPage/Signup";
import "../styles/AuthPage.css";

function AuthPage(props) {
  const { formType, onLogin } = props;

  return (
    <div className="auth-page">
      <div className="auth-side-logo">
        <label id="auth-logo-row-1">QWiz</label>
        <label id="auth-logo-row-2">פורטל המבחנים החדש</label>
      </div>
      <div className="auth-side-form">{formType === "login" ? <Login onLogin={onLogin} /> : <Signup />}</div>
    </div>
  );
}

export default AuthPage;
