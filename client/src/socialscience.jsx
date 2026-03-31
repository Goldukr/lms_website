import { useEffect, useState } from "react";
import "./course.css";
import { API_BASE } from "./api";

const NAV_ITEMS = ["Home", "Courses", "Test Series", "About Us"];

function SocialScience({ onBackHome, onBackCourses, courseLabel = "Class 7", courseQuery = "Class 7" , auth, userName, userAvatar, onLogout, onGoProfile, onLoginClick}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/notes?course=${encodeURIComponent(courseQuery)}&subject=${encodeURIComponent("Social Science")}`)
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
              onClick={item === "Courses" ? (typeof handleCoursesClick !== 'undefined' ? handleCoursesClick : (typeof onBackCourses !== 'undefined' ? onBackCourses : onBackHome)) : onBackHome}
            >
              {item}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="course-nav-toggle"
          onClick={() => setNavOpen((prev) => !prev)}
          aria-expanded={typeof navOpen !== 'undefined' ? navOpen : false}
          aria-label="Toggle menu"
          ref={typeof toggleRef !== 'undefined' ? toggleRef : null}
        >
          <i className="bi bi-justify" aria-hidden="true"></i>
        </button>

        <div className="course-actions">
          {typeof auth !== 'undefined' && auth ? (
            <div className="course-user">
              <button
                type="button"
                className="course-user-btn"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {typeof userAvatar !== 'undefined' && userAvatar ? (
                  <img className="course-user-avatar" src={userAvatar} alt="" />
                ) : (
                  <span className="course-user-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
                    </svg>
                  </span>
                )}
                {(typeof userName !== 'undefined' && userName) || "Profile"}
              </button>
              {typeof menuOpen !== 'undefined' && menuOpen && (
                <div className="course-user-menu">
                  <button type="button" onClick={typeof onGoProfile !== 'undefined' ? onGoProfile : (() => setMenuOpen(false))}>
                    Profile
                  </button>
                  <button type="button" onClick={typeof onBackHome !== 'undefined' ? onBackHome : (() => setMenuOpen(false))}>
                    Home
                  </button>
                  <button type="button" onClick={typeof handleCoursesClick !== 'undefined' ? handleCoursesClick : (typeof onBackCourses !== 'undefined' ? onBackCourses : (() => setMenuOpen(false)))}>
                    Courses
                  </button>
                  <button type="button" onClick={typeof onLogout !== 'undefined' ? onLogout : (() => setMenuOpen(false))}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="course-user-btn" onClick={typeof onLoginClick !== 'undefined' ? onLoginClick : (() => window.location.href = '/')}>Login</button>
          )}
        </div>
      </header>

      <div className="course-shell">
        <div className="course-track-head">
          <h1 className="course-title">{courseLabel} - Social Science</h1>
          <button type="button" className="course-track-back" onClick={onBackCourses} aria-label="Go back">
            <i className="bi bi-arrow-return-left" aria-hidden="true"></i>
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
        {notes.length === 0 && !error && <p>No notes uploaded yet.</p>}
        {notes.length > 0 && (
          <div className="course-notes">
            <h2 className="course-notes-title">Social Science Notes</h2>
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

export default SocialScience;
