import { useEffect, useState } from "react";
import "./course.css";

const NAV_ITEMS = ["Courses", "Test Series", "Results", "About Us"];

const API_BASE = import.meta.env.VITE_API_URL || "";

function Physics({ onBackHome, onBackCourses, courseLabel = "11 NEET", courseQuery = "11 NEET" }) {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/notes?course=${encodeURIComponent(courseQuery)}&subject=Physics`)
      .then((response) => response.json())
      .then((data) => setNotes(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load notes."));
  }, [courseQuery]);
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
              onClick={item === "Courses" ? onBackCourses : onBackHome}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="course-actions">
          <button type="button" className="course-back" onClick={onBackCourses}>
            Courses
          </button>
        </div>
      </header>

      <div className="course-shell">
        <h1 className="course-title">{courseLabel} - Physics</h1>
        {error && <p className="form-error">{error}</p>}
        {notes.length === 0 && !error && <p>No notes uploaded yet.</p>}
        {notes.length > 0 && (
          <div className="course-notes">
            <h2 className="course-notes-title">Physics Notes</h2>
            <div className="course-table">
              <div className="course-table-row course-table-header">
                <span>Chapter</span>
                <span>File</span>
              </div>
              {notes.map((note) => (
                <div key={note.id} className="course-table-row course-table-row-notes">
                  <a className="course-note-link" href={`${API_BASE}${note.file_url}`} download>
                    <span>{note.chapter}</span>
                    <span>{note.file_name}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className="course-footer">
        <div className="site-copyright">
          <p>© 2026 AMIITJEE Career Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Physics;
