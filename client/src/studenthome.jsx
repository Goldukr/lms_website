import { useEffect, useRef, useState } from "react";
import "./home.css";
import screenSaverImageOne from "../web design.png";
import screenSaverImageTwo from "../web2.png";
import { apiUrl, parseJsonResponse } from "./api";

const NAV_ITEMS = ["Home", "Courses", "Test Series", "About Us"];
const WHATSAPP_NUMBER = "919783093793";

const SCREENSAVER_IMAGES = [screenSaverImageOne, screenSaverImageTwo];
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

function scrollToAboutSection() {
  document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveQueryToLocal(entry) {
  const existing = JSON.parse(localStorage.getItem("queries") || "[]");
  localStorage.setItem("queries", JSON.stringify([entry, ...existing]));
}

function StudentHome({ onExploreCourses, onBrandClick, onLogout, userName, onGoCourses, onGoProfile, userAvatar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const [queryForm, setQueryForm] = useState({
    name: "",
    email: "",
    mobile: "",
    query: "",
  });
  const [queryStatus, setQueryStatus] = useState("");

  function onQueryChange(event) {
    const { name, value } = event.target;
    if (name === "mobile") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setQueryForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setQueryForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onQuerySubmit(event) {
    event.preventDefault();
    if (queryForm.mobile.length !== 10) {
      setQueryStatus("Mobile number must be exactly 10 digits.");
      setTimeout(() => setQueryStatus(""), 2000);
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/queries"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryForm),
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        setQueryStatus(data?.error || "Failed to submit query.");
        setTimeout(() => setQueryStatus(""), 2500);
        return;
      }

      saveQueryToLocal(data || {
        id: `${Date.now()}`,
        ...queryForm,
        created_at: new Date().toISOString(),
      });
      setQueryForm({ name: "", email: "", mobile: "", query: "" });
      setQueryStatus("Query submitted.");
      setTimeout(() => setQueryStatus(""), 2000);
    } catch (_error) {
      saveQueryToLocal({
        id: `${Date.now()}`,
        ...queryForm,
        created_at: new Date().toISOString(),
      });
      setQueryForm({ name: "", email: "", mobile: "", query: "" });
      setQueryStatus("Query saved locally. Backend sync is unavailable right now.");
      setTimeout(() => setQueryStatus(""), 3000);
    }
  }

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
    <div className="home-page">
      <div className="home-bg home-bg-a" />
      <div className="home-bg home-bg-b" />
      <div className="home-bg home-bg-c" />

      <header className="home-topbar">
        <button type="button" className="home-brand" onClick={onBrandClick}>
          <p className="home-brand-title">AMIITJEE</p>
          <p className="home-brand-subtitle">Career institute</p>
        </button>

        <nav className="home-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className="home-nav-item"
              onClick={() => {
                if (item === "Home") onBrandClick?.();
                else if (item === "Courses") onExploreCourses?.("");
                else if (item === "About Us") document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {item}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="home-nav-toggle"
          onClick={() => setNavOpen((prev) => !prev)}
          aria-expanded={navOpen}
          aria-label="Toggle menu"
          ref={toggleRef}
        >
          <i className="bi bi-justify" aria-hidden="true"></i>
        </button>

        <div className="home-actions">
          <a
            className="home-call home-chat"
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="home-chat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 0 0-8.53 15.2L2 22l4.93-1.3A10 10 0 1 0 12 2Zm0 2a8 8 0 0 1 6.9 12.1l-.3.5-2.7 4.2-4.8-1.3-.5.1a8 8 0 1 1 1.4-15.6Zm-2.1 5.3c-.3-.1-.6 0-.7.3l-.6 1.4c-.1.2-.1.5 0 .7.6 1.6 2.1 3.4 4.1 4.6.2.1.5.1.7 0l1.4-.6c.2-.1.3-.4.3-.7l-.2-1c-.1-.2-.2-.4-.4-.4l-1.1-.3c-.2-.1-.4 0-.6.2l-.4.5c-.7-.4-1.4-1.1-1.8-1.8l.5-.4c.2-.2.3-.4.2-.6l-.3-1.1c0-.2-.2-.3-.4-.4l-1-.2Z" />
              </svg>
            </span>
            Chat Us
          </a>
          <div className="home-user">
            <button type="button" className="home-user-btn" onClick={() => setMenuOpen((prev) => !prev)}>
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="home-user-avatar" />
              ) : (
                <span className="home-user-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 4.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm0 10.5a6.5 6.5 0 0 1-5.385-2.857C3.67 10.566 5.522 9.5 8 9.5c2.478 0 4.33 1.066 5.385 2.643A6.5 6.5 0 0 1 8 15Z" />
                  </svg>
                </span>
              )}
              {userName || "Student"}
            </button>
            {menuOpen && (
              <div className="home-user-menu">
                <button type="button" onClick={onGoProfile || (() => setMenuOpen(false))}>
                  Profile
                </button>
                <button type="button" onClick={onBrandClick}>
                  Home
                </button>
                <button type="button" onClick={onGoCourses || (() => onExploreCourses?.(""))}>
                  Courses
                </button>
                <button type="button" onClick={onLogout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {navOpen && (
        <div className="home-nav-dropdown" ref={navRef}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className="home-nav-item"
              onClick={() => {
                if (item === "Home") onBrandClick?.();
                else if (item === "Courses") onExploreCourses?.("");
                else if (item === "About Us") document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
                setNavOpen(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <section className="home-screensaver" aria-label="Students discussing together">
        {SCREENSAVER_IMAGES.map((image, index) => (
          <img
            key={image}
            className="home-screensaver-image"
            src={image}
            alt=""
            aria-hidden="true"
            style={{ animationDelay: `${index * 6}s` }}
          />
        ))}
        <div className="home-screensaver-cta">
          <button type="button" className="home-screensaver-button" onClick={() => onExploreCourses?.("")}>
            Explore Courses
          </button>
        </div>
      </section>

      <section className="home-quote-section" aria-label="Inspirational Quote">
        <div className="home-quote-container">
          <div className="home-quote-content">
            <blockquote className="home-quote-block">
              <p className="home-quote-text">
                <span className="home-quote-mark home-quote-mark-open" aria-hidden="true">“</span>
                Education is the most powerful weapon which you can use to change the world.
                <span className="home-quote-mark home-quote-mark-close" aria-hidden="true">”</span>
              </p>
              <footer className="home-quote-author">
                - <cite>Dr. A. P. J. Abdul Kalam</cite>
              </footer>
            </blockquote>
          </div>
          <div className="home-quote-image-wrapper">
            <img src="/assets/dr apj abdul kalam.png" alt="Dr. A. P. J. Abdul Kalam" className="home-quote-image" />
          </div>
        </div>
      </section>

      <main className="home-main">
        <section className="home-hero">
          <article className="home-float-card home-float-main">
            <h2>Prep smarter with AMIITJEE Online Test Series</h2>
            <p>Adaptive practice tracks your weak zones and boosts your score path.</p>
          </article>

          <div className="home-left">
            <h1>
              NEET and JEE Self-Study Courses <br />
              & Online Test Series
            </h1>

            <ul className="home-points">
              <li>End-to-end preparation with video lectures and expert mentors.</li>
              <li>Real exam pattern tests with full-length analytics.</li>
              <li>Designed by top faculty for concept and speed mastery.</li>
            </ul>
          </div>

          <article className="home-enquiry-card">
            <h3>Enquiry</h3>
            <form className="home-enquiry-form" onSubmit={onQuerySubmit}>
              <label htmlFor="enquiry-name">Name</label>
              <input
                id="enquiry-name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={queryForm.name}
                onChange={onQueryChange}
                required
              />

              <label htmlFor="enquiry-email">Email</label>
              <input
                id="enquiry-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={queryForm.email}
                onChange={onQueryChange}
                required
              />

              <label htmlFor="enquiry-mobile">Mobile Number</label>
              <input
                id="enquiry-mobile"
                name="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={queryForm.mobile}
                onChange={onQueryChange}
                inputMode="numeric"
                pattern="[0-9]{10}"
                required
              />

              <label htmlFor="enquiry-query">Query</label>
              <textarea
                id="enquiry-query"
                name="query"
                placeholder="Write your query"
                value={queryForm.query}
                onChange={onQueryChange}
                required
              ></textarea>

              {queryStatus && <p className="home-enquiry-status">{queryStatus}</p>}
              <button type="submit" className="home-enquiry-submit">Submit</button>
            </form>
          </article>

          <section className="home-map-card" aria-labelledby="home-map-title">
            <div className="home-map-copy">
              <p className="home-map-eyebrow">Visit Us</p>
              <h3 id="home-map-title">Find AMIITJEE on Google Maps</h3>
              <p>Use the map below to view the institute location and open directions easily.</p>
            </div>
            <div className="home-map-frame">
              <iframe
                title="AMIITJEE Career Institute location"
                src="https://www.google.com/maps?q=AMIITJEE%20Career%20Institute&z=15&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
            </div>
          </section>
        </section>
      </main>

      <section
        id="about-us"
        className="home-about-us"
      >
        <div className="home-about-shell">
          <h3 style={{ color: "#1e40af", fontSize: "1.6rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "12px", fontWeight: "800" }}>
            <span aria-hidden="true" style={{ fontSize: "1.8rem" }}>Teacher</span> About Us
          </h3>
          <h4 style={{ color: "#0f172a", fontSize: "1.3rem", fontWeight: "700", margin: "0 0 24px", lineHeight: "1.4" }}>
            Shaping Futures. Building Success Stories.
          </h4>

          <p style={{ margin: "0 0 16px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            At AMITJEE Career Institute, we are committed to transforming students' dreams into reality by providing quality education, expert guidance, and a result-oriented approach. Our mission is to help aspiring students crack competitive exams like JEE Advanced, NEET-UG, and other academic challenges with confidence and excellence.
          </p>
          <p style={{ margin: "0 0 32px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            We believe that success is not just about hard work - it's about learning smart, staying consistent, and having the right mentorship. That's why our teaching methodology focuses on concept clarity, practical understanding, and continuous improvement, ensuring that every student reaches their full potential.
          </p>

          <div className="home-about-grid">
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span aria-hidden="true">Vision</span> Our Vision
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                To become a leading institute that empowers students with knowledge, skills, and confidence to excel in competitive exams and achieve their career goals.
              </p>
            </div>

            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span aria-hidden="true">Mission</span> Our Mission
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
              <span aria-hidden="true">Idea</span> What Makes Us Different
            </h5>
            <ul className="home-about-diff-grid">
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span aria-hidden="true" style={{ fontSize: "1.4rem" }}></span>
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Experienced Faculty</strong> Learn from experts with strong academic backgrounds</span>
              </li>
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span aria-hidden="true" style={{ fontSize: "1.4rem" }}></span>
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Structured Learning</strong> Well-planned syllabus and study material</span>
              </li>
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span aria-hidden="true" style={{ fontSize: "1.4rem" }}></span>
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Regular Tests & Analysis</strong> Track performance and improve continuously</span>
              </li>
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span aria-hidden="true" style={{ fontSize: "1.4rem" }}></span>
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Doubt Support</strong> Quick and effective doubt-solving sessions</span>
              </li>
              <li style={{ display: "flex", gap: "16px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,1)" }}>
                <span aria-hidden="true" style={{ fontSize: "1.4rem" }}></span>
                <span><strong style={{ color: "#0f172a", display: "block", marginBottom: "6px", fontSize: "1.05rem" }}>Student-Centric Approach</strong> Focused on individual growth and success</span>
              </li>
            </ul>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
            <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span aria-hidden="true">Commitment</span> Our Commitment
            </h5>
            <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
              We are not just an institute - we are a partner in your journey. From building strong fundamentals to achieving top ranks, we stand with our students at every step, guiding them towards success.
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(90deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%)",
              padding: "24px 32px",
              borderRadius: "14px",
              marginTop: "32px",
              borderLeft: "4px solid #1e40af",
              boxShadow: "0 8px 32px rgba(15, 23, 42, 0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <h5 style={{ color: "#1e40af", fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: "10px", textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: "800" }}>
              <span aria-hidden="true">Goal</span> Your Dream. Our Responsibility.
            </h5>
            <p style={{ margin: "0 0 4px", color: "#334155", fontSize: "1.1rem" }}>
              At AMITJEE, your success is our priority.
            </p>
            <p style={{ margin: "4px 0 0", fontWeight: "800", color: "#0f172a", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span aria-hidden="true">{">"}</span> Join us and take the first step towards a brighter future.
            </p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-shell">
          <div className="home-footer-head">
            <h3>Explore Medical and Engineering Courses</h3>
            <p>Curated tracks to build competitive exam confidence.</p>
          </div>

          <div className="home-footer-grid">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title} className="home-footer-group">
                <h4>{group.title}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="home-footer-links">
            {FOOTER_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                className="home-footer-link"
                onClick={link === "About" ? scrollToAboutSection : undefined}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
        <div className="site-copyright">
          <p>Copyright 2026 AMIITJEE Career Institute. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default StudentHome;
