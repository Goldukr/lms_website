import { useEffect, useRef, useState } from "react";
import "./course.css";

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

function JeeDropper({ onBackHome, onBackCourses, onGoJee11, onGoJee12, auth, userName, onLogout, onGoProfile, userAvatar, onLoginClick }) {
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
        </div>
      )}

      <div className="course-shell">
        <div className="course-track-head" style={{ alignItems: 'flex-start' }}>
          <div>
            <h1 className="course-title">JEE-Advance Dropper</h1>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', marginBottom: '8px' }}>
              <button type="button" className="course-user-btn" onClick={onGoJee11} style={{ background: '#473d76', padding: '6px 18px', fontSize: '0.85rem' }}>Class 11</button>
              <button type="button" className="course-user-btn" onClick={onGoJee12} style={{ background: '#473d76', padding: '6px 18px', fontSize: '0.85rem' }}>Class 12</button>
            </div>
          </div>
          <button type="button" className="course-track-back" onClick={onBackCourses} aria-label="Go back">
            <i className="bi bi-arrow-return-left" aria-hidden="true"></i>
          </button>
        </div>

        <div style={{
          background: "linear-gradient(145deg, #064e3b, #022c22)",
          border: "1px solid rgba(52, 211, 153, 0.2)",
          borderRadius: "16px",
          padding: "36px 40px",
          margin: "40px 0 20px",
          width: "100%",
          boxSizing: "border-box",
          boxShadow: "0 12px 30px rgba(6, 78, 59, 0.3)",
        }}>
          <h3 style={{
            color: "#34d399",
            fontSize: "1.45rem",
            margin: "0 0 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: "800",
          }}>
            <span role="img" aria-label="Target" style={{ fontSize: "1.6rem" }}>🎯</span> Choose Your Path
          </h3>
          <h4 style={{
            color: "#ffffff",
            fontSize: "1.2rem",
            fontWeight: "700",
            margin: "0 0 24px",
            lineHeight: "1.4"
          }}>
            <span role="img" aria-label="Fire">🔥</span> Dropper Batch – Your Comeback Year
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
              Didn’t get your desired rank? This is not the end—it’s your second chance to rise stronger. Our Dropper Batch is specially designed for students who are determined to improve, compete, and succeed at the highest level.
            </p>
            <p style={{ margin: 0 }}>
              At AMIITJEE, we understand that droppers need a different approach—one that focuses on precision, speed, and continuous improvement. That’s why our program is intensive, structured, and fully focused on maximizing your performance in limited time.
            </p>
            <p style={{ margin: 0 }}>
              We help you analyze past mistakes, rebuild concepts, and develop a winning strategy that ensures measurable progress.
            </p>

            <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "28px" }}>
              <p style={{ margin: "0 0 20px", color: "#e2ebff", fontWeight: "600", fontSize: "1.1rem" }}>
                <span role="img" aria-label="Lightbulb">💡</span> What You’ll Achieve
              </p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Target" style={{ fontSize: "1.4rem" }}>🎯</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Focused & Intensive Preparation</strong> Study only what matters most with a highly optimized strategy.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Hammer" style={{ fontSize: "1.4rem" }}>🔨</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Concept Strengthening+Advanced</strong> Rebuild weak areas and master high-level problem-solving.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Notebook" style={{ fontSize: "1.4rem" }}>📓</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Daily Practice Problems (DPPs)</strong> Stay consistent with daily assignments designed for improvement.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Handshake" style={{ fontSize: "1.4rem" }}>🤝</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Personal Mentorship & Guidance</strong> Get expert support to stay motivated and on track.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Paper" style={{ fontSize: "1.4rem" }}>📄</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Full Test Series with Details</strong> Simulate real exams and continuously improve your rank.</span>
                </li>
              </ul>
            </div>

            <div style={{ background: "linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.05) 100%)", padding: "20px", borderRadius: "10px", marginTop: "12px", borderLeft: "4px solid #10b981", boxShadow: "0 8px 24px rgba(6, 78, 59, 0.2)" }}>
               <h5 style={{ color: "#34d399", fontSize: "1.15rem", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                 <span role="img" aria-label="Trophy">🏆</span> Turn Your Setback into Success
               </h5>
               <p style={{ margin: "0 0 6px", color: "#e2ebff" }}>One focused year can change your entire future.</p>
               <p style={{ margin: 0, fontWeight: "700", color: "#ffffff" }}><span role="img" aria-label="Point">👉</span> Join now and make your comeback count.</p>
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

export default JeeDropper;
