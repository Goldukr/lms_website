import { useMemo, useState } from "react";
import "./sign.css";

const STRONG_PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{9,}$/;

function ForgotPassword({ onBackToSignin, onClose, variant }) {
  const [method, setMethod] = useState("mobile");
  const [otpRequested, setOtpRequested] = useState({
    mobile: false,
    email: false,
  });
  const [otpError, setOtpError] = useState("");
  const [form, setForm] = useState({
    mobile: "",
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordMismatch = useMemo(() => {
    if (!form.newPassword || !form.confirmPassword) return false;
    return form.newPassword !== form.confirmPassword;
  }, [form.newPassword, form.confirmPassword]);
  const passwordInvalid = useMemo(() => {
    if (!form.newPassword) return false;
    return !STRONG_PASSWORD_REGEX.test(form.newPassword);
  }, [form.newPassword]);

  const isMobile = method === "mobile";
  const otpEnabled = isMobile ? otpRequested.mobile : otpRequested.email;
  const isModal = variant === "modal";

  function onChange(event) {
    const { name, value } = event.target;

    if (name === "mobile") {
      const nextMobile = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({
        ...prev,
        mobile: nextMobile,
        otp: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setOtpRequested((prev) => ({ ...prev, mobile: false }));
      setOtpError("");
      return;
    }

    if (name === "email") {
      setForm((prev) => ({
        ...prev,
        email: value,
        otp: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setOtpRequested((prev) => ({ ...prev, email: false }));
      setOtpError("");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setOtpError("");
  }

  function onMethodChange(nextMethod) {
    setMethod(nextMethod);
    setForm((prev) => ({ ...prev, otp: "", newPassword: "", confirmPassword: "" }));
    setOtpError("");
  }

  function onGetOtp() {
    if (isMobile) {
      if (!form.mobile.trim()) {
        setOtpError("Please fill the input.");
        return;
      }

      if (form.mobile.length < 10) {
        setOtpError("Please enter the right number.");
        return;
      }
    } else if (!form.email.trim()) {
      setOtpError("Please fill the input.");
      return;
    }

    setOtpError("");
    setOtpRequested((prev) => ({ ...prev, [method]: true }));
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!otpEnabled || passwordMismatch || passwordInvalid) return;
  }

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
          <div className="signin-tabs" role="tablist" aria-label="Reset method">
            <button
              type="button"
              role="tab"
              aria-selected={isMobile}
              className={`signin-tab ${isMobile ? "active" : ""}`}
              onClick={() => onMethodChange("mobile")}
            >
              Mobile OTP
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isMobile}
              className={`signin-tab ${!isMobile ? "active" : ""}`}
              onClick={() => onMethodChange("email")}
            >
              Email OTP
            </button>
          </div>

          <h1>Reset Password</h1>
          <p className="signin-subtitle">Verify OTP and set your new password.</p>

          <form className="signin-form" onSubmit={onSubmit}>
            {isMobile ? (
              <>
                <label htmlFor="reset-mobile">Mobile Number</label>
                <div className="otp-row">
                  <input
                    id="reset-mobile"
                    name="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={form.mobile}
                    onChange={onChange}
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={10}
                    className="otp-target-input"
                    required
                  />
                  <button type="button" className="secondary-btn otp-btn" onClick={onGetOtp}>
                    Get OTP
                  </button>
                </div>
              </>
            ) : (
              <>
                <label htmlFor="reset-email">Email</label>
                <div className="otp-row">
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={onChange}
                    className="otp-target-input"
                    required
                  />
                  <button type="button" className="secondary-btn otp-btn" onClick={onGetOtp}>
                    Get OTP
                  </button>
                </div>
              </>
            )}

            {otpError && <p className="form-error">{otpError}</p>}

            <label htmlFor="reset-otp">OTP</label>
            <input
              id="reset-otp"
              name="otp"
              type="text"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={onChange}
              required={otpEnabled}
              disabled={!otpEnabled}
            />

            <label htmlFor="reset-new-password">New Password</label>
            <input
              id="reset-new-password"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={onChange}
              required={otpEnabled}
              disabled={!otpEnabled}
            />
            {passwordInvalid && (
              <p className="form-error">
                Password must be at least 9 characters with 1 uppercase letter, 1 number, and 1 special symbol.
              </p>
            )}

            <label htmlFor="reset-confirm-password">Confirm Password</label>
            <input
              id="reset-confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={onChange}
              required={otpEnabled}
              disabled={!otpEnabled}
            />

            {passwordMismatch && <p className="form-error">Password and Confirm Password must match.</p>}

            <button
              type="submit"
              className="primary-btn"
              disabled={!otpEnabled || passwordMismatch || passwordInvalid}
            >
              Reset Password
            </button>
          </form>

          <button type="button" className="secondary-btn create-account-bottom" onClick={onBackToSignin}>
            Back to Sign In
          </button>
        </main>
      </div>
    </div>
  );
}

export default ForgotPassword;
