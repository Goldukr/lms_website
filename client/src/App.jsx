import { useEffect, useState } from "react";
import Signin from "./sigin";
import Sgnup from "./sgnup";
import ForgotPassword from "./forgotpassword";
import Home from "./home";
import HomeLogin from "./adminhomelogin";
import Course from "./course";
import Neet11 from "./11neet";
import Neet12 from "./12neet";
import NeetDropper from "./neetdropper";
import JeeAdvance11 from "./11jeeadvance";
import JeeAdvance12 from "./12jeeadvance";
import JeeDropper from "./jeedropper";
import AdminPanel from "./admin";
import AdminCourse from "./admincourse";
import StudentHome from "./studenthome";
import Profile from "./profile";
import Physics from "./physics";
import Chemistry from "./chemistry";
import Mathematics from "./mathematics";
import Biology from "./biology";
import SocialScience from "./socialscience";
import English from "./english";
import Foundation from "./foundation";
import Class7 from "./class7";
import Class8 from "./class8";
import Class9 from "./class9";
import Class10 from "./class10";

function App() {
  const [page, setPage] = useState("home");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [loginPrefill, setLoginPrefill] = useState({
    role: "student",
    identifier: "",
  });
  const [homeCourseTarget, setHomeCourseTarget] = useState("");
  const [courseBackTarget, setCourseBackTarget] = useState("course");
  const [auth, setAuth] = useState(() => {
    const cached = localStorage.getItem("auth");
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [page]);

  useEffect(() => {
    if (page === "signin" || page === "signup" || page === "forgot") {
      setPage("home");
    }
  }, [page]);

  useEffect(() => {
    if (showLoginModal) return;
    setLoginPrefill({
      role: "student",
      identifier: "",
    });
  }, [showLoginModal]);

  function getCoursePage(course) {
    const normalized = String(course || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace("jee- advance", "jee-advance")
      .replace("jee advance", "jee-advance")
      .trim();

    if (normalized === "11 neet" || normalized === "neet11" || normalized === "neet-11") return "neet11";
    if (normalized === "12 neet" || normalized === "neet12" || normalized === "neet-12" || normalized === "neet-ug-12") return "neet12";
    if (normalized === "neet dropper" || normalized === "neet-dropper" || normalized === "neetdropper") return "neetdropper";
    if (normalized === "jee dropper" || normalized === "jee-dropper" || normalized === "jeedropper") return "jeedropper";
    if (normalized === "class 7" || normalized === "class-7") return "foundation-class-7";
    if (normalized === "class 8" || normalized === "class-8") return "foundation-class-8";
    if (normalized === "class 9" || normalized === "class-9") return "foundation-class-9";
    if (normalized === "class 10" || normalized === "class-10") return "foundation-class-10";
    if (normalized === "foundation") return "foundation";
    if (
      normalized === "11 jee-advance" ||
      normalized === "11 jee-advanced" ||
      normalized === "jee11" ||
      normalized === "jee-11"
    ) {
      return "jee11";
    }
    if (
      normalized === "12 jee-advance" ||
      normalized === "12 jee-advanced" ||
      normalized === "jee12" ||
      normalized === "jee-12"
    ) {
      return "jee12";
    }
    return "home";
  }

  function getSubjectPage(course, subject) {
    const base = getCoursePage(course);
    const subjectKey = String(subject || "").toLowerCase();
    if (base === "neet11") {
      if (subjectKey === "physics") return "neet11-physics";
      if (subjectKey === "chemistry") return "neet11-chemistry";
      if (subjectKey === "biology") return "neet11-biology";
    }
    if (base === "neet12") {
      if (subjectKey === "physics") return "neet12-physics";
      if (subjectKey === "chemistry") return "neet12-chemistry";
      if (subjectKey === "biology") return "neet12-biology";
    }
    if (base === "neetdropper") {
      if (subjectKey === "physics") return "neetdropper-physics";
      if (subjectKey === "chemistry") return "neetdropper-chemistry";
      if (subjectKey === "biology") return "neetdropper-biology";
    }
    if (base === "jee11") {
      if (subjectKey === "physics") return "jee11-physics";
      if (subjectKey === "chemistry") return "jee11-chemistry";
      if (subjectKey === "mathematics") return "jee11-mathematics";
    }
    if (base === "jee12") {
      if (subjectKey === "physics") return "jee12-physics";
      if (subjectKey === "chemistry") return "jee12-chemistry";
      if (subjectKey === "mathematics") return "jee12-mathematics";
    }
    return base;
  }

  function isStudentCoursePage(pageId) {
    return [
      "neet11",
      "neet12",
      "neetdropper",
      "jeedropper",
      "jee11",
      "jee12",
      "foundation",
      "neet11-physics",
      "neet11-chemistry",
      "neet11-biology",
      "neet12-physics",
      "neet12-chemistry",
      "neet12-biology",
      "neetdropper-physics",
      "neetdropper-chemistry",
      "neetdropper-biology",
      "jee11-physics",
      "jee11-chemistry",
      "jee11-mathematics",
      "jee12-physics",
      "jee12-chemistry",
      "jee12-mathematics",
    ].includes(pageId);
  }

  function isSubjectContentPage(pageId) {
    return [
      "neet11-physics",
      "neet11-chemistry",
      "neet11-biology",
      "neet12-physics",
      "neet12-chemistry",
      "neet12-biology",
      "neetdropper-physics",
      "neetdropper-chemistry",
      "neetdropper-biology",
      "jee11-physics",
      "jee11-chemistry",
      "jee11-mathematics",
      "jee12-physics",
      "jee12-chemistry",
      "jee12-mathematics",
    ].includes(pageId);
  }

  function renderLoginModal() {
    if (!showLoginModal) return null;
    return (
      <Signin
        variant="modal"
        onClose={() => setShowLoginModal(false)}
        initialRole={loginPrefill.role}
        initialIdentifier={loginPrefill.identifier}
        onCreateAccount={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
        onForgotPassword={() => {
          setShowLoginModal(false);
          setShowForgotPasswordModal(true);
        }}
        onSignIn={(data) => {
          setAuth(data);
          setShowLoginModal(false);
          if (data?.role === "student") {
            setPage(getCoursePage(data?.course));
          } else {
            setPage("home");
          }
        }}
      />
    );
  }

  function renderForgotPasswordModal() {
    if (!showForgotPasswordModal) return null;
    return (
      <ForgotPassword
        variant="modal"
        onClose={() => setShowForgotPasswordModal(false)}
        onBackToSignin={() => {
          setShowForgotPasswordModal(false);
          setShowLoginModal(true);
        }}
      />
    );
  }
  function getStudentAllowedPages(course) {
    const base = getCoursePage(course);
    if (base === "neet11") return new Set(["neet11", "neet11-physics", "neet11-chemistry", "neet11-biology"]);
    if (base === "neet12") return new Set(["neet12", "neet12-physics", "neet12-chemistry", "neet12-biology"]);
    if (base === "neetdropper") return new Set([
      "neetdropper",
      "neetdropper-physics",
      "neetdropper-chemistry",
      "neetdropper-biology",
      "neet11",
      "neet11-physics",
      "neet11-chemistry",
      "neet11-biology",
      "neet12",
      "neet12-physics",
      "neet12-chemistry",
      "neet12-biology",
    ]);
    if (base === "jeedropper") return new Set([
      "jeedropper",
      "jee11",
      "jee11-physics",
      "jee11-chemistry",
      "jee11-mathematics",
      "jee12",
      "jee12-physics",
      "jee12-chemistry",
      "jee12-mathematics",
    ]);
    if (base === "foundation-class-7") return new Set(["foundation-class-7", "foundation-class-7-physics", "foundation-class-7-chemistry", "foundation-class-7-mathematics", "foundation-class-7-biology", "foundation-class-7-social-science", "foundation-class-7-english"]);
    if (base === "foundation-class-8") return new Set(["foundation-class-8", "foundation-class-8-physics", "foundation-class-8-chemistry", "foundation-class-8-mathematics", "foundation-class-8-biology", "foundation-class-8-social-science", "foundation-class-8-english"]);
    if (base === "foundation-class-9") return new Set(["foundation-class-9", "foundation-class-9-physics", "foundation-class-9-chemistry", "foundation-class-9-mathematics", "foundation-class-9-biology", "foundation-class-9-social-science", "foundation-class-9-english"]);
    if (base === "foundation-class-10") return new Set(["foundation-class-10", "foundation-class-10-physics", "foundation-class-10-chemistry", "foundation-class-10-mathematics", "foundation-class-10-biology"]);
    if (base === "foundation") return new Set(["foundation", "foundation-class-7", "foundation-class-8", "foundation-class-9", "foundation-class-10"]);
    if (base === "jee11") return new Set(["jee11", "jee11-physics", "jee11-chemistry", "jee11-mathematics"]);
    if (base === "jee12") return new Set(["jee12", "jee12-physics", "jee12-chemistry", "jee12-mathematics"]);
    return new Set([base]);
  }

  useEffect(() => {
    if (auth?.role !== "admin" && page === "admin") {
      setPage("home");
    }
  }, [auth, page]);



  useEffect(() => {
    if (!auth || auth.role !== "student") return;
    const allowed = getStudentAllowedPages(auth.course);

    if (page === "course" || page === "admincourse" || isStudentCoursePage(page)) {
      if (!allowed.has(page)) {
        setPage(getCoursePage(auth.course));
      }
    }
  }, [auth, page]);

  if (page === "course") {
    return (
      <>
        <Course
        onBackHome={() => {
          setHomeCourseTarget("");
          setPage("home");
        }}
        onBackCourses={() => setPage("course")}
        onSelectNeet11={() => {
           setCourseBackTarget("course");
           setPage("neet11");
        }}
        onSelectNeet12={() => {
           setCourseBackTarget("course");
           setPage("neet12");
        }}
        onSelectNeetDropper={() => {
           setCourseBackTarget("course");
           setPage("neetdropper");
        }}
        onSelectJee11={() => setPage("jee11")}
        onSelectJee12={() => setPage("jee12")}
        onSelectJeeDropper={() => {
           setCourseBackTarget("course");
           setPage("jeedropper");
        }}
        onSelectFoundation={() => {
           setCourseBackTarget("course");
           setPage("foundation");
        }}
        selectedCourse={auth?.role === "student" ? auth?.course : homeCourseTarget}
        auth={auth}
        userName={auth?.name}
        userAvatar={auth?.avatar}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
        onLoginClick={() => setShowLoginModal(true)}
      />
      {renderLoginModal()}
      {renderForgotPasswordModal()}
    </>
    );
  }

  if (page === "admincourse") {
    return (
      <AdminCourse
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("admincourse")}
        onGoAdmin={() => setPage("admin")}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        userName={auth?.name}
        token={auth?.token}
      />
    );
  }

  if (page === "profile") {
    return (
      <Profile
        onBackHome={() => setPage("home")}
        onSaved={(updated) => {
          setAuth((prev) => (prev ? { ...prev, ...updated } : prev));
          setPage("home");
        }}
        token={auth?.token}
        course={auth?.course}
      />
    );
  }

  if (page === "neet11") {
    return (
      <>
        <Neet11
          onBackHome={() => setPage("home")}
          onBackCourses={() => {
            if (courseBackTarget === "course") {
              setHomeCourseTarget("neet-ug");
            }
            setPage(courseBackTarget);
          }}
          onSelectSubject={(subject) => {
            if (subject === "Physics") setPage("neet11-physics");
            if (subject === "Chemistry") setPage("neet11-chemistry");
            if (subject === "Biology") setPage("neet11-biology");
          }}
          onOpenPhysics={() => setPage("neet11-physics")}
          auth={auth}
          userName={auth?.name}
          onLogout={() => {
            setAuth(null);
            setPage("home");
          }}
          onGoProfile={() => setPage("profile")}
          userAvatar={auth?.avatar}
          onLoginClick={() => setShowLoginModal(true)}
        />
        {renderLoginModal()}
        {renderForgotPasswordModal()}
      </>
    );
  }

  if (page === "neet12") {
    return (
      <>
        <Neet12
          onBackHome={() => setPage("home")}
          onBackCourses={() => {
            if (courseBackTarget === "course") {
              setHomeCourseTarget("neet-ug");
            }
            setPage(courseBackTarget);
          }}
          onSelectSubject={(subject) => {
            if (subject === "Physics") setPage("neet12-physics");
            if (subject === "Chemistry") setPage("neet12-chemistry");
            if (subject === "Biology") setPage("neet12-biology");
          }}
          onOpenPhysics={() => setPage("neet12-physics")}
          auth={auth}
          userName={auth?.name}
          onLogout={() => {
            setAuth(null);
            setPage("home");
          }}
          onGoProfile={() => setPage("profile")}
          userAvatar={auth?.avatar}
          onLoginClick={() => setShowLoginModal(true)}
        />
        {renderLoginModal()}
        {renderForgotPasswordModal()}
      </>
    );
  }

  if (page === "neetdropper") {
    return (
      <>
        <NeetDropper
          onBackHome={() => setPage("home")}
          onBackCourses={() => {
            setHomeCourseTarget("neet-ug");
            setPage("course");
          }}
          onSelectSubject={(subject) => {
            if (subject === "Physics") setPage("neetdropper-physics");
            if (subject === "Chemistry") setPage("neetdropper-chemistry");
            if (subject === "Biology") setPage("neetdropper-biology");
          }}
          onOpenPhysics={() => setPage("neetdropper-physics")}
          onGoNeet11={() => {
            setCourseBackTarget("neetdropper");
            setPage("neet11");
          }}
          onGoNeet12={() => {
            setCourseBackTarget("neetdropper");
            setPage("neet12");
          }}
          auth={auth}
          userName={auth?.name}
          onLogout={() => {
            setAuth(null);
            setPage("home");
          }}
          onGoProfile={() => setPage("profile")}
          userAvatar={auth?.avatar}
          onLoginClick={() => setShowLoginModal(true)}
        />
        {renderLoginModal()}
        {renderForgotPasswordModal()}
      </>
    );
  }

  if (page === "admin") {
    return (
      <AdminPanel
        token={auth?.token}
        onBackHome={() => setPage("home")}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
      />
    );
  }

  if (page === "jee11") {
    return (
      <>
        <JeeAdvance11
          onBackHome={() => setPage("home")}
          onBackCourses={() => {
            if (courseBackTarget === "course") {
              setHomeCourseTarget("jee-advanced");
            }
            setPage(courseBackTarget);
          }}
          onSelectSubject={(subject) => {
            if (subject === "Physics") setPage("jee11-physics");
            if (subject === "Chemistry") setPage("jee11-chemistry");
            if (subject === "Mathematics") setPage("jee11-mathematics");
          }}
          onOpenPhysics={() => setPage("jee11-physics")}
          auth={auth}
          userName={auth?.name}
          onLogout={() => {
            setAuth(null);
            setPage("home");
          }}
          onGoProfile={() => setPage("profile")}
          userAvatar={auth?.avatar}
          onLoginClick={() => setShowLoginModal(true)}
        />
        {renderLoginModal()}
        {renderForgotPasswordModal()}
      </>
    );
  }

  if (page === "jee12") {
    return (
      <>
        <JeeAdvance12
          onBackHome={() => setPage("home")}
          onBackCourses={() => {
            if (courseBackTarget === "course") {
              setHomeCourseTarget("jee-advanced");
            }
            setPage(courseBackTarget);
          }}
          onSelectSubject={(subject) => {
            if (subject === "Physics") setPage("jee12-physics");
            if (subject === "Chemistry") setPage("jee12-chemistry");
            if (subject === "Mathematics") setPage("jee12-mathematics");
          }}
          onOpenPhysics={() => setPage("jee12-physics")}
          auth={auth}
          userName={auth?.name}
          onLogout={() => {
            setAuth(null);
            setPage("home");
          }}
          onGoProfile={() => setPage("profile")}
          userAvatar={auth?.avatar}
          onLoginClick={() => setShowLoginModal(true)}
        />
        {renderLoginModal()}
        {renderForgotPasswordModal()}
      </>
    );
  }

  if (page === "jeedropper") {
    return (
      <>
        <JeeDropper
          onBackHome={() => setPage("home")}
          onBackCourses={() => {
            setHomeCourseTarget("jee-advanced");
            setPage("course");
          }}
          onGoJee11={() => {
            setCourseBackTarget("jeedropper");
            setPage("jee11");
          }}
          onGoJee12={() => {
            setCourseBackTarget("jeedropper");
            setPage("jee12");
          }}
          auth={auth}
          userName={auth?.name}
          onLogout={() => {
            setAuth(null);
            setPage("home");
          }}
          onGoProfile={() => setPage("profile")}
          userAvatar={auth?.avatar}
          onLoginClick={() => setShowLoginModal(true)}
        />
        {renderLoginModal()}
        {renderForgotPasswordModal()}
      </>
    );
  }

  
  if (page === "foundation-class-7") {
    return (
      <Class7
        auth={auth}
        userName={auth?.name}
        userAvatar={auth?.avatar}
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("foundation")}
        onSelectSubject={(subj) => setPage(`foundation-class-7-${subj}`)}
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
        onSelectSubject={(subj) => setPage(`foundation-class-8-${subj}`)}
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
        onSelectSubject={(subj) => setPage(`foundation-class-9-${subj}`)}
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
        onSelectSubject={(subj) => setPage(`foundation-class-10-${subj}`)}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
      />
    );
  }

  if (page === "foundation") {
    return (
      <>
        <Foundation
          onBackHome={() => setPage("home")}
          onBackCourses={() => {
            setHomeCourseTarget("foundation");
            setPage("course");
          }}
          auth={auth}
          userName={auth?.name}
          onLogout={() => {
            setAuth(null);
            setPage("home");
          }}
          onGoProfile={() => setPage("profile")}
          userAvatar={auth?.avatar}
          onLoginClick={() => setShowLoginModal(true)}
          onSelectSubject={(subj) => setPage(`foundation-${subj}`)}
        />
        {renderLoginModal()}
        {renderForgotPasswordModal()}
      </>
    );
  }

  if (page === "neet11-physics") {
    return (
      <Physics
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("course")}
        courseLabel="11 NEET"
        courseQuery="11 NEET"
        auth={auth}
        userName={auth?.name}
        userAvatar={auth?.avatar}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
        onLoginClick={() => setShowLoginModal(true)}
      />
    );
  }

  if (page === "neet12-physics") {
    return (
      <Physics
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("course")}
        courseLabel="12 NEET"
        courseQuery="12 NEET"
        auth={auth}
        userName={auth?.name}
        userAvatar={auth?.avatar}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
        onLoginClick={() => setShowLoginModal(true)}
      />
    );
  }

  if (page === "neet11-chemistry") {
    return <Chemistry onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="11 NEET" courseQuery="11 NEET" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "neet12-chemistry") {
    return <Chemistry onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="12 NEET" courseQuery="12 NEET" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "neet11-biology") {
    return <Biology onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="11 NEET" courseQuery="11 NEET" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "neet12-biology") {
    return <Biology onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="12 NEET" courseQuery="12 NEET" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "neetdropper-physics") {
    return (
      <Physics
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("course")}
        courseLabel="NEET Dropper"
        courseQuery="NEET Dropper"
        auth={auth}
        userName={auth?.name}
        userAvatar={auth?.avatar}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
        onLoginClick={() => setShowLoginModal(true)}
      />
    );
  }

  if (page === "neetdropper-chemistry") {
    return <Chemistry onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="NEET Dropper" courseQuery="NEET Dropper" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "neetdropper-biology") {
    return <Biology onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="NEET Dropper" courseQuery="NEET Dropper" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "jee11-physics") {
    return <Physics onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="11 JEE-Advance" courseQuery="11 JEE-Advance" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "jee12-physics") {
    return <Physics onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="12 JEE-Advance" courseQuery="12 JEE-Advance" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "jee11-chemistry") {
    return <Chemistry onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="11 JEE-Advance" courseQuery="11 JEE-Advance" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "jee12-chemistry") {
    return <Chemistry onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="12 JEE-Advance" courseQuery="12 JEE-Advance" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "jee11-mathematics") {
    return <Mathematics onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="11 JEE-Advance" courseQuery="11 JEE-Advance" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  if (page === "jee12-mathematics") {
    return <Mathematics onBackHome={() => setPage("home")} onBackCourses={() => setPage("course")} courseLabel="12 JEE-Advance" courseQuery="12 JEE-Advance" auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;
  }

  
  if (page.startsWith("foundation-class-")) {
    const parts = page.split("-");
    if (parts.length > 3) {
      const classLevel = parts[2];
      const subject = parts.slice(3).join("-");
      const parsedPage = `foundation-class-${classLevel}`;

      const handleBack = () => setPage(parsedPage);
      const courseLabel = `Class ${classLevel}`;

      if (subject === "physics") return <Physics onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel}         auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;

      if (subject === "chemistry") return <Chemistry onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel}         auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;

      if (subject === "biology") return <Biology onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel}         auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;

      if (subject === "mathematics") return <Mathematics onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel}         auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;

      if (subject === "social-science") return <SocialScience onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel}         auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;

      if (subject === "english") return <English onBackHome={() => setPage("home")} onBackCourses={handleBack} courseLabel={courseLabel} courseQuery={courseLabel}         auth={auth} userName={auth?.name} userAvatar={auth?.avatar} onLogout={() => { setAuth(null); setPage("home"); }} onGoProfile={() => setPage("profile")} onLoginClick={() => setShowLoginModal(true)} />;

    }
  }

  if (page === "home") {
    return (
      <>
        {auth ? (
          auth?.role === "admin" ? (
            <HomeLogin
              userName={auth?.name}
              token={auth?.token}
              isAdmin
              onExploreCourses={() => setPage("admincourse")}
              onBrandClick={() => setPage("home")}
              onLogout={() => {
                setAuth(null);
                setShowLoginModal(false);
              }}
              onGoAdmin={() => setPage("admin")}
              onGoCourses={() => setPage("admincourse")}
            />
          ) : (
            <StudentHome
              userName={auth?.name}
              userAvatar={auth?.avatar}
              onExploreCourses={(target) => {
                const intended = getCoursePage(target);
                if (intended === "home") {
                  setHomeCourseTarget(target || "");
                  setPage("course");
                } else {
                  setPage(intended);
                }
              }}
              onBrandClick={() => setPage("home")}
              onLogout={() => {
                setAuth(null);
                setShowLoginModal(false);
              }}
              onGoCourses={() => setPage("course")}
              onGoProfile={() => setPage("profile")}
            />
          )
        ) : (
          <>
            <Home
              onLoginClick={() => setShowLoginModal(true)}
              onExploreCourses={(target) => {
                const intended = getCoursePage(target);
                if (intended === "home") {
                  setHomeCourseTarget(target || "");
                  setPage("course");
                } else {
                  setPage(intended);
                }
              }}
              onBrandClick={() => setPage("home")}
            />
            {showLoginModal && (
              <Signin
                variant="modal"
                onClose={() => setShowLoginModal(false)}
                initialRole={loginPrefill.role}
                initialIdentifier={loginPrefill.identifier}
                onCreateAccount={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                onForgotPassword={() => {
                  setShowLoginModal(false);
                  setShowForgotPasswordModal(true);
                }}
                onSignIn={(data) => {
                  setAuth(data);
                  setShowLoginModal(false);
                  if (data?.role === "student") {
                    setPage(getCoursePage(data?.course));
                  } else {
                    setPage("home");
                  }
                }}
              />
            )}
            {renderForgotPasswordModal()}
          </>
        )}
        {showSignupModal && (
          <Sgnup
            variant="modal"
            onClose={() => setShowSignupModal(false)}
            onBackToSignin={(prefill) => {
              setShowSignupModal(false);
              setLoginPrefill({
                role: prefill?.role || "student",
                identifier: prefill?.identifier || "",
              });
              setShowLoginModal(true);
            }}
          />
        )}
      </>
    );
  }

  return null;
}

export default App;
