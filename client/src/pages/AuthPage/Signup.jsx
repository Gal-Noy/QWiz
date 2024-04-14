import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../../utils/axiosInstance";

function Signup() {
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [passwordsMatch, setPasswordsMatch] = useState(signupData.password === signupData.confirmPassword);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordsMatch(signupData.password === signupData.confirmPassword);
  }, [signupData.confirmPassword, signupData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    const { name, email, password, confirmPassword } = signupData;

    if (!name || !email || !password || !confirmPassword) {
      alert("יש למלא כל השדות");
      setIsPending(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("הסיסמאות אינן תואמות");
      setIsPending(false);
      return;
    }

    await axiosInstance
      .post("/auth/register", signupData)
      .then((res) => {
        handleResult(res, 201, () => {
          alert("נרשמת בהצלחה");
          navigate("/login");
        });
      })
      .catch((err) => handleError(err))
      .finally(() => setIsPending(false));
  };

  return (
    <div className="auth-container">
      <h1>הרשמה</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="שם מלא"
          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="אימייל"
          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="אימות סיסמה"
          className={`${passwordsMatch ? "" : "passwords-mismatch"}`}
          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
          required
        />
        <button type="submit" className="auth-submit-button">
          {isPending ? <div className="lds-dual-ring"></div> : "הירשם/י"}
        </button>
      </form>
      <span className="auth-form-footer">
        כבר נרשמת? התחבר/י&nbsp;
        <Link to="/login">כאן</Link>
      </span>
    </div>
  );
}

export default Signup;
