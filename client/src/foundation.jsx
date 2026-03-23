import { useEffect, useRef, useState } from "react";
import "./course.css";

const SUBJECTS = [
  { key: "class-7", title: "Class 7" },
  { key: "class-8", title: "Class 8" },
  { key: "class-9", title: "Class 9" },
  { key: "class-10", title: "Class 10" },
];

const NAV_ITEMS = ["Home", "Courses", "Test Series", "About Us"];

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

function Foundation({ onBackHome, onBackCourses, onSelectSubject, auth, userName, onLogout, onGoProfile, userAvatar, onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!navOpen) return;
      const dropdown = navRef.current;
      const toggle = toggleRef.current;
      if (dropdown && dropdown.contains(event.target)) return;
      if (toggle && toggle.contains(event.target)) return;
      setNavOpen(false);
    }

    if (navOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [navOpen]);

  function handleSubjectSelect(subjectKey) {
    if (!auth) {
      onLoginClick?.();
      return;
    }
    onSelectSubject?.(subjectKey);
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
      {navOpen && (
        <div className="course-nav-dropdown" ref={navRef}>
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
          {auth && (
            <>
              <button type="button" className="course-nav-item" onClick={onGoProfile} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "4px" }}>
                My Profile
              </button>
              <button type="button" className="course-nav-item" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}

      <div className="course-shell">
        <div className="course-track-head">
          <h1 className="course-title">Foundation Class</h1>
          <button type="button" className="course-track-back" onClick={onBackCourses} aria-label="Go back">
            <i className="bi bi-arrow-return-left" aria-hidden="true"></i>
          </button>
        </div>
        <div className="course-grid">
          {SUBJECTS.map((item) => {
            const isStudent = auth?.role === "student";
            const userCourse = String(auth?.course || "").toLowerCase().replace(/\s+/g, " ").trim();
            let allowed = true;
            
            if (isStudent) {
              const expectedCourse = item.key.replace("-", " ");
              allowed = userCourse === expectedCourse;
            }

            return (
              <button
                key={item.key}
                type="button"
                className={`course-card course-class-card ${!allowed ? "course-card-disabled" : ""}`}
                onClick={allowed ? () => handleSubjectSelect(item.key) : undefined}
                disabled={!allowed}
              >
                <span className="course-card-text" style={{ textTransform: "capitalize" }}>{item.title}</span>
              </button>
            );
          })}
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

export default Foundation;
