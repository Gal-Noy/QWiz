import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import { toast } from "react-custom-alert";

/**
 * The signup component.
 *
 * @component
 * @returns {JSX.Element} The rendered Signup component.
 */
function Signup() {
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [passwordsMatch, setPasswordsMatch] = useState(signupData.password === signupData.confirmPassword);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setPasswordsMatch(signupData.password === signupData.confirmPassword);
  }, [signupData.confirmPassword, signupData.password]);

  /**
   * Handle the signup event.
   *
   * @async
   * @function
   * @param {Event} e - The event object.
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    if (isPending) return;

    e.preventDefault();
    setIsPending(true);

    const { name, email, password, confirmPassword } = signupData;

    if (!name || !email || !password || !confirmPassword) {
      toast.warning("יש למלא כל השדות");
      setIsPending(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("הסיסמאות אינן תואמות");
      setIsPending(false);
      return;
    }

    await axiosInstance
      .post("/auth/register", signupData)
      .then((res) => {
        handleResult(res, 201, () => {
          toast.success("נרשמת בהצלחה");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 1000);
        });
      })
      .catch((err) => handleError(err, null, () => setIsPending(false)));
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
        <Link to="/auth/login">כאן</Link>
      </span>
    </div>
  );
}

export default Signup;
