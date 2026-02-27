import { useEffect, useState } from "react";
import Signin from "./sigin";
import Sgnup from "./sgnup";
import ForgotPassword from "./forgotpassword";
import Home from "./home";
import HomeLogin from "./adminhomelogin";
import Course from "./course";
import Neet11 from "./11neet";
import Neet12 from "./12neet";
import JeeAdvance11 from "./11jeeadvance";
import JeeAdvance12 from "./12jeeadvance";
import AdminPanel from "./admin";
import AdminCourse from "./admincourse";
import StudentHome from "./studenthome";
import Profile from "./profile";
import Physics from "./physics";
import Chemistry from "./chemistry";
import Mathematics from "./mathematics";
import Biology from "./biology";

function App() {
  const [page, setPage] = useState("home");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
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

  function getCoursePage(course) {
    const normalized = String(course || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace("jee- advance", "jee-advance")
      .replace("jee advance", "jee-advance")
      .trim();

    if (normalized === "11 neet") return "neet11";
    if (normalized === "12 neet") return "neet12";
    if (normalized === "11 jee-advance") return "jee11";
    if (normalized === "12 jee-advance") return "jee12";
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
      "jee11",
      "jee12",
      "neet11-physics",
      "neet11-chemistry",
      "neet11-biology",
      "neet12-physics",
      "neet12-chemistry",
      "neet12-biology",
      "jee11-physics",
      "jee11-chemistry",
      "jee11-mathematics",
      "jee12-physics",
      "jee12-chemistry",
      "jee12-mathematics",
    ].includes(pageId);
  }

  function getStudentAllowedPages(course) {
    const base = getCoursePage(course);
    if (base === "neet11") return new Set(["neet11", "neet11-physics", "neet11-chemistry", "neet11-biology"]);
    if (base === "neet12") return new Set(["neet12", "neet12-physics", "neet12-chemistry", "neet12-biology"]);
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

  if (page === "signup") {
    return <Sgnup onBackToSignin={() => setPage("signin")} />;
  }

  if (page === "forgot") {
    return <ForgotPassword onBackToSignin={() => setPage("signin")} />;
  }

  if (page === "course") {
    return (
      <Course
        onBackHome={() => setPage("home")}
        onSelectNeet11={() => setPage("neet11")}
        onSelectNeet12={() => setPage("neet12")}
        onSelectJee11={() => setPage("jee11")}
        onSelectJee12={() => setPage("jee12")}
        selectedCourse={auth?.role === "student" ? auth?.course : null}
      />
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
      <Neet11
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("course")}
        onSelectSubject={(subject) => setPage(getSubjectPage("11 NEET", subject))}
        auth={auth}
        userName={auth?.name}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
        userAvatar={auth?.avatar}
      />
    );
  }

  if (page === "neet12") {
    return (
      <Neet12
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("course")}
        onSelectSubject={(subject) => setPage(getSubjectPage("12 NEET", subject))}
        userName={auth?.name}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
        userAvatar={auth?.avatar}
      />
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
      <JeeAdvance11
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("course")}
        onSelectSubject={(subject) => setPage(getSubjectPage("11 JEE-Advance", subject))}
        userName={auth?.name}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
        userAvatar={auth?.avatar}
      />
    );
  }

  if (page === "jee12") {
    return (
      <JeeAdvance12
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("course")}
        onSelectSubject={(subject) => setPage(getSubjectPage("12 JEE-Advance", subject))}
        userName={auth?.name}
        onLogout={() => {
          setAuth(null);
          setPage("home");
        }}
        onGoProfile={() => setPage("profile")}
        userAvatar={auth?.avatar}
      />
    );
  }

  if (page === "neet11-physics") {
    return (
      <Physics
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("neet11")}
        courseLabel="11 NEET"
        courseQuery="11 NEET"
      />
    );
  }

  if (page === "neet12-physics") {
    return (
      <Physics
        onBackHome={() => setPage("home")}
        onBackCourses={() => setPage("neet12")}
        courseLabel="12 NEET"
        courseQuery="12 NEET"
      />
    );
  }

  if (page === "neet11-chemistry") {
    return <Chemistry onBackHome={() => setPage("home")} onBackCourses={() => setPage("neet11")} courseLabel="11 NEET" courseQuery="11 NEET" />;
  }

  if (page === "neet12-chemistry") {
    return <Chemistry onBackHome={() => setPage("home")} onBackCourses={() => setPage("neet12")} courseLabel="12 NEET" courseQuery="12 NEET" />;
  }

  if (page === "neet11-biology") {
    return <Biology onBackHome={() => setPage("home")} onBackCourses={() => setPage("neet11")} courseLabel="11 NEET" courseQuery="11 NEET" />;
  }

  if (page === "neet12-biology") {
    return <Biology onBackHome={() => setPage("home")} onBackCourses={() => setPage("neet12")} courseLabel="12 NEET" courseQuery="12 NEET" />;
  }

  if (page === "jee11-physics") {
    return <Physics onBackHome={() => setPage("home")} onBackCourses={() => setPage("jee11")} courseLabel="11 JEE-Advance" courseQuery="11 JEE-Advance" />;
  }

  if (page === "jee12-physics") {
    return <Physics onBackHome={() => setPage("home")} onBackCourses={() => setPage("jee12")} courseLabel="12 JEE-Advance" courseQuery="12 JEE-Advance" />;
  }

  if (page === "jee11-chemistry") {
    return <Chemistry onBackHome={() => setPage("home")} onBackCourses={() => setPage("jee11")} courseLabel="11 JEE-Advance" courseQuery="11 JEE-Advance" />;
  }

  if (page === "jee12-chemistry") {
    return <Chemistry onBackHome={() => setPage("home")} onBackCourses={() => setPage("jee12")} courseLabel="12 JEE-Advance" courseQuery="12 JEE-Advance" />;
  }

  if (page === "jee11-mathematics") {
    return <Mathematics onBackHome={() => setPage("home")} onBackCourses={() => setPage("jee11")} courseLabel="11 JEE-Advance" courseQuery="11 JEE-Advance" />;
  }

  if (page === "jee12-mathematics") {
    return <Mathematics onBackHome={() => setPage("home")} onBackCourses={() => setPage("jee12")} courseLabel="12 JEE-Advance" courseQuery="12 JEE-Advance" />;
  }

  if (page === "home") {
    return (
      <>
        {auth ? (
          auth?.role === "admin" ? (
            <HomeLogin
              userName={auth?.name}
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
              onExploreCourses={() => setPage("course")}
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
              onExploreCourses={() => setPage("course")}
              onBrandClick={() => setPage("home")}
            />
            {showLoginModal && (
              <Signin
                variant="modal"
                onClose={() => setShowLoginModal(false)}
                onCreateAccount={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                onForgotPassword={() => {
                  setShowLoginModal(false);
                  setPage("forgot");
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
          </>
        )}
        {showSignupModal && (
          <Sgnup
            variant="modal"
            onClose={() => setShowSignupModal(false)}
            onBackToSignin={() => {
              setShowSignupModal(false);
              setShowLoginModal(true);
            }}
          />
        )}
      </>
    );
  }

  return (
    <Signin
      onCreateAccount={() => setPage("signup")}
      onForgotPassword={() => setPage("forgot")}
      onSignIn={(data) => {
        setAuth(data);
        if (data?.role === "student") {
          setPage(getCoursePage(data?.course));
        } else {
          setPage("home");
        }
      }}
    />
  );
}

export default App;
