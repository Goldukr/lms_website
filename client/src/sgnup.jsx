import { useEffect, useMemo, useState } from "react";
import "./sign.css";
import { apiUrl, parseJsonResponse } from "./api";

const COURSE_OPTIONS = ["11 NEET", "11 JEE- Advance", "12 NEET", "12 JEE-Advance", "NEET Dropper", "JEE Dropper", "Class 7", "Class 8", "Class 9", "Class 10"];
const FACULTY_OPTIONS = ["Physics", "Chemistry", "Mathematics", "Biology"];
const STRONG_PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/;

function Sgnup({
  onBackToSignin,
  onClose,
  variant,
  initialRole = "student",
  adminLabel = "Teacher",
  lockRole = false,
  showFaculty = true,
  disableAdminSignup = false,
  adminSignupDisabledMessage = "",
}) {
  const [role, setRole] = useState(initialRole);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    course: "",
    faculty: "",
    password: "",
    confirmPassword: "",
  });

  function onChange(event) {
    const { name, value } = event.target;
    if (name === "mobile") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onRoleChange(nextRole) {
    setRole(nextRole);
    setForm({
      name: "",
      mobile: "",
      email: "",
      course: "",
      faculty: "",
      password: "",
      confirmPassword: "",
    });
    setSubmitError("");
    setSubmitSuccess("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  const passwordMismatch = useMemo(() => {
    if (!form.password || !form.confirmPassword) return false;
    return form.password !== form.confirmPassword;
  }, [form.password, form.confirmPassword]);
  const passwordInvalid = useMemo(() => {
    if (!form.password) return false;
    return !STRONG_PASSWORD_REGEX.test(form.password);
  }, [form.password]);

  useEffect(() => {
    setRole(disableAdminSignup && initialRole === "admin" && !lockRole ? "student" : initialRole);
  }, [disableAdminSignup, initialRole, lockRole]);

  useEffect(() => {
    if (disableAdminSignup && role === "admin" && !lockRole) {
      setRole("student");
      setSubmitError(adminSignupDisabledMessage || "Admin signup is disabled because an admin account already exists.");
      setSubmitSuccess("");
    }
  }, [adminSignupDisabledMessage, disableAdminSignup, lockRole, role]);

  async function onSubmit(event) {
    event.preventDefault();
    if (passwordMismatch || passwordInvalid) return;
    if (form.mobile.length !== 10) {
      setSubmitError("Mobile number must be exactly 10 digits.");
      setSubmitSuccess("");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const response = await fetch(apiUrl("/api/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          mobile: form.mobile,
          email: form.email,
          role,
          course: role === "student" ? form.course : "",
          faculty: role === "admin" ? form.faculty : "",
          password: form.password,
        }),
      });

      const data = await parseJsonResponse(response);
      if (!response.ok) {
        setSubmitError(data?.error || data?.raw || "Signup failed. Please try again.");
        return;
      }

      setSubmitSuccess("Successfully signed up.");
      setForm({
        name: "",
        mobile: "",
        email: "",
        course: "",
        faculty: "",
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
      onBackToSignin?.({
        role,
        identifier: form.email,
      });
    } catch (error) {
      setSubmitError(error?.message || "Signup failed. Check backend connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }


  const isStudent = role === "student";
  const isModal = variant === "modal";
  const adminPanelLabel = `${adminLabel} Panel`;
  const adminSignUpLabel = `${adminLabel} Sign Up`;
  const adminCreateAccountLabel = `Create ${adminLabel} Account`;
  const adminSignupBlockedMessage = adminSignupDisabledMessage || "Admin signup is disabled because an admin account already exists.";

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

          {!lockRole && (
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
                disabled={disableAdminSignup}
                title={disableAdminSignup ? adminSignupBlockedMessage : ""}
              >
                {adminPanelLabel}
              </button>
            </div>
          )}

          <h1>{isStudent ? "Student Sign Up" : adminSignUpLabel}</h1>
          <p className="signin-subtitle">Create account with email/mobile and password.</p>

          <form className="signin-form" onSubmit={onSubmit}>
            <label htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={onChange}
              required
            />

            <label htmlFor="signup-mobile">Mobile Number</label>
            <input
              id="signup-mobile"
              name="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={form.mobile}
              onChange={onChange}
              inputMode="numeric"
              pattern="[0-9]{10}"
              required
            />

            {isStudent && (
              <>
                <label htmlFor="signup-course">Course</label>
                <select
                  id="signup-course"
                  name="course"
                  value={form.course}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Course</option>
                  {COURSE_OPTIONS.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </>
            )}

            {!isStudent && showFaculty && (
              <>
                <label htmlFor="signup-faculty">Faculty</label>
                <select
                  id="signup-faculty"
                  name="faculty"
                  value={form.faculty}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Faculty</option>
                  {FACULTY_OPTIONS.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={onChange}
              required
            />

            <label htmlFor="signup-password">Password</label>
            <div className="password-field">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create your password"
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
            {passwordInvalid && (
              <p className="form-error">
                Password must be at least 9 characters with 1 uppercase letter, 1 number, and 1 special symbol.
              </p>
            )}

            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <div className="password-field">
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                aria-pressed={showConfirmPassword}
              >
                <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true"></i>
              </button>
            </div>

            {passwordMismatch && <p className="form-error">Password and Confirm Password must match.</p>}
            {submitError && <p className="form-error">{submitError}</p>}
            {disableAdminSignup && !lockRole && <p className="signin-note">{adminSignupBlockedMessage}</p>}
            {submitSuccess && <p className="form-success">{submitSuccess}</p>}

            <button
              type="submit"
              className="primary-btn"
              disabled={passwordMismatch || passwordInvalid || isSubmitting}
            >
              {isStudent ? "Create Student Account" : adminCreateAccountLabel}
            </button>
          </form>

          <button type="button" className="secondary-btn create-account-bottom" onClick={() => onBackToSignin?.()}>
            {submitSuccess ? "Continue to Sign In" : "Back to Sign In"}
          </button>
        </main>
      </div>
    </div>
  );
}

export default Sgnup;
