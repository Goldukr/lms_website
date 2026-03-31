import { useEffect, useMemo, useRef, useState } from "react";
import "./course.css";
import { API_BASE, apiUrl } from "./api";

const NAV_ITEMS = ["Home", "Teacher", "Test Series", "About Us"];
const COURSE_OPTIONS = ["11 NEET", "11 JEE-Advance", "12 NEET", "12 JEE-Advance", "NEET Dropper", "JEE Dropper", "Class 7", "Class 8", "Class 9", "Class 10"];
const SUBJECT_OPTIONS = ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Social Science"];
const FOUNDATION_SUBJECT_OPTIONS = ["Physics", "Chemistry", "Mathematics", "Biology"];

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

const FOOTER_LINKS = ["About", "Discover AMIITJEE", "For Admin", "Legal & Accessibility"];
const COURSE_SUBJECT_MAP = {
  "11 NEET": ["Physics", "Chemistry", "Biology"],
  "12 NEET": ["Physics", "Chemistry", "Biology"],
  "NEET Dropper": ["Physics", "Chemistry", "Biology"],
  "11 JEE-Advance": ["Physics", "Chemistry", "Mathematics"],
  "12 JEE-Advance": ["Physics", "Chemistry", "Mathematics"],
  "JEE Dropper": ["Physics", "Chemistry", "Mathematics"],
  "Class 7": FOUNDATION_SUBJECT_OPTIONS,
  "Class 8": FOUNDATION_SUBJECT_OPTIONS,
  "Class 9": FOUNDATION_SUBJECT_OPTIONS,
  "Class 10": FOUNDATION_SUBJECT_OPTIONS,
};

function TeacherCourse({ onBackHome, onBackCourses, onLogout, userName, token, onGoTeacher, faculty = "" }) {
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
    const params = normalizedFaculty ? `?subject=${encodeURIComponent(normalizedFaculty)}` : "";
    fetch(`${API_BASE}/api/notes${params}`)
      .then((response) => response.json())
      .then((data) => setUploads(Array.isArray(data) ? data : []))
      .catch(() => setUploads([]));
  }

  useEffect(() => {
    loadUploads();
  }, [normalizedFaculty]);

  const normalizedFaculty = String(faculty || "").trim();

  const teacherCourseOptions = useMemo(() => {
    if (!normalizedFaculty) return COURSE_OPTIONS;
    return COURSE_OPTIONS.filter((course) => (COURSE_SUBJECT_MAP[course] || SUBJECT_OPTIONS).includes(normalizedFaculty));
  }, [normalizedFaculty]);

  const subjectOptions = useMemo(() => {
    if (!form.course) {
      return normalizedFaculty ? [normalizedFaculty] : SUBJECT_OPTIONS;
    }
    const availableSubjects = COURSE_SUBJECT_MAP[form.course] || SUBJECT_OPTIONS;
    if (!normalizedFaculty) return availableSubjects;
    return availableSubjects.includes(normalizedFaculty) ? [normalizedFaculty] : [];
  }, [form.course, normalizedFaculty]);

  useEffect(() => {
    setForm((prev) => {
      const nextCourse = teacherCourseOptions.includes(prev.course) ? prev.course : "";
      const nextSubjects = nextCourse ? (COURSE_SUBJECT_MAP[nextCourse] || SUBJECT_OPTIONS) : [];
      const nextSubject = normalizedFaculty && nextSubjects.includes(normalizedFaculty)
        ? normalizedFaculty
        : nextSubjects.includes(prev.subject)
          ? prev.subject
          : "";

      if (nextCourse === prev.course && nextSubject === prev.subject) {
        return prev;
      }

      return {
        ...prev,
        course: nextCourse,
        subject: nextSubject,
      };
    });
  }, [normalizedFaculty, teacherCourseOptions]);

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "course" ? { subject: normalizedFaculty || "" } : null),
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
      setStatus("Missing teacher token.");
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
        setForm({ chapter: "", course: "", subject: normalizedFaculty || "", file: null });
        setStatus("Upload successful.");
        loadUploads();
      })
      .catch(() => setStatus("Upload failed."));
  }

  function onDelete(id) {
    if (!token) {
      setStatus("Missing teacher token.");
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

  function onDeleteAll() {
    if (!token) {
      setStatus("Missing teacher token.");
      return;
    }
    fetch(`${API_BASE}/api/admin/notes`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) return response.json().then((data) => Promise.reject(data));
        setStatus("");
        loadUploads();
      })
      .catch(() => setStatus("Delete all failed."));
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
              onClick={item === "Teacher" ? onBackCourses : onBackHome}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="course-actions">
          <div className="course-user" ref={menuRef}>
            <button type="button" className="course-user-btn" onClick={() => setMenuOpen((prev) => !prev)}>
              {userName || "Teacher"}
            </button>
            {menuOpen && (
              <div className="course-user-menu">
                <button type="button" onClick={onBackHome}>
                  Home
                </button>
                <button type="button" onClick={onGoTeacher}>
                  Teacher
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
        <h1 className="course-title">Teacher Course Upload</h1>
        <div className="admin-course-card">
          <p className="admin-course-subtitle">Upload notes and study material for students.</p>
          <form className="admin-course-form" onSubmit={onSubmit}>
            <label htmlFor="teacher-chapter">Chapter Name</label>
            <input
              id="teacher-chapter"
              name="chapter"
              type="text"
              placeholder="Enter chapter name"
              value={form.chapter}
              onChange={onChange}
              required
            />

            <label htmlFor="teacher-course">Course</label>
            <select id="teacher-course" name="course" value={form.course} onChange={onChange} required>
              <option value="">Select Course</option>
              {teacherCourseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <label htmlFor="teacher-subject">Subject</label>
            <select
              id="teacher-subject"
              name="subject"
              value={form.subject}
              onChange={onChange}
              disabled={Boolean(normalizedFaculty)}
              required
            >
              <option value="">{normalizedFaculty ? "Assigned Subject" : "Select Subject"}</option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            {normalizedFaculty && (
              <p className="admin-course-status">You can upload only {normalizedFaculty} notes.</p>
            )}

            <label htmlFor="teacher-file">Upload File</label>
            <input id="teacher-file" type="file" onChange={onFileChange} required />

            <button type="submit" className="primary-btn admin-course-submit">
              Upload
            </button>
            {status && <p className="admin-course-status">{status}</p>}
          </form>
        </div>

        <div className="admin-course-table">
          <div className="admin-card-head">
            <h2 className="admin-course-table-title">Uploaded Files</h2>
            {uploads.length > 0 && (
              <button
                type="button"
                className="admin-mini-btn admin-delete admin-approve-all-btn"
                onClick={onDeleteAll}
              >
                Delete All {normalizedFaculty || ""}
              </button>
            )}
          </div>
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
                  onClick={() => window.open(apiUrl(upload.file_url), "_blank", "noopener,noreferrer")}
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

      <section className="home-about-us">
        <div className="home-about-shell">
          <h3 style={{ color: "#1e40af", fontSize: "1.6rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "12px", fontWeight: "800" }}>
            <span role="img" aria-label="Rocket" style={{ fontSize: "1.8rem" }}>🚀</span> Discover AMITJEE
          </h3>
          <h4 style={{ color: "#0f172a", fontSize: "1.3rem", fontWeight: "700", margin: "0 0 24px", lineHeight: "1.4" }}>
            Step into a World of Smart Learning and Real Results
          </h4>
          <p style={{ margin: "0 0 16px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            At AMITJEE Career Institute, we believe that success is not just about hard work. It is about learning smart, staying consistent, and following the right strategy. Our goal is to create an environment where students are guided, motivated, and equipped with everything they need to excel.
          </p>
          <p style={{ margin: "0 0 16px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            We combine deep concept clarity, strategic preparation, and continuous mentorship to ensure that every student not only understands subjects thoroughly but also knows how to apply them effectively in exams like JEE and NEET.
          </p>
          <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            Our approach focuses on building a strong academic foundation, sharpening analytical thinking, and developing the confidence to solve even the most challenging problems. With structured study plans, regular assessments, and personalized guidance, students are always on the right path toward improvement.
          </p>
        </div>
      </section>

      <section className="home-about-us">
        <div className="home-about-shell">
          <h3 style={{ color: "#1e40af", fontSize: "1.6rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "12px", fontWeight: "800" }}>
            <span role="img" aria-label="Legal" style={{ fontSize: "1.8rem" }}>⚖️</span> Legal & Accessibility
          </h3>
          <h4 style={{ color: "#0f172a", fontSize: "1.3rem", fontWeight: "700", margin: "0 0 24px", lineHeight: "1.4" }}>
            Committed to Transparency, Privacy & Inclusive Access
          </h4>
          <p style={{ margin: "0 0 24px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            At AMITJEE Career Institute, we value trust, transparency, and accessibility. We are committed to protecting user information, maintaining ethical standards, and ensuring that our platform is accessible to all students.
          </p>
          <div className="home-about-grid">
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Privacy">🔒</span> Privacy & Data Protection
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                We respect your privacy and ensure that all personal information is handled securely. Any data shared with us is used only to improve your learning experience and is never misused or shared without consent.
              </p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Terms">📜</span> Terms & Conditions
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                By using our website and services, users agree to follow our guidelines and policies. These terms are designed to ensure a safe, fair, and productive environment for all students.
              </p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Accessibility">♿</span> Accessibility Commitment
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                We strive to make our website accessible and user-friendly for everyone, including individuals with different abilities. Our goal is to provide an inclusive learning experience without barriers.
              </p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Policy">⚖️</span> Fair Use & Content Policy
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                All study materials, content, and resources provided by AMITJEE are for educational purposes only. Unauthorized distribution or misuse of content is strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      </section>

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

export default TeacherCourse;
