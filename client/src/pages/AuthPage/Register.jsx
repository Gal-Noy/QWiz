import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { handleError, handleResult } from "../../api/axiosInstance";
import { toast } from "react-custom-alert";

/**
 * The register component.
 *
 * @component
 * @returns {JSX.Element} The rendered Register component.
 */
function Register() {
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [passwordsMatch, setPasswordsMatch] = useState(registerData.password === registerData.confirmPassword);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setPasswordsMatch(registerData.password === registerData.confirmPassword);
  }, [registerData.confirmPassword, registerData.password]);

  /**
   * Handle the register event.
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

    const { name, email, password, confirmPassword } = registerData;

    if (!name || !email || !password || !confirmPassword) {
      setIsPending(false);
      return toast.warning("יש למלא כל השדות");
    }

    if (password !== confirmPassword) {
      setIsPending(false);
      return toast.warning("הסיסמאות אינן תואמות");
    }

    await axiosInstance
      .post("/auth/register", registerData)
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
          onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="אימייל"
          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="אימות סיסמה"
          className={`${passwordsMatch ? "" : "passwords-mismatch"}`}
          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
          required
        />
        <button type="submit" className="auth-submit-button">
          {isPending ? <div className="lds-dual-ring" id="auth-loading"></div> : "הירשם/י"}
        </button>
      </form>
      <span className="auth-form-footer">
        כבר נרשמת? התחבר/י&nbsp;
        <Link to="/auth/login">כאן</Link>
      </span>
    </div>
  );
}

export default Register;
