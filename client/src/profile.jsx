import { useEffect, useState } from "react";
import "./profile.css";
import { apiUrl, parseJsonResponse } from "./api";

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  mobile: "",
  avatar: "",
};

function Profile({ onBackHome, onSaved, token, course }) {
  const [form, setForm] = useState(DEFAULT_PROFILE);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(apiUrl("/api/profile"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => ({ ok: response.ok, data: await parseJsonResponse(response) }))
      .then(({ ok, data }) => {
        if (!ok) {
          setStatus(data?.error || "Failed to load profile.");
          return;
        }
        setForm({ ...DEFAULT_PROFILE, ...data });
      })
      .catch(() => {
        setStatus("Failed to load profile.");
      });
  }, [token]);

  function onChange(event) {
    const { name, value } = event.target;
    if (name === "mobile") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(event) {
    event.preventDefault();
    if (form.mobile && form.mobile.length !== 10) {
      setStatus("Mobile number must be exactly 10 digits.");
      setTimeout(() => setStatus(""), 2000);
      return;
    }
    if (!token) return;
    fetch(apiUrl("/api/profile"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then(async (response) => ({ ok: response.ok, data: await parseJsonResponse(response) }))
      .then(({ ok, data }) => {
        if (!ok) {
          setStatus(data?.error || "Failed to update profile.");
          return;
        }
        onSaved?.(data);
        setStatus("Profile updated.");
        setTimeout(() => setStatus(""), 2000);
      })
      .catch(() => {
        setStatus("Failed to update profile.");
      });
  }

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <header className="profile-header">
          <h1>Student Profile</h1>
          <button type="button" className="secondary-btn" onClick={onBackHome}>
            Back Home
          </button>
        </header>

        <form className="profile-card" onSubmit={onSubmit}>
          <div className="profile-avatar">
            <label className="profile-avatar-preview" title="Upload profile photo">
              {form.avatar ? (
                <img src={form.avatar} alt="Profile" />
              ) : (
                <span className="profile-avatar-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm0 10.5a6.5 6.5 0 0 1-5.385-2.857C3.67 10.566 5.522 9.5 8 9.5c2.478 0 4.33 1.066 5.385 2.643A6.5 6.5 0 0 1 8 15Z" />
                  </svg>
                </span>
              )}
              <span className="profile-avatar-plus">+</span>
              <input type="file" accept="image/*" onChange={onAvatarChange} />
            </label>
            <p className="profile-upload-hint">Upload Profile Photo</p>
          </div>

          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="profile-mobile">Mobile Number</label>
          <input
            id="profile-mobile"
            name="mobile"
            type="tel"
            value={form.mobile}
            onChange={onChange}
            placeholder="Enter your mobile number"
            inputMode="numeric"
            pattern="[0-9]{10}"
          />

          <label htmlFor="profile-course">Course Chosen</label>
          <input id="profile-course" type="text" value={course || "Not set"} disabled />

          {status && <p className="profile-status">{status}</p>}

          <button type="submit" className="primary-btn">
            Save Changes
          </button>
        </form>
        <div className="site-copyright">
          <p>© 2026 AMIITJEE Career Institute. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
