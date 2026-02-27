import { useEffect, useRef, useState } from "react";
import "./course.css";

const SUBJECTS = ["Physics", "Chemistry", "Mathematics"];
const NAV_ITEMS = ["Courses", "Test Series", "Results", "About Us"];

const SUBJECT_IMAGES = {
  Physics: "/assets/physics.png",
  Chemistry: "/assets/chemistry.png",
  Mathematics: "/assets/mathematics.png",
};

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

function JeeAdvance11({ onBackHome, onBackCourses, onSelectSubject, userName, onLogout, onGoProfile, userAvatar }) {
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
          <div className="course-user" ref={menuRef}>
            <button type="button" className="course-user-btn" onClick={() => setMenuOpen((prev) => !prev)}>
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="course-user-avatar" />
              ) : (
                <span className="course-user-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm0 10.5a6.5 6.5 0 0 1-5.385-2.857C3.67 10.566 5.522 9.5 8 9.5c2.478 0 4.33 1.066 5.385 2.643A6.5 6.5 0 0 1 8 15Z" />
                  </svg>
                </span>
              )}
              {userName || "Student"}
            </button>
            {menuOpen && (
              <div className="course-user-menu">
                <button type="button" onClick={onBackHome}>
                  Home
                </button>
                <button type="button" onClick={onGoProfile}>
                  Profile
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
        <h1 className="course-title">11 JEE Advance</h1>
        <div className="course-grid">
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              type="button"
              className="course-card with-image"
              onClick={() => onSelectSubject?.(subject)}
            >
              <img className="course-card-image" src={SUBJECT_IMAGES[subject]} alt="" aria-hidden="true" />
              <span className="course-card-text">{subject}</span>
            </button>
          ))}
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

export default JeeAdvance11;
