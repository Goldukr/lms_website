const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add imports for Social Science and English if they don't exist
if (!content.includes('import SocialScience')) {
  const importString = `import Biology from "./biology";\nimport SocialScience from "./socialscience";\nimport English from "./english";`;
  content = content.replace(`import Biology from "./biology";`, importString);
}


// 2. Add dynamic routing block at the end of the routing statements, just after if (page === "foundation-class-10") { ... }
const routingBlock = `
  if (page.startsWith("foundation-class-")) {
    const parts = page.split("-");
    if (parts.length > 3) {
      const classLevel = parts[2];
      const subject = parts.slice(3).join("-");
      const parsedPage = \`foundation-class-\${classLevel}\`;

      const handleBack = () => setPage(parsedPage);
      const courseLabel = \`Class \${classLevel}\`;

      if (subject === "physics") return <Physics onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel} />;
      if (subject === "chemistry") return <Chemistry onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel} />;
      if (subject === "biology") return <Biology onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel} />;
      if (subject === "mathematics") return <Mathematics onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel} />;
      if (subject === "social-science") return <SocialScience onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel} />;
      if (subject === "english") return <English onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel} />;
    }
  }
`;

// Insert it safely before if (page === "home") 
if (!content.includes('if (page.startsWith("foundation-class-"))')) {
  content = content.replace('if (page === "home") {', routingBlock + '\n  if (page === "home") {');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log("Subjects routed successfully!");
