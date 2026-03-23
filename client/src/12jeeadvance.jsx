import { useEffect, useRef, useState } from "react";
import "./course.css";

const SUBJECTS = ["Physics", "Chemistry", "Mathematics"];
const NAV_ITEMS = ["Home", "Courses", "Test Series", "About Us"];

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
function JeeAdvance12({ onBackHome, onBackCourses, onSelectSubject, onOpenPhysics, auth, userName, onLogout, onGoProfile, userAvatar, onLoginClick }) {
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
    if (subject === "Physics") {
      onOpenPhysics?.();
      return;
    }
    if (subject === "Chemistry") {
      onSelectSubject?.("Chemistry");
      return;
    }
    if (subject === "Mathematics") {
      onSelectSubject?.("Mathematics");
    }
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
        </div>
      )}

      <div className="course-shell">
        <div className="course-track-head">
        <h1 className="course-title">12 JEE Advance</h1>
          <button type="button" className="course-track-back" onClick={onBackCourses} aria-label="Go back">
            <i className="bi bi-arrow-return-left" aria-hidden="true"></i>
          </button>
        </div>
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
            <span role="img" aria-label="Green book">📗</span> Class 12 – Turn Preparation into Performance
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
              Class 12 is where your preparation reaches its peak and your efforts begin to shape your final results. At this stage, success depends on how well you can apply concepts, manage time, and perform under exam pressure.
            </p>
            <p style={{ margin: 0 }}>
              At AMIITJEE, we ensure that students move beyond basic understanding to achieve complete mastery and exam readiness. Our program is structured to strengthen concepts, improve accuracy, and boost confidence through continuous practice and evaluation.
            </p>
            <p style={{ margin: 0 }}>
              We focus on smart revision strategies, advanced problem-solving, and real exam simulation, so you are fully prepared to face JEE Advanced with confidence.
            </p>

            <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "28px" }}>
              <p style={{ margin: "0 0 20px", color: "#e2ebff", fontWeight: "600", fontSize: "1.1rem" }}>
                <span role="img" aria-label="Lightbulb">💡</span> What You’ll Achieve
              </p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Trophy" style={{ fontSize: "1.4rem" }}>🏆</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Complete Syllabus Mastery</strong> Cover every topic in depth with a strong focus on important and high-weightage concepts.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Microscope" style={{ fontSize: "1.4rem" }}>🔬</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Advanced Problem-Solving Skills</strong> Practice complex, multi-concept questions that match the JEE Advanced level.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Book" style={{ fontSize: "1.4rem" }}>📖</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Smart Revision Techniques</strong> Learn how to revise efficiently to retain concepts for longer.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Timer" style={{ fontSize: "1.4rem" }}>⏱️</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Full-Length Mock Tests</strong> Experience real exam conditions and improve speed, accuracy, and time management.</span>
                </li>
                <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span role="img" aria-label="Chart Ascending" style={{ fontSize: "1.4rem" }}>📈</span> 
                  <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Performance Analysis</strong> Identify weak areas and work on them with targeted strategies.</span>
                </li>
              </ul>
            </div>

            <div style={{ background: "linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.05) 100%)", padding: "20px", borderRadius: "10px", marginTop: "12px", borderLeft: "4px solid #10b981", boxShadow: "0 8px 24px rgba(6, 78, 59, 0.2)" }}>
               <h5 style={{ color: "#34d399", fontSize: "1.15rem", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                 <span role="img" aria-label="Rocket">🚀</span> Perform When It Matters Most
               </h5>
               <p style={{ margin: "0 0 6px", color: "#e2ebff" }}>This is your final step before the exam—make it count.</p>
               <p style={{ margin: 0, fontWeight: "700", color: "#ffffff" }}><span role="img" aria-label="Point">👉</span> Join now and turn your preparation into top results.</p>
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

export default JeeAdvance12;

