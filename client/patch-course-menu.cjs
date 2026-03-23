const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const filesToPatch = [
  'course.jsx',
  'foundation.jsx',
  '11neet.jsx', '12neet.jsx', 'neetdropper.jsx',
  '11jeeadvance.jsx', '12jeeadvance.jsx', 'jeedropper.jsx',
  'class7.jsx', 'class8.jsx', 'class9.jsx', 'class10.jsx',
  'physics.jsx', 'chemistry.jsx', 'biology.jsx', 'mathematics.jsx', 'socialscience.jsx', 'english.jsx'
];

const newHeader = `
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
`;

// App.jsx patching
const appPath = path.join(srcDir, 'App.jsx');
if (fs.existsSync(appPath)) {
  let appContent = fs.readFileSync(appPath, 'utf8');

  // 1. Add auth etc. to <Course /> if missing
  const authStr = `        auth={auth}\n        userName={auth?.name}\n        userAvatar={auth?.avatar}\n        onLogout={() => { setAuth(null); setPage("home"); }}\n        onGoProfile={() => setPage("profile")}\n        onLoginClick={() => setShowLoginModal(true)}`;
  if (!appContent.includes('auth={auth}') || !appContent.includes('userAvatar={auth?.avatar}')) {
    appContent = appContent.replace(
      /\<Course\n\s*onBackHome=\{/, 
      `<Course\n${authStr}\n        onBackHome={`
    );
  }

  // 2. Add auth etc. to Foundation subjects if missing
  const subjectPat = /(if \(subject === "[\w-]+"\) return \<[\w]+ onBackHome=\{\(\) \=\> setPage\("home"\)\} onBackCourses=\{handleBack\} courseLabel=\{courseLabel\} courseQuery=\{([^\}]+)\}) \/\>;/g;
  appContent = appContent.replace(subjectPat, `$1 ${authStr.replace(/\n\s*/g, ' ')} />;\n`);

  fs.writeFileSync(appPath, appContent, 'utf8');
  console.log("App.jsx patched.");
}

// Files patching
filesToPatch.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add menuOpen state if missing
  if (!content.includes('const [menuOpen')) {
    if (content.includes('const [navOpen')) {
      content = content.replace('const [navOpen', 'const [menuOpen, setMenuOpen] = useState(false);\n  const [navOpen');
    } else {
      content = content.replace(/(function \w+\([^\)]+\) \{)/, `$1\n  const [menuOpen, setMenuOpen] = useState(false);`);
    }
  }

  // Check if we need to add useState to imports
  if (!content.includes('useState')) {
    if (content.match(/import\s+\{.*\}\s+from\s+["']react["']/)) {
      content = content.replace(/import\s+\{(.*)\}\s+from\s+["']react["']/, `import {$1, useState} from "react"`);
    } else {
      content = `import { useState } from "react";\n` + content;
    }
  }

  // Replace header block
  const headerRegex = /\<header className="course-topbar"\>[\s\S]*?\<\/header\>/;
  content = content.replace(headerRegex, newHeader.trim());

  // Ensure props contain auth, userAvatar, etc.
  const propsRegex = /function (\w+)\(([^)]+)\)\s*\{/;
  const match = content.match(propsRegex);
  if (match) {
    let propsStr = match[2];
    let props = propsStr;
    const isObjectDestructured = propsStr.includes('{');
    
    if (isObjectDestructured) {
      let innerProps = propsStr.match(/\{([^}]+)\}/)[1];
      const requiredProps = ['auth', 'userName', 'userAvatar', 'onLogout', 'onGoProfile', 'onLoginClick'];
      let added = false;
      requiredProps.forEach(rp => {
        if (!innerProps.includes(rp)) {
          innerProps += `, ${rp}`;
          added = true;
        }
      });
      if (added) {
        content = content.replace(propsRegex, `function $1({${innerProps}}) {`);
      }
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Patched ${file}`);
});
