import React from "react";
import { useParams } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import "./AuthPage.css";

/**
 * The authentication page component.
 *
 * @component
 * @returns {JSX.Element} The rendered AuthPage component.
 */
function AuthPage() {
  const { formType } = useParams();

  return (
    <div className="auth-page">
      <div className="auth-side-logo">
        <label id="auth-logo-row-1">QWiz</label>
        <label id="auth-logo-row-2">פורטל המבחנים החדש</label>
      </div>
      <div className="auth-side-form">{formType === "login" ? <Login /> : <Register />}</div>
    </div>
  );
}

export default AuthPage;
