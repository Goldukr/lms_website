import "./course.css";

const COURSES = ["11 NEET", "11 JEE Advance", "12 NEET", "12 JEE Advance"];
const NAV_ITEMS = ["Courses", "Test Series", "Results", "About Us"];

const COURSE_IMAGES = {
  0: "/assets/doctor.png",
  1: "/assets/engineer.png",
  2: "/assets/doctor.png",
  3: "/assets/engineer.png",
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

function Course({ onBackHome, onSelectNeet11, onSelectNeet12, onSelectJee11, onSelectJee12, selectedCourse }) {
  function normalizeCourse(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  const normalizedSelected = normalizeCourse(selectedCourse);

  function isAllowed(course) {
    if (!normalizedSelected) return true;
    return normalizeCourse(course) === normalizedSelected;
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
              onClick={item === "Courses" ? undefined : onBackHome}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="course-actions">
          <button type="button" className="course-back" onClick={onBackHome}>
            Home
          </button>
        </div>
      </header>

      <div className="course-shell">
        <h1 className="course-title">Explore Courses</h1>
        <div className="course-grid">
          {COURSES.map((course, index) => {
            const image = COURSE_IMAGES[index];
            const handleClick =
              index === 0
                ? onSelectNeet11
                : index === 1
                ? onSelectJee11
                : index === 2
                ? onSelectNeet12
                : index === 3
                ? onSelectJee12
                : undefined;
            const allowed = isAllowed(course);
            return (
              <button
                key={course}
                type="button"
                className={`course-card ${image ? "with-image" : ""} ${!allowed ? "course-card-disabled" : ""}`}
                onClick={allowed ? handleClick : undefined}
                disabled={!allowed}
              >
                {image && <img className="course-card-image" src={image} alt="" aria-hidden="true" />}
                <span className="course-card-text">{course}</span>
              </button>
            );
          })}
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

export default Course;
