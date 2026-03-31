import { useEffect, useRef, useState } from "react";
import "./home.css";
import screenSaverImageOne from "../web design.png";
import screenSaverImageTwo from "../web2.png";
import { apiUrl, parseJsonResponse } from "./api";

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

const FOOTER_LINKS = ["About", "Discover AMIITJEE", "For Admin", "Legal & Accessibility"];

function TeacherHomeLogin({ onExploreCourses, onBrandClick, onLogout, userName, onGoTeacher, isTeacher, onGoCourses, token }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [queries, setQueries] = useState([]);
  const [queryError, setQueryError] = useState("");
  const [queryActionError, setQueryActionError] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  function getLocalQueries() {
    return JSON.parse(localStorage.getItem("queries") || "[]");
  }

  function isServerQueryId(id) {
    const numericId = Number(id);
    return Number.isInteger(numericId) && numericId > 0 && numericId <= 2147483647;
  }

  function getClientOnlyQueries() {
    return getLocalQueries().filter((item) => item?.localOnly || !isServerQueryId(item?.id));
  }

  function mergeQueries(serverQueries, localQueries) {
    const merged = [...serverQueries];
    const seen = new Set(serverQueries.map((item) => `${item.id}`));

    for (const item of localQueries) {
      const key = `${item.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }

    return merged.sort((a, b) => {
      const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }

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
    refreshQueries();
  }, [token]);

  useEffect(() => {
    if (!token) return undefined;

    const intervalId = window.setInterval(() => {
      refreshQueries({ silent: true });
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [token]);

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

  async function refreshQueries(options = {}) {
    const { silent = false } = options;
    if (!token) {
      if (!silent) {
        setQueryError("Missing teacher session. Please sign in again.");
      }
      setQueries(getClientOnlyQueries());
      return;
    }

    try {
      setQueryActionError("");
      const response = await fetch(apiUrl("/api/admin/queries"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        if (!silent) {
          setQueryError(data?.error || "Unable to load server queries. Showing local queries only.");
        }
        setQueries(getClientOnlyQueries());
        return;
      }
      const clientOnlyQueries = getClientOnlyQueries();
      localStorage.setItem("queries", JSON.stringify(clientOnlyQueries));
      setQueryError("");
      setQueries(mergeQueries(Array.isArray(data) ? data : [], clientOnlyQueries));
    } catch (_error) {
      if (!silent) {
        setQueryError("Unable to reach query service. Showing local queries only.");
      }
      setQueries(getClientOnlyQueries());
    }
  }

  async function deleteQuery(id) {
    const confirmed = window.confirm("Are you sure you want to delete this query?");
    if (!confirmed) return;

    setQueryActionError("");
    const nextLocalQueries = getLocalQueries().filter((item) => `${item.id}` !== `${id}`);

    if (!isServerQueryId(id)) {
      setQueries((prev) => prev.filter((item) => `${item.id}` !== `${id}`));
      localStorage.setItem("queries", JSON.stringify(nextLocalQueries));
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/admin/queries/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = response.status === 204 ? null : await parseJsonResponse(response);
        if (response.status === 404) {
          setQueries((prev) => prev.filter((item) => `${item.id}` !== `${id}`));
          localStorage.setItem("queries", JSON.stringify(nextLocalQueries));
          return;
        }
        setQueryActionError(data?.error || "Failed to delete query.");
        return;
      }

      setQueries((prev) => prev.filter((item) => `${item.id}` !== `${id}`));
      localStorage.setItem("queries", JSON.stringify(nextLocalQueries));
    } catch (_error) {
      setQueryActionError("Failed to delete query.");
    }
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
              {userName || "Teacher"}
            </button>
            {menuOpen && (
              <div className="home-user-menu">
                {isTeacher && (
                  <button type="button" onClick={onGoTeacher}>
                    Teacher Panel
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
              {queryError && <p className="form-error">{queryError}</p>}
              {queryActionError && <p className="form-error">{queryActionError}</p>}
              <div className="admin-query-table">
                <div className="admin-query-row admin-query-header">
                  <span>Name</span>
                  <span>Email</span>
                  <span>Mobile</span>
                  <span>Query</span>
                  <span>Time</span>
                  <span>Action</span>
                </div>
                {queries.length === 0 && (
                  <div className="admin-query-row">
                    <span>No queries yet.</span>
                    <span />
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
                    <span className="admin-query-action-cell">
                      <button type="button" className="admin-mini-btn admin-delete" onClick={() => deleteQuery(item.id)}>
                        Delete
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="home-right" />
        </section>
      </main>

      <section className="home-about-us">
        <div className="home-about-shell">
          <h3 style={{ color: "#1e40af", fontSize: "1.6rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "12px", fontWeight: "800" }}>
            <span role="img" aria-label="Rocket" style={{ fontSize: "1.8rem" }}>🚀</span> Discover AMIITJEE
          </h3>
          <h4 style={{ color: "#0f172a", fontSize: "1.3rem", fontWeight: "700", margin: "0 0 24px", lineHeight: "1.4" }}>
            Step into a World of Smart Learning and Real Results
          </h4>
          <p style={{ margin: "0 0 16px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            At AMITJEE Career Institute, we believe that success is not just about hard work. It is about learning smart, staying consistent, and following the right strategy. Our goal is to create an environment where students are guided, motivated, and equipped with everything they need to excel.
          </p>
          <p style={{ margin: "0 0 16px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            We combine deep concept clarity, strategic preparation, and continuous mentorship to ensure that every student not only understands subjects thoroughly but also knows how to apply them effectively in exams like JEE and NEET.
          </p>
          <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            Our approach focuses on building a strong academic foundation, sharpening analytical thinking, and developing the confidence to solve even the most challenging problems. With structured study plans, regular assessments, and personalized guidance, students are always on the right path toward improvement.
          </p>
        </div>
      </section>

      <section className="home-about-us">
        <div className="home-about-shell">
          <h3 style={{ color: "#1e40af", fontSize: "1.6rem", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "12px", fontWeight: "800" }}>
            <span role="img" aria-label="Legal" style={{ fontSize: "1.8rem" }}>⚖️</span> Legal & Accessibility
          </h3>
          <h4 style={{ color: "#0f172a", fontSize: "1.3rem", fontWeight: "700", margin: "0 0 24px", lineHeight: "1.4" }}>
            Committed to Transparency, Privacy & Inclusive Access
          </h4>
          <p style={{ margin: "0 0 24px", fontSize: "1.05rem", lineHeight: "1.7", color: "#334155" }}>
            At AMITJEE Career Institute, we value trust, transparency, and accessibility. We are committed to protecting user information, maintaining ethical standards, and ensuring that our platform is accessible to all students.
          </p>
          <div className="home-about-grid">
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Privacy">🔒</span> Privacy & Data Protection
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                We respect your privacy and ensure that all personal information is handled securely. Any data shared with us is used only to improve your learning experience and is never misused or shared without consent.
              </p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Terms">📜</span> Terms & Conditions
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                By using our website and services, users agree to follow our guidelines and policies. These terms are designed to ensure a safe, fair, and productive environment for all students.
              </p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Accessibility">♿</span> Accessibility Commitment
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                We strive to make our website accessible and user-friendly for everyone, including individuals with different abilities. Our goal is to provide an inclusive learning experience without barriers.
              </p>
            </div>
            <div style={{ background: "rgba(255, 255, 255, 0.6)", border: "1px solid rgba(148, 163, 184, 0.2)", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column" }}>
              <h5 style={{ color: "#1e293b", fontSize: "1.2rem", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span role="img" aria-label="Policy">⚖️</span> Fair Use & Content Policy
              </h5>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: "1.7", color: "#475569" }}>
                All study materials, content, and resources provided by AMITJEE are for educational purposes only. Unauthorized distribution or misuse of content is strictly prohibited.
              </p>
            </div>
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

export default TeacherHomeLogin;
