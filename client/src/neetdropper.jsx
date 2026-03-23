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

function NeetDropper({ onBackHome, onBackCourses, onSelectSubject, onOpenPhysics, onGoNeet11, onGoNeet12, auth, userName, onLogout, onGoProfile, userAvatar, onLoginClick }) {
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
            <h1 className="course-title">NEET Dropper</h1>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', marginBottom: '8px' }}>
              <button type="button" className="course-user-btn" onClick={onGoNeet11} style={{ background: '#473d76', padding: '6px 18px', fontSize: '0.85rem' }}>Class 11</button>
              <button type="button" className="course-user-btn" onClick={onGoNeet12} style={{ background: '#473d76', padding: '6px 18px', fontSize: '0.85rem' }}>Class 12</button>
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
          boxShadow: "0 10px 25px rgba(6, 78, 59, 0.3)",
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
            <span role="img" aria-label="Fire">🔥</span> Dropper Batch – Your Focused Comeback Journey
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
              Didn’t achieve your desired score? Don’t worry—this is your opportunity to come back stronger, smarter, and more focused. Our Dropper Batch is specially designed for students who are determined to improve their rank and secure a medical seat.
            </p>
            <p style={{ margin: 0 }}>
              At AMITJEE Career Institute, we understand that droppers need a different strategy—one that focuses on precision, revision, and continuous improvement. That’s why our program is highly structured to help you make the most of your time.
            </p>
            <p style={{ margin: 0 }}>
              We begin by analyzing your previous performance, identifying weak areas, and rebuilding your preparation with a clear, targeted study plan. With consistent practice and expert mentorship, students develop the discipline and confidence needed to succeed.
            </p>

            <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "28px" }}>
              <p style={{ margin: "0 0 20px", color: "#e2ebff", fontWeight: "600", fontSize: "1.1rem" }}>
                <span role="img" aria-label="Lightbulb">💡</span> What You’ll Achieve
              </p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Check" style={{ fontSize: "1.4rem" }}>✔</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Intensive & Focused Preparation Plan</strong> Study smart with a strategy designed for maximum results in limited time.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Check" style={{ fontSize: "1.4rem" }}>✔</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Complete NCERT Revision & Mastery</strong> Strengthen core concepts, especially in Biology, for high accuracy.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Check" style={{ fontSize: "1.4rem" }}>✔</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Daily Practice MCQs (DPPs)</strong> Maintain consistency with regular problem-solving and revision.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Check" style={{ fontSize: "1.4rem" }}>✔</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Concept Strengthening + Weak Area Improvement</strong> Work specifically on topics that need improvement.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Check" style={{ fontSize: "1.4rem" }}>✔</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Full Test Series with Detailed Analysis</strong> Simulate real NEET exams and track your performance regularly.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Check" style={{ fontSize: "1.4rem" }}>✔</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Personal Mentorship & Motivation</strong> Stay focused and confident with continuous expert guidance.</span>
                </li>
              </ul>
            </div>

            <div style={{
              background: "linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.05) 100%)",
              padding: "24px 32px",
              borderRadius: "14px",
              marginTop: "16px",
              borderLeft: "4px solid #10b981",
              boxShadow: "0 8px 24px rgba(6, 78, 59, 0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
               <h5 style={{ color: "#34d399", fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: "800" }}>
                 <span role="img" aria-label="Trophy">🏆</span> Turn Your Setback into a Strong Comeback
               </h5>
               <p style={{ margin: "0 0 4px", color: "#e2ebff", fontSize: "1.1rem" }}>One focused year can change your future.</p>
               <p style={{ margin: "4px 0 0", fontWeight: "800", color: "#ffffff", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}><span role="img" aria-label="Point">👉</span> Join AMITJEE and make your NEET dream a reality.</p>
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

export default NeetDropper;
