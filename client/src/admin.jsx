import { useEffect, useState } from "react";
import "./admin.css";
import { apiUrl, parseJsonResponse } from "./api";

function AdminPanel({ token, onLogout, onBackHome }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionError, setActionError] = useState("");

  function getCurrentAdminId() {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload?.id) || null;
    } catch (_error) {
      return null;
    }
  }

  async function loadStudents() {
    if (!token) {
      setError("Missing admin token. Please sign in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setActionError("");
    try {
      const response = await fetch(apiUrl("/api/admin/users"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        setError(data?.error || "Failed to load students.");
        setStudents([]);
        return;
      }
      setStudents(data);
    } catch (_error) {
      setError("Failed to load students.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  async function approveStudent(id) {
    setActionError("");
    try {
      const response = await fetch(apiUrl(`/api/admin/students/${id}/approve`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.status === 204 ? null : await parseJsonResponse(response);
      if (!response.ok) {
        setActionError(data?.error || "Failed to approve student.");
        return;
      }
      setStudents((prev) =>
        prev.map((item) => (item.role === "student" && item.id === id ? { ...item, status: "approved" } : item))
      );
    } catch (_error) {
      setActionError("Failed to approve student.");
    }
  }

  async function approveAllStudents() {
    setActionError("");
    try {
      const response = await fetch(apiUrl("/api/admin/students/approve-all"), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await parseJsonResponse(response);
      if (!response.ok) {
        setActionError(data?.error || "Failed to approve all students.");
        return;
      }
      setStudents((prev) =>
        prev.map((item) =>
          item.role === "student" && item.status !== "approved"
            ? { ...item, status: "approved" }
            : item
        )
      );
    } catch (_error) {
      setActionError("Failed to approve all students.");
    }
  }

  async function deleteStudent(id) {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) {
      return;
    }
    setActionError("");
    try {
      const response = await fetch(apiUrl(`/api/admin/students/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await parseJsonResponse(response);
        setActionError(data?.error || "Failed to delete student.");
        return;
      }
      setStudents((prev) => prev.filter((item) => !(item.role === "student" && item.id === id)));
    } catch (_error) {
      setActionError("Failed to delete student.");
    }
  }

  async function deleteAdmin(id) {
    const confirmed = window.confirm("Are you sure you want to delete this admin?");
    if (!confirmed) {
      return;
    }
    setActionError("");
    try {
      const response = await fetch(apiUrl(`/api/admin/admins/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const data = await parseJsonResponse(response);
        setActionError(data?.error || "Failed to delete admin.");
        return;
      }
      if (id === getCurrentAdminId()) {
        onLogout();
        return;
      }
      setStudents((prev) => prev.filter((item) => !(item.role === "admin" && item.id === id)));
    } catch (_error) {
      setActionError("Failed to delete admin.");
    }
  }

  async function deleteAllUsers() {
    const confirmed = window.confirm("Are you sure you want to delete all users?");
    if (!confirmed) {
      return;
    }
    setActionError("");
    try {
      const response = await fetch(apiUrl("/api/admin/users"), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.status === 204 ? null : await parseJsonResponse(response);
      if (!response.ok) {
        setActionError(data?.error || "Failed to delete all users.");
        return;
      }
      onLogout();
    } catch (_error) {
      setActionError("Failed to delete all users.");
    }
  }


  useEffect(() => {
    loadStudents();
  }, [token]);

  const pendingStudentsCount = students.filter(
    (item) => item.role === "student" && item.status !== "approved"
  ).length;


  return (
    <div className="admin-page">
      <div className="admin-hero" />
      <div className="admin-shell">
        <header className="admin-header">
          <div className="admin-copy">
            <p className="admin-eyebrow">Admin Control</p>
            <h1>Student Records</h1>
            <p className="admin-subtitle">Review recently registered users.</p>
          </div>
          <div className="admin-actions">
            <div className="admin-filter" role="group" aria-label="Filter users">
              <button
                type="button"
                className={`admin-filter-btn ${roleFilter === "all" ? "active" : ""}`}
                onClick={() => setRoleFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`admin-filter-btn ${roleFilter === "student" ? "active" : ""}`}
                onClick={() => setRoleFilter("student")}
              >
                Students
              </button>
              <button
                type="button"
                className={`admin-filter-btn ${roleFilter === "admin" ? "active" : ""}`}
                onClick={() => setRoleFilter("admin")}
              >
                Admins
              </button>
            </div>
            <button type="button" className="secondary-btn" onClick={onBackHome}>
              Back Home
            </button>
            <button type="button" className="secondary-btn" onClick={loadStudents}>
              Refresh
            </button>
            <button type="button" className="primary-btn" onClick={onLogout}>
              Log Out
            </button>
          </div>
        </header>

        <main className="admin-card">
          <div className="admin-card-head">
            <div className="admin-card-head-actions">
              {students.length > 0 && (
                <button
                  type="button"
                  className="admin-mini-btn admin-delete-all-btn"
                  onClick={deleteAllUsers}
                  disabled={loading}
                >
                  Delete All Users
                </button>
              )}
            </div>
            {pendingStudentsCount > 0 && (
              <button
                type="button"
                className="primary-btn admin-approve-all-btn"
                onClick={approveAllStudents}
                disabled={loading}
              >
                Approve All
              </button>
            )}
          </div>
          {loading && <p className="admin-status">Loading users...</p>}
          {error && <p className="form-error">{error}</p>}

          {!loading && !error && !students.length && (
            <p className="admin-status">No users found yet.</p>
          )}

          {!loading && !error && students.length > 0 && (
            <>
              {students.filter((student) => roleFilter === "all" || student.role === roleFilter).length ===
              0 ? (
                <p className="admin-status">
                  No {roleFilter === "student" ? "students" : "admins"} found.
                </p>
              ) : (
                <div className="admin-table">
                <div className="admin-row admin-row-header">
                  <span>Name</span>
                  <span>Role</span>
                    <span>Mobile</span>
                    <span>Email</span>
                    <span>Course</span>
                    <span>Status</span>
                    <span>Created</span>
                    <span>Actions</span>
                  </div>
                  {students
                    .filter((student) => roleFilter === "all" || student.role === roleFilter)
                    .map((student) => (
                      <div className="admin-row" key={`${student.role}-${student.id}`}>
                        <span data-label="Name">{student.name}</span>
                        <span data-label="Role">{student.role}</span>
                        <span data-label="Mobile">{student.mobile}</span>
                        <span data-label="Email">{student.email}</span>
                        <span data-label="Course">{student.course || "-"}</span>
                        <span data-label="Status">{student.role === "student" ? student.status || "pending" : "-"}</span>
                        <span data-label="Created">{student.created_at ? new Date(student.created_at).toLocaleString() : "-"}</span>
                        <span className="admin-actions-cell">
                          {student.role === "student" && student.status !== "approved" && (
                            <button
                              type="button"
                              className="admin-mini-btn admin-approve"
                              onClick={() => approveStudent(student.id)}
                            >
                              Approve
                            </button>
                          )}
                          {student.role === "student" && (
                            <button
                              type="button"
                              className="admin-mini-btn admin-delete"
                              onClick={() => deleteStudent(student.id)}
                            >
                              Delete
                            </button>
                          )}
                          {student.role === "admin" && (
                            <button
                              type="button"
                              className="admin-mini-btn admin-delete"
                              onClick={() => deleteAdmin(student.id)}
                            >
                              Delete
                            </button>
                          )}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
          {!loading && !error && actionError && <p className="form-error">{actionError}</p>}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
