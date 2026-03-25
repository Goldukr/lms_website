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

function HomeLogin({ onExploreCourses, onBrandClick, onLogout, userName, onGoAdmin, isAdmin, onGoCourses }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [queries, setQueries] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("queries") || "[]");
    setQueries(stored);
  }, []);

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


  function refreshQueries() {
    const stored = JSON.parse(localStorage.getItem("queries") || "[]");
    setQueries(stored);
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
          ref={toggleRef}
        >
          <i className="bi bi-justify" aria-hidden="true"></i>
        </button>

        <div className="home-actions">
          <button type="button" className="home-call">
            Call
          </button>
          <div className="home-user" ref={menuRef}>
            <button type="button" className="home-user-btn" onClick={() => setMenuOpen((prev) => !prev)}>
              {userName || "User"}
            </button>
            {menuOpen && (
              <div className="home-user-menu">
                {isAdmin && (
                  <button type="button" onClick={onGoAdmin}>
                    Admin Panel
                  </button>
                )}
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
                  ? () => {
                      onBrandClick?.();
                      setNavOpen(false);
                    }
                  : item === "Courses"
                    ? () => {
                        onExploreCourses?.();
                        setNavOpen(false);
                      }
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
      </section>

      <main className="home-main">
        <section className="home-hero">
          <div className="home-left admin-home-wide">
            <div className="admin-query-card">
              <div className="admin-query-head">
                <h2>Student Queries</h2>
                <button type="button" className="secondary-btn" onClick={refreshQueries}>
                  Refresh
                </button>
              </div>
              <div className="admin-query-table">
                <div className="admin-query-row admin-query-header">
                  <span>Name</span>
                  <span>Email</span>
                  <span>Mobile</span>
                  <span>Query</span>
                  <span>Time</span>
                </div>
                {queries.length === 0 && (
                  <div className="admin-query-row">
                    <span>No queries yet.</span>
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                )}
                {queries.map((item) => (
                  <div className="admin-query-row" key={item.id}>
                    <span>{item.name}</span>
                    <span>{item.email}</span>
                    <span>{item.mobile}</span>
                    <span>{item.query}</span>
                    <span>{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="home-right" />
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

export default HomeLogin;
