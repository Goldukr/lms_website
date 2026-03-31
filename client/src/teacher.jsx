import { useEffect, useState } from "react";
import "./teacher.css";
import { apiUrl, parseJsonResponse } from "./api";

function TeacherPanel({ token, onLogout, onBackHome }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

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
      setStudents(Array.isArray(data) ? data.filter((item) => item.role === "student") : []);
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

  useEffect(() => {
    loadStudents();
  }, [token]);

  const pendingStudentsCount = students.filter((item) => item.status !== "approved").length;

  return (
    <div className="admin-page">
      <div className="admin-hero" />
      <div className="admin-shell">
        <header className="admin-header">
          <div className="admin-copy">
            <p className="admin-eyebrow">Teacher Control</p>
            <h1>Student Records</h1>
            <p className="admin-subtitle">Review student details only.</p>
          </div>
          <div className="admin-actions">
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
            <div className="admin-card-head-actions" />
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
          {actionError && <p className="form-error">{actionError}</p>}

          {!loading && !error && !students.length && (
            <p className="admin-status">No users found yet.</p>
          )}

          {!loading && !error && students.length > 0 && (
            <>
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
                {students.map((student) => (
                  <div className="admin-row" key={`${student.role}-${student.id}`}>
                    <span data-label="Name">{student.name}</span>
                    <span data-label="Role">{student.role}</span>
                    <span data-label="Mobile">{student.mobile}</span>
                    <span data-label="Email">{student.email}</span>
                    <span data-label="Course">{student.course || "-"}</span>
                    <span data-label="Status">{student.status || "pending"}</span>
                    <span data-label="Created">{student.created_at ? new Date(student.created_at).toLocaleString() : "-"}</span>
                    <span className="admin-actions-cell">
                      {student.status !== "approved" && (
                        <button
                          type="button"
                          className="admin-mini-btn admin-approve"
                          onClick={() => approveStudent(student.id)}
                        >
                          Approve
                        </button>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default TeacherPanel;
