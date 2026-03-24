import { useEffect, useRef, useState } from "react";
import "./course.css";

const SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology"];
const NAV_ITEMS = ["Home", "Courses", "Test Series", "About Us"];

const SUBJECT_IMAGES = {
  Physics: "/assets/physics.png",
  Chemistry: "/assets/chemistry.png",
  Mathematics: "/assets/mathematics.png",
  Biology: "/assets/biology.png",
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

function Class10({ onBackHome, onBackCourses, onSelectSubject, auth, userName, onLogout, onGoProfile, userAvatar, onLoginClick }) {
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

  function handleSubjectSelect(subject) {
    if (!auth) {
      onLoginClick?.();
      return;
    }
    const topic = subject.toLowerCase().replace(/\s+/g, '-');
    onSelectSubject?.(topic);
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
          <h1 className="course-title">Class 10</h1>
          <button type="button" className="course-track-back" onClick={onBackCourses} aria-label="Go back">
            <i className="bi bi-arrow-return-left" aria-hidden="true"></i>
          </button>
        </div>

        {auth && (
          <div className="course-grid">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                type="button"
                className="course-card with-image"
                onClick={() => handleSubjectSelect(subject)}
              >
                <img className="course-card-image" src={SUBJECT_IMAGES[subject]} alt="" aria-hidden="true" />
                <span className="course-card-text">{subject}</span>
              </button>
            ))}
          </div>
        )}

        <div style={{
          background: "linear-gradient(145deg, #0b5a43, #084a37)",
          border: "1px solid rgba(86, 201, 156, 0.22)",
          borderRadius: "16px",
          padding: "36px 40px",
          margin: "40px 0 20px",
          width: "100%",
          boxSizing: "border-box",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.28)",
        }}>
          <h3 style={{
            color: "#6ee7b7",
            fontSize: "1.45rem",
            margin: "0 0 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: "800",
          }}>
            <span aria-hidden="true" style={{ fontSize: "1.6rem" }}>Class 10</span> Excel in Boards and Prepare for the Future
          </h3>
          <h4 style={{
            color: "#ffffff",
            fontSize: "1.2rem",
            fontWeight: "700",
            margin: "0 0 24px",
            lineHeight: "1.4"
          }}>
            Class 10 is one of the most important academic years, where students prepare for board exams while also laying the groundwork for future competitive exams like JEE and NEET.
          </h4>

          <div style={{
            color: "#94a3b8",
            fontSize: "1rem",
            lineHeight: "1.7",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            <p style={{ margin: 0 }}>
              At AMITJEE Career Institute, we provide a balanced and strategic approach that ensures students perform exceptionally well in boards while continuing to strengthen their conceptual base.
            </p>
            <p style={{ margin: 0 }}>
              We focus on complete syllabus coverage, thorough revision, and exam strategies, helping students improve both accuracy and time management. At the same time, we introduce them to higher-level thinking and problem-solving, so they are ready for the next stage of their academic journey.
            </p>

            <div style={{ background: "rgba(5, 41, 31, 0.6)", border: "1px solid rgba(110, 231, 183, 0.12)", borderRadius: "16px", padding: "28px" }}>
              <p style={{ margin: "0 0 20px", color: "#e2ebff", fontWeight: "600", fontSize: "1.1rem" }}>
                What Your Child Will Achieve
              </p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span aria-hidden="true" style={{ fontSize: "1.4rem", color: "#6ee7b7" }}>1</span>
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Complete Syllabus Mastery</strong> Cover all subjects thoroughly with strong concept clarity.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span aria-hidden="true" style={{ fontSize: "1.4rem", color: "#6ee7b7" }}>2</span>
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Board Exam Preparation</strong> Practice important questions, sample papers, and exam patterns.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span aria-hidden="true" style={{ fontSize: "1.4rem", color: "#6ee7b7" }}>3</span>
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Time Management and Exam Strategy</strong> Learn how to attempt exams efficiently and score maximum marks.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span aria-hidden="true" style={{ fontSize: "1.4rem", color: "#6ee7b7" }}>4</span>
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Concept Strengthening for Future Exams</strong> Build a strong base for Class 11 JEE and NEET preparation.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span aria-hidden="true" style={{ fontSize: "1.4rem", color: "#6ee7b7" }}>5</span>
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Regular Tests and Performance Tracking</strong> Continuously improve with detailed analysis and feedback.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span aria-hidden="true" style={{ fontSize: "1.4rem", color: "#6ee7b7" }}>6</span>
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Confidence and Exam Readiness</strong> Face exams with confidence and a clear strategy.</span>
                </li>
              </ul>
            </div>

            <div style={{ background: "rgba(5, 41, 31, 0.6)", border: "1px solid rgba(110, 231, 183, 0.12)", borderRadius: "16px", padding: "28px" }}>
              <p style={{ margin: "0 0 20px", color: "#e2ebff", fontWeight: "600", fontSize: "1.1rem" }}>
                Our Teaching Approach
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px", color: "#94a3b8" }}>
                <li>Structured syllabus completion with revision plans</li>
                <li>Board-focused plus concept-based preparation</li>
                <li>Mock tests and previous year paper practice</li>
                <li>Personal attention and doubt-solving</li>
              </ul>
            </div>

            <div style={{
              background: "rgba(110, 231, 183, 0.08)",
              padding: "24px 32px",
              borderRadius: "14px",
              marginTop: "16px",
              borderLeft: "4px solid #6ee7b7",
              boxShadow: "0 8px 24px rgba(10, 28, 42, 0.22)",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <h5 style={{ color: "#6ee7b7", fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: "800" }}>
                Score High. Aim Higher.
              </h5>
              <p style={{ margin: "4px 0 0", fontWeight: "800", color: "#ffffff", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span aria-hidden="true">{">"}</span> Join Class 10 Foundation Program and achieve academic excellence.
              </p>
            </div>
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

export default Class10;
