const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add imports
const importString = `import Foundation from "./foundation";\nimport Class7 from "./class7";\nimport Class8 from "./class8";\nimport Class9 from "./class9";\nimport Class10 from "./class10";`;
content = content.replace(`import Foundation from "./foundation";`, importString);

// 2. Add to getCoursePage
const getCoursePageMatch = `if (normalized === "foundation") return "foundation";`;
const getCoursePageReplace = `if (normalized === "class 7" || normalized === "class-7") return "foundation-class-7";\n    if (normalized === "class 8" || normalized === "class-8") return "foundation-class-8";\n    if (normalized === "class 9" || normalized === "class-9") return "foundation-class-9";\n    if (normalized === "class 10" || normalized === "class-10") return "foundation-class-10";\n    if (normalized === "foundation") return "foundation";`;
content = content.replace(getCoursePageMatch, getCoursePageReplace);

// 3. Add to getStudentAllowedPages
const getStudentAllowedPagesMatch = `if (base === "foundation") return new Set(["foundation", "foundation-physics", \n"foundation-chemistry", "foundation-biology", "foundation-mathematics", "foundation-socialscience"]);`;
const getStudentAllowedPagesReplace = `if (base === "foundation-class-7") return new Set(["foundation-class-7", "foundation-class-7-physics", "foundation-class-7-chemistry", "foundation-class-7-mathematics", "foundation-class-7-biology", "foundation-class-7-social-science", "foundation-class-7-english"]);
    if (base === "foundation-class-8") return new Set(["foundation-class-8", "foundation-class-8-physics", "foundation-class-8-chemistry", "foundation-class-8-mathematics", "foundation-class-8-biology", "foundation-class-8-social-science", "foundation-class-8-english"]);
    if (base === "foundation-class-9") return new Set(["foundation-class-9", "foundation-class-9-physics", "foundation-class-9-chemistry", "foundation-class-9-mathematics", "foundation-class-9-biology", "foundation-class-9-social-science", "foundation-class-9-english"]);
    if (base === "foundation-class-10") return new Set(["foundation-class-10", "foundation-class-10-physics", "foundation-class-10-chemistry", "foundation-class-10-mathematics", "foundation-class-10-biology", "foundation-class-10-social-science", "foundation-class-10-english"]);
    if (base === "foundation") return new Set(["foundation", "foundation-class-7", "foundation-class-8", "foundation-class-9", "foundation-class-10"]);`;
content = content.replace(getStudentAllowedPagesMatch, getStudentAllowedPagesReplace);
// Also try single-line version of `if (base === "foundation") ... ` in case my regex match is slightly off
const singleLineMatch = `if (base === "foundation") return new Set(["foundation", "foundation-physics", "foundation-chemistry", "foundation-biology", "foundation-mathematics", "foundation-socialscience"]);`;
content = content.replace(singleLineMatch, getStudentAllowedPagesReplace);

// 4. Add the component render blocks
const renderBlocks = `
  if (page === "foundation-class-7") {
    return (
      <Class7
        auth={auth}
        userName={auth?.name}
        userAvatar={auth?.avatar}
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("foundation")}
        onSelectSubject={(subj) => setPage(\`foundation-class-7-\${subj}\`)}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
      />
    );
  }

  if (page === "foundation-class-8") {
    return (
      <Class8
        auth={auth}
        userName={auth?.name}
        userAvatar={auth?.avatar}
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("foundation")}
        onSelectSubject={(subj) => setPage(\`foundation-class-8-\${subj}\`)}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
      />
    );
  }

  if (page === "foundation-class-9") {
    return (
      <Class9
        auth={auth}
        userName={auth?.name}
        userAvatar={auth?.avatar}
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("foundation")}
        onSelectSubject={(subj) => setPage(\`foundation-class-9-\${subj}\`)}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
      />
    );
  }

  if (page === "foundation-class-10") {
    return (
      <Class10
        auth={auth}
        userName={auth?.name}
        userAvatar={auth?.avatar}
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("foundation")}
        onSelectSubject={(subj) => setPage(\`foundation-class-10-\${subj}\`)}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
      />
    );
  }
`;

content = content.replace('if (page === "foundation") {', renderBlocks + '\n  if (page === "foundation") {');

fs.writeFileSync(appPath, content, 'utf8');
console.log("App.jsx patched successfully!");
