import { useEffect, useRef, useState } from "react";
import "./home.css";
import screenSaverImageOne from "../web design.png";
import screenSaverImageTwo from "../web2.png";

const NAV_ITEMS = ["Home", "Courses", "Test Series", "About Us"];

const SCREENSAVER_IMAGES = [screenSaverImageOne, screenSaverImageTwo];

const FOOTER_GROUPS = [
  {
    title: "In-Demand Careers",
    items: [
      "NEET Aspirants",
      "JEE Advanced Track",
      "Medical Foundations",
      "Engineering Core",
      "Scholarship Prep",
      "Career Guidance",
    ],
  },
  {
    title: "STEM Courses",
    items: ["Physics", "Chemistry", "Biology", "Mathematics", "Problem Solving", "Mock Tests"],
  },
  {
    title: "Test Series",
    items: [
      "NEET Full Tests",
      "JEE Advanced Tests",
      "Chapter-wise Tests",
      "Previous Year Papers",
      "All-India Rank Tests",
      "Progress Reports",
    ],
  },
  {
    title: "Student Success",
    items: ["Mentor Support", "Study Plans", "Doubt Clearing", "Performance Analytics", "Parent Updates", "Success Stories"],
  },
];

const FOOTER_LINKS = ["About", "Discover AMIITJEE", "For Schools", "Legal & Accessibility"];

function StudentHome({
  onExploreCourses,
  onBrandClick,
  onLogout,
  userName,
  onGoCourses,
  onGoProfile,
  userAvatar,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);
  const [queryForm, setQueryForm] = useState({
    name: "",
    email: "",
    mobile: "",
    query: "",
  });
  const [queryStatus, setQueryStatus] = useState("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (!navOpen) return;
      const dropdown = navRef.current;
      if (dropdown && dropdown.contains(event.target)) return;
      setNavOpen(false);
    }

    if (navOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [navOpen]);

  function onQueryChange(event) {
    const { name, value } = event.target;
    if (name === "mobile") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setQueryForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }
    setQueryForm((prev) => ({ ...prev, [name]: value }));
  }

  function onQuerySubmit(event) {
    event.preventDefault();
    if (queryForm.mobile.length !== 10) {
      setQueryStatus("Mobile number must be exactly 10 digits.");
      setTimeout(() => setQueryStatus(""), 2000);
      return;
    }

    const entry = {
      id: `${Date.now()}`,
      ...queryForm,
      created_at: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("queries") || "[]");
    localStorage.setItem("queries", JSON.stringify([entry, ...existing]));
    setQueryForm({ name: "", email: "", mobile: "", query: "" });
    setQueryStatus("Query submitted.");
    setTimeout(() => setQueryStatus(""), 2000);
  }

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
              onClick={
                item === "Home"
                  ? onBrandClick
                  : item === "Courses"
                    ? onExploreCourses
                    : undefined
              }
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
        >
          Menu
        </button>

        <div className="home-actions">
          <button type="button" className="home-call">
            Call
          </button>
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
                <button type="button" onClick={onGoCourses}>
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
              onClick={
                item === "Home"
                  ? onBrandClick
                  : item === "Courses"
                    ? onExploreCourses
                    : undefined
              }
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
          <button type="button" className="home-screensaver-button" onClick={onExploreCourses}>
            Explore Courses
          </button>
        </div>
      </section>

      <main className="home-main">
        <section className="home-hero">
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

          <div className="home-right">
            <article className="home-float-card home-float-main">
              <h2>Prep smarter with AMIITJEE Online Test Series</h2>
              <p>Adaptive practice tracks your weak zones and boosts your score path.</p>
            </article>

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
                <button type="submit" className="home-enquiry-submit">
                  Submit
                </button>
              </form>
            </article>
          </div>
        </section>
      </main>

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
              <button key={link} type="button" className="home-footer-link">
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

export default StudentHome;
