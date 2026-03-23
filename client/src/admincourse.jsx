import { useEffect, useMemo, useRef, useState } from "react";
import "./course.css";

const NAV_ITEMS = ["Home", "Admin", "Test Series", "About Us"];
const COURSE_OPTIONS = ["11 NEET", "11 JEE-Advance", "12 NEET", "12 JEE-Advance", "NEET Dropper", "JEE Dropper", "Class 7", "Class 8", "Class 9", "Class 10"];
const SUBJECT_OPTIONS = ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Social Science"];

const FOOTER_GROUPS = [
  {
    title: "In-Demand Careers",
    items: ["NEET Aspirants", "JEE Advanced Track", "Medical Foundations", "Engineering Core", "Scholarship Prep", "Career Guidance"],
  },
  {
    title: "STEM Courses",
    items: ["Physics", "Chemistry", "Biology", "Mathematics", "Problem Solving", "Mock Tests"],
  },
  {
    title: "Test Series",
    items: ["NEET Full Tests", "JEE Advanced Tests", "Chapter-wise Tests", "Previous Year Papers", "All-India Rank Tests", "Progress Reports"],
  },
  {
    title: "Student Success",
    items: ["Mentor Support", "Study Plans", "Doubt Clearing", "Performance Analytics", "Parent Updates", "Success Stories"],
  },
];

const FOOTER_LINKS = ["About", "Discover AMIITJEE", "For Schools", "Legal & Accessibility"];
const API_BASE = import.meta.env.VITE_API_URL || "";

function AdminCourse({ onBackHome, onBackCourses, onLogout, userName, token, onGoAdmin }) {
  const [form, setForm] = useState({
    chapter: "",
    course: "",
    subject: "",
    file: null,
  });
  const [uploads, setUploads] = useState([]);
  const [status, setStatus] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  function loadUploads() {
    fetch(`${API_BASE}/api/notes`)
      .then((response) => response.json())
      .then((data) => setUploads(Array.isArray(data) ? data : []))
      .catch(() => setUploads([]));
  }

  useEffect(() => {
    loadUploads();
  }, []);

  const subjectOptions = useMemo(() => {
    if (!form.course) return SUBJECT_OPTIONS;
    if (form.course.includes("NEET")) {
      return ["Physics", "Chemistry", "Biology"];
    }
    if (form.course.includes("JEE")) {
      return ["Physics", "Chemistry", "Mathematics"];
    }
    return SUBJECT_OPTIONS;
  }, [form.course]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "course" ? { subject: "" } : null),
    }));
  }

  function onFileChange(event) {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!form.chapter.trim() || !form.course || !form.subject || !form.file) return;
    if (!token) {
      setStatus("Missing admin token.");
      return;
    }
    setStatus("");
    const payload = new FormData();
    payload.append("chapter", form.chapter.trim());
    payload.append("course", form.course);
    payload.append("subject", form.subject);
    payload.append("file", form.file);

    fetch(`${API_BASE}/api/admin/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setStatus(data?.error || "Upload failed.");
          return;
        }
        setForm({ chapter: "", course: "", subject: "", file: null });
        loadUploads();
      })
      .catch(() => setStatus("Upload failed."));
  }

  function onDelete(id) {
    if (!token) {
      setStatus("Missing admin token.");
      return;
    }
    fetch(`${API_BASE}/api/admin/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) return response.json().then((data) => Promise.reject(data));
        loadUploads();
      })
      .catch(() => setStatus("Delete failed."));
  }

  return (
    <div className="course-page">
      <header className="course-topbar">
        <button type="button" className="course-brand" onClick={onBackHome}>
          <p className="course-brand-title">AMIITJEE</p>
          <p className="course-brand-subtitle">Career institute</p>
        </button>

        <nav className="course-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className="course-nav-item"
              onClick={item === "Admin" ? onBackCourses : onBackHome}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="course-actions">
          <div className="course-user" ref={menuRef}>
            <button type="button" className="course-user-btn" onClick={() => setMenuOpen((prev) => !prev)}>
              {userName || "Admin"}
            </button>
            {menuOpen && (
              <div className="course-user-menu">
                <button type="button" onClick={onBackHome}>
                  Home
                </button>
                <button type="button" onClick={onGoAdmin}>
                  Admin
                </button>
                <button type="button" onClick={onLogout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="course-shell">
        <h1 className="course-title">Admin Course Upload</h1>
        <div className="admin-course-card">
          <p className="admin-course-subtitle">Upload notes and study material for students.</p>
          <form className="admin-course-form" onSubmit={onSubmit}>
            <label htmlFor="admin-chapter">Chapter Name</label>
            <input
              id="admin-chapter"
              name="chapter"
              type="text"
              placeholder="Enter chapter name"
              value={form.chapter}
              onChange={onChange}
              required
            />

            <label htmlFor="admin-course">Course</label>
            <select id="admin-course" name="course" value={form.course} onChange={onChange} required>
              <option value="">Select Course</option>
              {COURSE_OPTIONS.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <label htmlFor="admin-subject">Subject</label>
            <select id="admin-subject" name="subject" value={form.subject} onChange={onChange} required>
              <option value="">Select Subject</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <label htmlFor="admin-file">Upload File</label>
            <input id="admin-file" type="file" onChange={onFileChange} required />

            <button type="submit" className="primary-btn admin-course-submit">
              Upload
            </button>
            {status && <p className="admin-course-status">{status}</p>}
          </form>
        </div>

        <div className="admin-course-table">
          <h2 className="admin-course-table-title">Uploaded Files</h2>
          <div className="admin-course-table-grid">
            <div className="admin-course-table-row admin-course-table-header">
              <span>Chapter</span>
              <span>Course</span>
              <span>Subject</span>
              <span>File</span>
              <span>Actions</span>
            </div>
            {uploads.length === 0 && (
              <div className="admin-course-table-row">
                <span>No files uploaded yet.</span>
                <span />
                <span />
                <span />
                <span />
              </div>
            )}
            {uploads.map((upload) => (
              <div className="admin-course-table-row" key={upload.id}>
                <span>{upload.chapter}</span>
                <span>{upload.course}</span>
                <span>{upload.subject}</span>
                <button
                  type="button"
                  className="admin-course-file-link"
                  onClick={() => window.open(`${API_BASE}${upload.file_url}`, "_blank", "noopener,noreferrer")}
                >
                  {upload.file_name}
                </button>
                <span className="admin-course-actions">
                  <button
                    type="button"
                    className="admin-mini-btn admin-delete"
                    onClick={() => onDelete(upload.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="course-footer">
        <div className="course-footer-shell">
          <div className="course-footer-head">
            <h3>Explore top skills and certifications</h3>
            <p>Curated tracks to build competitive exam confidence.</p>
          </div>

          <div className="course-footer-grid">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title} className="course-footer-group">
                <h4>{group.title}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="course-footer-links">
            {FOOTER_LINKS.map((link) => (
              <button key={link} type="button" className="course-footer-link">
                {link}
              </button>
            ))}
          </div>
        </div>
        <div className="site-copyright">
          <p>© 2026 AMIITJEE Career Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default AdminCourse;
