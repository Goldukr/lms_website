import { useState } from "react";
import "./sign.css";
import { apiUrl, parseJsonResponse } from "./api";

function Signin({ onCreateAccount, onForgotPassword, onSignIn, onClose, variant }) {
  const [role, setRole] = useState("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onRoleChange(nextRole) {
    setRole(nextRole);
    setForm({
      identifier: "",
      password: "",
    });
    setSubmitError("");
    setShowPassword(false);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch(apiUrl("/api/auth/signin"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.identifier,
          password: form.password,
          role,
        }),
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        setSubmitError(data?.error || data?.raw || "Sign in failed.");
        return;
      }
      onSignIn?.(data);
    } catch (error) {
      setSubmitError(error?.message || "Sign in failed. Check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isStudent = role === "student";
  const isModal = variant === "modal";

  return (
    <div
      className={`signin-page${isModal ? " signin-modal" : ""}`}
      onClick={isModal ? onClose : undefined}
    >
      <div className="signin-glow signin-glow-a" />
      <div className="signin-glow signin-glow-b" />
      <div className="signin-shell" onClick={(event) => event.stopPropagation()}>
        {!isModal && (
          <div className="brand-block">
            <p className="brand-title">AMIITJEE</p>
            <p className="brand-subtitle">Career institute</p>
          </div>
        )}

        <main className="signin-card">
          {isModal && (
            <button type="button" className="signin-close" onClick={onClose}>
              X
            </button>
          )}

          <div className="signin-tabs" role="tablist" aria-label="Select panel">
            <button
              type="button"
              role="tab"
              aria-selected={isStudent}
              className={`signin-tab ${isStudent ? "active" : ""}`}
              onClick={() => onRoleChange("student")}
            >
              Student Panel
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isStudent}
              className={`signin-tab ${!isStudent ? "active" : ""}`}
              onClick={() => onRoleChange("admin")}
            >
              Admin Panel
            </button>
          </div>

          <h1>{isStudent ? "Student Sign In" : "Admin Sign In"}</h1>
          <p className="signin-subtitle">Login with email or mobile and password.</p>

          <form className="signin-form" onSubmit={onSubmit}>
            <label htmlFor="identifier">Email or Mobile</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="e.g. you@example.com or 9876543210"
              value={form.identifier}
              onChange={onChange}
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true"></i>
              </button>
            </div>

            <button type="button" className="forgot-link" onClick={onForgotPassword}>
              Forgot Password?
            </button>

            {submitError && <p className="form-error">{submitError}</p>}

            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isStudent ? "Sign In as Student" : "Sign In as Admin"}
            </button>
          </form>

          <div className="signin-signup">
            <span>Don't have account </span>
            <button type="button" className="signup-link" onClick={onCreateAccount}>
              Signup
            </button>
          </div>

          <p className="signin-note">{isStudent ? "Student access only." : "Admin access only."}</p>
        </main>
      </div>
    </div>
  );
}

export default Signin;
