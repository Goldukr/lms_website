import { useEffect, useRef, useState } from "react";
import "./course.css";

const COURSES = [
  { key: "neet-ug", title: "NEET-UG", image: "/assets/doctor-bw.png" },
  { key: "jee-advanced", title: "JEE Advanced", image: "/assets/engineer-bw.png" },
  { key: "foundation", title: "Foundation", image: "/assets/foundations.png" },
];
const NAV_ITEMS = ["Home", "Courses", "Test Series", "About Us"];
const TRACK_CLASSES = [
  { key: "class-11", title: "Class 11" },
  { key: "class-12", title: "Class 12" },
  { key: "dropper", title: "Dropper" },
];

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

function Course({ onBackHome, onBackCourses, onSelectNeet11, onSelectNeet12, onSelectNeetDropper, onSelectJee11, onSelectJee12, onSelectJeeDropper, selectedCourse, onSelectFoundation , auth, userName, userAvatar, onLogout, onGoProfile, onLoginClick}) {
  const [activeTrack, setActiveTrack] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  function getSelectedTrack(value) {
    const normalized = String(value || "").toLowerCase();
    if (normalized.includes("neet")) return "neet-ug";
    if (normalized.includes("jee")) return "jee-advanced";
    if (normalized.includes("dropper")) return "dropper";
    if (normalized.includes("foundation")) return "foundation";
    return "";
  }

  const selectedTrack = getSelectedTrack(selectedCourse);

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

  useEffect(() => {
    if (selectedTrack === "neet-ug" || selectedTrack === "jee-advanced") {
      setActiveTrack(selectedTrack);
      return;
    }

    if (!selectedTrack) {
      setActiveTrack("");
    }
  }, [selectedTrack]);

  function isAllowed(trackKey) {
    // Always allow choosing any course track once opened.
    return true;
  }

  function onTrackSelect(trackKey) {
    if (trackKey === "foundation") {
      onSelectFoundation?.();
      return;
    }
    if (trackKey === "neet-ug" || trackKey === "jee-advanced") {
      setActiveTrack(trackKey);
      return;
    }
  }

  function isTrackClassAllowed(classKey) {
    // Show all class cards as enabled for user flexibility.
    return true;
  }

  function onTrackClassSelect(classKey) {
    if (activeTrack === "neet-ug") {
      if (classKey === "class-11") {
        onSelectNeet11?.();
        return;
      }
      if (classKey === "class-12") {
        onSelectNeet12?.();
        return;
      }
      if (classKey === "dropper") {
        onSelectNeetDropper?.();
        return;
      }
    }

    if (activeTrack === "jee-advanced") {
      if (classKey === "class-11") {
        onSelectJee11?.();
        return;
      }
      if (classKey === "class-12") {
        onSelectJee12?.();
        return;
      }
      if (classKey === "dropper") {
        onSelectJeeDropper?.();
        return;
      }
    }

    return;
  }

  function handleCoursesClick() {
    // Keep Courses nav consistent: always show the main course track list.
    setActiveTrack("");
    onBackCourses?.();
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
              onClick={() => {
                if (item === "Home") {
                  onBackHome?.();
                } else if (item === "Courses") {
                  if (typeof handleCoursesClick !== 'undefined') handleCoursesClick();
                  else if (typeof onBackCourses !== 'undefined') onBackCourses();
                  else onBackHome?.();
                } else if (item === "About Us") {
                  document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
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
              onClick={() => {
                if (item === "Home") {
                  if (typeof onBackHome !== 'undefined') onBackHome();
                } else if (item === "Courses") {
                  if (typeof handleCoursesClick !== 'undefined') handleCoursesClick();
                  else if (typeof onBackCourses !== 'undefined') onBackCourses();
                } else if (item === "About Us") {
                  document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
                setNavOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div className="course-shell">
        <h1 className="course-title">
          {activeTrack === "neet-ug" ? "NEET-UG Class" : activeTrack === "jee-advanced" ? "JEE Advanced Class" : "Explore Courses"}
        </h1>
        {activeTrack === "neet-ug" || activeTrack === "jee-advanced" ? (
          <>
            <div className="course-track-head">
              <h2 />
              <button type="button" className="course-track-back" onClick={() => setActiveTrack("")} aria-label="Go back">
                <i className="bi bi-arrow-return-left" aria-hidden="true"></i>
              </button>
            </div>
            <div className="course-grid">
              {TRACK_CLASSES.map((item) => {
                const allowed = isTrackClassAllowed(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`course-card course-class-card ${!allowed ? "course-card-disabled" : ""}`}
                    onClick={allowed ? () => onTrackClassSelect(item.key) : undefined}
                    disabled={!allowed}
                  >
                    <span className="course-card-text">{item.title}</span>
                  </button>
                );
              })}
            </div>

            {activeTrack === "neet-ug" && (
              <div style={{
                background: "linear-gradient(145deg, #064e3b, #022c22)",
                border: "1px solid rgba(52, 211, 153, 0.2)",
                borderRadius: "16px",
                padding: "36px 40px",
                margin: "40px 0 0",
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
                  <span role="img" aria-label="Stethoscope" style={{ fontSize: "1.6rem" }}>🩺</span> NEET-UG Preparation
                </h3>
                <h4 style={{
                  color: "#ffffff",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  margin: "0 0 24px",
                  lineHeight: "1.4"
                }}>
                  Crack NEET with Precision. Not Pressure.
                </h4>

                <div style={{
                  color: "#94a3b8",
                  fontSize: "1rem",
                  lineHeight: "1.7",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px"
                }}>
                  <p style={{ margin: 0, fontSize: "1.1rem", color: "#ccdcf5" }}>
                    At AMIITJEE Career Institute, we believe that cracking NEET is not about studying more—it's about studying the right way. Success in NEET comes from a combination of clarity, consistency, and accuracy, and that's exactly what we train our students for.
                  </p>

                  <p style={{ margin: 0 }}>
                    We go beyond traditional rote learning and focus on building a deep conceptual understanding, especially through NCERT-focused preparation, which forms the backbone of the NEET exam. Our teaching methodology ensures that students don't just memorize facts—they understand, retain, and apply concepts effectively in real exam scenarios.
                  </p>

                  <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "28px" }}>
                    <p style={{ margin: "0 0 20px", color: "#e2ebff", fontWeight: "600", fontSize: "1.1rem" }}>
                      Our programs are carefully structured to help students master Biology, Physics, and Chemistry with a balanced approach:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="DNA" style={{ fontSize: "1.4rem" }}>🧬</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Biology Mastery (NCERT-Focused)</strong> Learn every line of NCERT with clarity, diagrams, and conceptual connections to maximize your score.</span>
                      </li>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Atom" style={{ fontSize: "1.4rem" }}>⚛️</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Conceptual Physics</strong> Develop strong problem-solving skills with clear concepts and step-by-step application techniques.</span>
                      </li>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Test Tube" style={{ fontSize: "1.4rem" }}>🧪</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Smart Chemistry Preparation</strong> Master Physical, Organic, and Inorganic Chemistry with a mix of theory, shortcuts, and practice.</span>
                      </li>
                    </ul>
                  </div>

                  <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "28px" }}>
                    <p style={{ margin: "0 0 20px", color: "#e2ebff", fontWeight: "600", fontSize: "1.1rem" }}>
                      We also emphasize exam-oriented preparation, where students regularly practice high-quality MCQs, previous year questions, and full-length mock tests that simulate real NEET conditions. This helps improve:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Target" style={{ fontSize: "1.4rem" }}>🎯</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Accuracy</strong> Minimize negative marking.</span>
                      </li>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Stopwatch" style={{ fontSize: "1.4rem" }}>⏱️</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Speed</strong> Solve questions efficiently within time.</span>
                      </li>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Brain" style={{ fontSize: "1.4rem" }}>🧠</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Retention</strong> Remember concepts for longer duration.</span>
                      </li>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Chart" style={{ fontSize: "1.4rem" }}>📊</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Performance Analysis</strong> Identify weak areas and improve continuously.</span>
                      </li>
                    </ul>
                  </div>

                  <p style={{ margin: 0 }}>
                    At AMIITJEE, students are guided with a disciplined study plan, expert mentorship, and continuous motivation, ensuring they stay focused and confident throughout their journey.
                  </p>

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
                      <span role="img" aria-label="Trophy" style={{ fontSize: "1.4rem" }}>🏆</span> Your Dream of Becoming a Doctor Starts Here
                    </h5>
                    <p style={{ margin: 0, color: "#e2ebff", fontSize: "1.1rem" }}>With the right guidance and strategy, success in NEET is within your reach.</p>
                    <p style={{ margin: "4px 0 0", fontWeight: "800", color: "#ffffff", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span role="img" aria-label="Point">👉</span> Join AMIITJEE and take the first step towards your medical career.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTrack === "jee-advanced" && (
              <div style={{
                background: "linear-gradient(145deg, #064e3b, #022c22)",
                border: "1px solid rgba(52, 211, 153, 0.2)",
                borderRadius: "16px",
                padding: "36px 40px",
                margin: "40px 0 0",
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
                  <span role="img" aria-label="Rocket" style={{ fontSize: "1.6rem" }}>🚀</span> JEE Advanced Preparation
                </h3>
                <h4 style={{
                  color: "#ffffff",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  margin: "0 0 24px",
                  lineHeight: "1.4"
                }}>
                  Crack JEE Advanced with Confidence. Not Luck.
                </h4>

                <div style={{
                  color: "#94a3b8",
                  fontSize: "1rem",
                  lineHeight: "1.7",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px"
                }}>
                  <p style={{ margin: 0, fontSize: "1.1rem", color: "#ccdcf5" }}>
                    At AMIITJEE Career Institute, success is not a coincidence—it’s a result of the right guidance, smart strategy, and consistent effort. We don’t just teach formulas or shortcuts; we <strong style={{ color: "#fff" }}>train students to think like problem-solvers</strong>, which is the true key to cracking JEE Advanced.
                  </p>

                  <p style={{ margin: 0 }}>
                    Our programs are carefully designed to build a strong conceptual foundation in Physics, Chemistry, and Mathematics, while gradually advancing to complex, multi-concept problems that reflect the actual exam pattern. Every concept is taught from basics to advanced level, ensuring no student feels left behind.
                  </p>

                  <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "28px" }}>
                    <p style={{ margin: "0 0 20px", color: "#e2ebff", fontWeight: "600", fontSize: "1.1rem" }}>
                      Clearing JEE demands discipline, practice, and performing under pressure:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Books" style={{ fontSize: "1.4rem" }}>📚</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Concept Mastery</strong> Learn why concepts work, not just how.</span>
                      </li>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Brain" style={{ fontSize: "1.4rem" }}>🧠</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Analytical Thinking</strong> Develop the mindset for tricky problems.</span>
                      </li>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Memo" style={{ fontSize: "1.4rem" }}>📝</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Exam-Level Practice</strong> Solve questions matching real JEE standards.</span>
                      </li>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Chart" style={{ fontSize: "1.4rem" }}>📊</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Performance Tracking</strong> Identify strengths & improve weak areas.</span>
                      </li>
                      <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span role="img" aria-label="Target" style={{ fontSize: "1.4rem" }}>🎯</span>
                        <span><strong style={{ color: "#fff", display: "block", marginBottom: "4px", fontSize: "1.05rem" }}>Strategic Preparation</strong> Learn time management & smart techniques.</span>
                      </li>
                    </ul>
                  </div>

                  <p style={{ margin: 0 }}>
                    Our expert faculty, structured study material, and regular testing system ensure that students are always on the right path toward achieving top ranks. Whether you are starting your journey or aiming to improve your rank, AMIITJEE provides you with the complete ecosystem to succeed.
                  </p>

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
                      <span role="img" aria-label="Trophy" style={{ fontSize: "1.4rem" }}>🏆</span> Your Dream IIT is Not Far Away
                    </h5>
                    <p style={{ margin: 0, color: "#e2ebff", fontSize: "1.1rem" }}>With the right preparation and guidance, you can turn your ambition into reality.</p>
                    <p style={{ margin: "4px 0 0", fontWeight: "800", color: "#ffffff", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span role="img" aria-label="Point">👉</span> Join AMIITJEE and start your journey towards IIT success today.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="course-grid">
              {COURSES.map((course) => {
                const allowed = isAllowed(course.key);
                return (
                  <button
                    key={course.key}
                    type="button"
                    className={`course-card ${course.image ? "with-image" : ""} ${!allowed ? "course-card-disabled" : ""}`}
                    onClick={allowed ? () => onTrackSelect(course.key) : undefined}
                    disabled={!allowed}
                  >
                    {course.image && <img className={`course-card-image ${course.key === "foundation" ? "foundation-image-size" : ""}`} src={course.image} alt="" aria-hidden="true" />}
                    <span className="course-card-text">{course.title}</span>
                  </button>
                );
              })}
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
                <span role="img" aria-label="Rocket" style={{ fontSize: "1.6rem" }}>🚀</span> Explore Courses
              </h3>
              <h4 style={{
                color: "#ffffff",
                fontSize: "1.2rem",
                fontWeight: "700",
                margin: "0 0 24px",
                lineHeight: "1.4"
              }}>
                Choose the Right Path for Your Dream Career
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
                  At AMITJEE Career Institute, we offer specialized courses designed to help students achieve their goals in Engineering, Medical, and Foundation-level preparation. Each program is carefully structured to provide concept clarity, exam-focused practice, and expert guidance, ensuring students stay ahead in their journey.
                </p>
                <p style={{ margin: 0 }}>
                  Whether you aim to become a doctor, engineer, or build a strong academic base early, we have the perfect course tailored for you.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "12px" }}>
                  <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: "#e2ebff", fontSize: "1.1rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span role="img" aria-label="Stethoscope">🩺</span> NEET-UG
                    </h5>
                    <p style={{ margin: "0 0 16px", fontSize: "0.95rem" }}>
                      Prepare for NEET with a focused, NCERT-based approach that emphasizes accuracy and conceptual understanding. Our program helps you master Biology, Physics, and Chemistry with regular practice and test series.
                    </p>
                    <ul style={{ margin: "0 0 16px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem" }}>
                      <li>NCERT-focused preparation</li>
                      <li>High-quality MCQs & mock tests</li>
                      <li>Strong focus on accuracy & retention</li>
                    </ul>
                    <p style={{ margin: "auto 0 0", fontWeight: "600", color: "#34d399", fontSize: "0.95rem" }}><span role="img" aria-label="Point">👉</span> Start your journey towards becoming a doctor</p>
                  </div>

                  <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: "#e2ebff", fontSize: "1.1rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span role="img" aria-label="Gear">⚙️</span> JEE Advanced
                    </h5>
                    <p style={{ margin: "0 0 16px", fontSize: "0.95rem" }}>
                      Achieve your dream of studying in IITs with our concept-driven and problem-solving approach. We train students to tackle complex questions with confidence and precision.
                    </p>
                    <ul style={{ margin: "0 0 16px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem" }}>
                      <li>Strong conceptual foundation</li>
                      <li>Advanced problem-solving practice</li>
                      <li>Full-length test series & analysis</li>
                    </ul>
                    <p style={{ margin: "auto 0 0", fontWeight: "600", color: "#34d399", fontSize: "0.95rem" }}><span role="img" aria-label="Point">👉</span> Prepare smartly for top engineering colleges</p>
                  </div>

                  <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: "#e2ebff", fontSize: "1.1rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span role="img" aria-label="Plant">🌱</span> Foundation
                    </h5>
                    <p style={{ margin: "0 0 16px", fontSize: "0.95rem" }}>
                      Build a strong academic base from an early stage with our Foundation courses. Ideal for students who want to develop concepts, logical thinking, and competitive mindset from school level.
                    </p>
                    <ul style={{ margin: "0 0 16px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem" }}>
                      <li>Strong basics in Science & Mathematics</li>
                      <li>Olympiad & competitive exam preparation</li>
                      <li>Skill development & early guidance</li>
                    </ul>
                    <p style={{ margin: "auto 0 0", fontWeight: "600", color: "#34d399", fontSize: "0.95rem" }}><span role="img" aria-label="Point">👉</span> Start early. Stay ahead.</p>
                  </div>
                </div>

                <div style={{ background: "rgba(2, 44, 34, 0.6)", border: "1px solid rgba(52, 211, 153, 0.1)", borderRadius: "16px", padding: "28px", marginTop: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)" }}>
                  <p style={{ margin: "0 0 20px", color: "#e2ebff", fontWeight: "600", fontSize: "1.1rem" }}>
                    <span role="img" aria-label="Lightbulb">💡</span> Why Choose AMITJEE?
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span role="img" aria-label="Sparkles" style={{ fontSize: "1.2rem" }}>✨</span> 
                      <span style={{ color: "#fff", fontSize: "1.05rem" }}>Expert faculty & structured learning</span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span role="img" aria-label="Sparkles" style={{ fontSize: "1.2rem" }}>✨</span> 
                      <span style={{ color: "#fff", fontSize: "1.05rem" }}>Regular tests with performance tracking</span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span role="img" aria-label="Sparkles" style={{ fontSize: "1.2rem" }}>✨</span> 
                      <span style={{ color: "#fff", fontSize: "1.05rem" }}>Doubt-solving & mentorship support</span>
                    </li>
                    <li style={{ display: "flex", gap: "12px", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span role="img" aria-label="Sparkles" style={{ fontSize: "1.2rem" }}>✨</span> 
                      <span style={{ color: "#fff", fontSize: "1.05rem" }}>Proven strategies for top results</span>
                    </li>
                  </ul>
                </div>

                <div style={{
                  background: "linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.05) 100%)",
                  padding: "24px 32px",
                  borderRadius: "14px",
                  marginTop: "16px",
                  borderLeft: "4px solid #10b981",
                  boxShadow: "0 8px 32px rgba(6, 78, 59, 0.4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}>
                   <h5 style={{ color: "#34d399", fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: "800" }}>
                     <span role="img" aria-label="Target">🎯</span> Your Success Starts Here
                   </h5>
                   <p style={{ margin: "0 0 4px", color: "#e2ebff", fontSize: "1.1rem" }}>No matter your goal, the right guidance can make all the difference.</p>
                   <p style={{ margin: "4px 0 0", fontWeight: "800", color: "#ffffff", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}><span role="img" aria-label="Point">👉</span> Explore our courses and take the first step towards your dream career.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <section id="about-us" className="course-about-us" style={{
        backgroundColor: "#e2ecf5",
        borderTop: "1px solid rgba(148, 163, 184, 0.2)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
        padding: "60px 40px",
        margin: "60px 0",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 10px 40px rgba(15, 23, 42, 0.08)",
        color: "#334155"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3 style={{ color: "#1e40af", fontSize: "1.6rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "12px", fontWeight: "800" }}>
            <span role="img" aria-label="Teacher" style={{ fontSize: "1.8rem" }}>👨‍🏫</span> About Us
          </h3>
          <h4 style={{ color: "#0f172a", fontSize: "1.3rem", fontWeight: "700", margin: "0 0 24px", lineHeight: "1.4" }}>
            Shaping Futures. Building Success Stories.
          </h4>
          
          <p style={{ margin: "0 0 16px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            At AMITJEE Career Institute, we are committed to transforming students’ dreams into reality by providing quality education, expert guidance, and a result-oriented approach. Our mission is to help aspiring students crack competitive exams like JEE Advanced, NEET-UG, and other academic challenges with confidence and excellence.
          </p>
          <p style={{ margin: "0 0 32px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            We believe that success is not just about hard work—it’s about learning smart, staying consistent, and having the right mentorship. That’s why our teaching methodology focuses on concept clarity, practical understanding, and continuous improvement, ensuring that every student reaches their full potential.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Target">🎯</span> Our Vision
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                To become a leading institute that empowers students with knowledge, skills, and confidence to excel in competitive exams and achieve their career goals.
              </p>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Rocket">🚀</span> Our Mission
              </h5>
              <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "1rem", lineHeight: "1.6", color: "#475569" }}>
                <li>To provide high-quality, concept-based education</li>
                <li>To create a supportive and motivating learning environment</li>
                <li>To help students develop analytical thinking and problem-solving skills</li>
                <li>To guide every student with personal attention and mentorship</li>
              </ul>
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "32px", marginBottom: "32px", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)" }}>
            <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span role="img" aria-label="Lightbulb">💡</span> What Makes Us Different
            </h5>
            <ul style={{ margin: 0, paddingLeft: 0, listStyleType: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span role="img" aria-label="Sparkles" style={{ fontSize: "1.4rem" }}>✨</span> 
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Experienced Faculty</strong> Learn from experts with strong academic backgrounds</span>
              </li>
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span role="img" aria-label="Sparkles" style={{ fontSize: "1.4rem" }}>✨</span> 
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Structured Learning</strong> Well-planned syllabus and study material</span>
              </li>
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span role="img" aria-label="Sparkles" style={{ fontSize: "1.4rem" }}>✨</span> 
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Regular Tests & Analysis</strong> Track performance and improve continuously</span>
              </li>
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span role="img" aria-label="Sparkles" style={{ fontSize: "1.4rem" }}>✨</span> 
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Doubt Support</strong> Quick and effective doubt-solving sessions</span>
              </li>
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span role="img" aria-label="Sparkles" style={{ fontSize: "1.4rem" }}>✨</span> 
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Student-Centric Approach</strong> Focused on individual growth and success</span>
              </li>
            </ul>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
            <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span role="img" aria-label="Trophy">🏆</span> Our Commitment
            </h5>
            <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
              We are not just an institute—we are a partner in your journey. From building strong fundamentals to achieving top ranks, we stand with our students at every step, guiding them towards success.
            </p>
          </div>

          <div style={{
            background: "linear-gradient(90deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%)",
            padding: "24px 32px",
            borderRadius: "14px",
            marginTop: "32px",
            borderLeft: "4px solid #1e40af",
            boxShadow: "0 8px 32px rgba(15, 23, 42, 0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <h5 style={{ color: "#1e40af", fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: "800" }}>
              <span role="img" aria-label="Graduation Cap">🎓</span> Your Dream. Our Responsibility.
            </h5>
            <p style={{ margin: "0 0 4px", color: "#334155", fontSize: "1.1rem" }}>
              At AMITJEE, your success is our priority.
            </p>
            <p style={{ margin: "4px 0 0", fontWeight: "800", color: "#0f172a", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span role="img" aria-label="Point">👉</span> Join us and take the first step towards a brighter future.
            </p>
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

export default Course;






