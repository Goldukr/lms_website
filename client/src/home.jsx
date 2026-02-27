import { useEffect, useRef, useState } from "react";
import "./home.css";
import screenSaverImageOne from "../web design.png";
import screenSaverImageTwo from "../web2.png";

const NAV_ITEMS = [
  "Courses",
  "Test Series",
  "Results",
  "About Us",
];

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

function Home({ onLoginClick, onExploreCourses, onBrandClick }) {
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
              onClick={item === "Courses" ? onExploreCourses : undefined}
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
          Menu
        </button>

        <div className="home-actions">
          <a
            className="home-call home-chat"
            href="https://wa.me/9783093793"
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
          <button type="button" className="home-login" onClick={onLoginClick}>
            Login
          </button>
        </div>
      </header>
      {navOpen && (
        <div className="home-nav-dropdown" ref={navRef}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className="home-nav-item"
              onClick={item === "Courses" ? onExploreCourses : undefined}
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
                <button type="submit" className="home-enquiry-submit">Submit</button>
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

export default Home;
