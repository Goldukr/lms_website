const express = require("express");
const router = express.Router();
const pool = require("../db");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const upload = multer({ storage });

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

async function ensureStudentsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      course TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      avatar_url TEXT,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'`);
  await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS avatar_url TEXT`);
}

async function ensureAdminsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

async function ensureNotesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      course TEXT NOT NULL,
      subject TEXT NOT NULL,
      chapter TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

function hashPassword(password, salt = null) {
  const nextSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, nextSalt, 120000, 64, "sha512").toString("hex");
  return { hash, salt: nextSalt };
}

function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expectedHash, "hex"));
}

function isValidRole(role) {
  return role === "student" || role === "admin";
}

function getJwtSecret() {
  return process.env.JWT_SECRET || "dev_jwt_secret_change_me";
}

function getPublicErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const message = String(error?.message || "").toLowerCase();

  if (
    message.includes("enotfound") ||
    message.includes("getaddrinfo") ||
    message.includes("database") ||
    message.includes("connection") ||
    message.includes("timeout") ||
    message.includes("econnrefused")
  ) {
    return "Server database is not configured correctly.";
  }

  return fallback;
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return res.status(401).json({ error: "missing token" });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "admin access required" });
    }
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "invalid token" });
  }
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return res.status(401).json({ error: "missing token" });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = payload;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "invalid token" });
  }
}

router.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");
    res.json({ ok: true, serverTime: result.rows[0].server_time });
  } catch (error) {
    res.status(500).json({ ok: false, error: getPublicErrorMessage(error, "Health check failed.") });
  }
});

router.post("/auth/signup", async (req, res) => {
  const { name, mobile, email, role, course, password } = req.body || {};

  if (!name || !mobile || !email || !role || !password) {
    return res.status(400).json({ error: "name, mobile, email, role, and password are required" });
  }

  if (!isValidRole(role)) {
    return res.status(400).json({ error: "role must be 'student' or 'admin'" });
  }

  if (role === "student" && !course) {
    return res.status(400).json({ error: "course is required for students" });
  }

  try {
    if (role === "student") {
      await ensureStudentsTable();
    } else {
      await ensureAdminsTable();
    }

    const table = role === "student" ? "students" : "admins";
    const existing = await pool.query(`SELECT id FROM ${table} WHERE email = $1`, [email.toLowerCase()]);
    if (existing.rowCount) {
      return res.status(409).json({ error: "email already exists" });
    }

    const { hash, salt } = hashPassword(password);
    if (role === "student") {
      const result = await pool.query(
        `
          INSERT INTO students (name, mobile, email, course, status, avatar_url, password_hash, password_salt)
          VALUES ($1, $2, $3, $4, 'pending', NULL, $5, $6)
          RETURNING id, name, mobile, email, course, status, avatar_url, created_at
        `,
        [name.trim(), mobile.trim(), email.toLowerCase().trim(), course || null, hash, salt]
      );

      return res.status(201).json({ role: "student", ...result.rows[0] });
    }

    const result = await pool.query(
      `
        INSERT INTO admins (name, mobile, email, password_hash, password_salt)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, mobile, email, created_at
      `,
      [name.trim(), mobile.trim(), email.toLowerCase().trim(), hash, salt]
    );

    return res.status(201).json({ role: "admin", ...result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: getPublicErrorMessage(error, "Signup failed. Please try again.") });
  }
});

router.post("/auth/signin", async (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password || !role) {
    return res.status(400).json({ error: "email, password, and role are required" });
  }

  if (!isValidRole(role)) {
    return res.status(400).json({ error: "role must be 'student' or 'admin'" });
  }

  try {
    if (role === "student") {
      await ensureStudentsTable();
    } else {
      await ensureAdminsTable();
    }

    const table = role === "student" ? "students" : "admins";
    const identifier = email.toLowerCase().trim();
    const result = await pool.query(
      role === "student"
        ? `
          SELECT id, name, mobile, email, course, status, avatar_url, password_hash, password_salt
          FROM students
          WHERE email = $1 OR mobile = $1
        `
        : `
          SELECT id, name, mobile, email, NULL AS course, NULL AS status, password_hash, password_salt
          FROM admins
          WHERE email = $1 OR mobile = $1
        `,
      [identifier]
    );

    if (!result.rowCount) {
      const otherTable = role === "student" ? "admins" : "students";
      if (role === "student") {
        await ensureAdminsTable();
      } else {
        await ensureStudentsTable();
      }
      const otherResult = await pool.query(
        `
          SELECT id
          FROM ${otherTable}
          WHERE email = $1 OR mobile = $1
        `,
        [identifier]
      );
      if (otherResult.rowCount) {
        const otherRole = role === "student" ? "admin" : "student";
        return res.status(401).json({ error: `Account exists as ${otherRole}, use ${otherRole} login.` });
      }
      return res.status(404).json({ error: "user not found" });
    }

    const user = result.rows[0];
    if (role === "student" && user.status !== "approved") {
      return res.status(403).json({ error: "account pending approval" });
    }
    const valid = verifyPassword(password, user.password_salt, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid Credital" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role,
      },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    res.json({
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role,
      course: role === "student" ? user.course : null,
      status: role === "student" ? user.status : null,
      avatar: role === "student" ? user.avatar_url : null,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: getPublicErrorMessage(error, "Sign in failed. Please try again.") });
  }
});

router.get("/profile", requireAuth, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "student access required" });
  }

  try {
    await ensureStudentsTable();
    const result = await pool.query(
      `
        SELECT id, name, email, mobile, avatar_url
        FROM students
        WHERE id = $1
      `,
      [req.user.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "user not found" });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatar: user.avatar_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/profile", requireAuth, async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ error: "student access required" });
  }

  const { name, email, mobile, avatar } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  if (mobile && String(mobile).length !== 10) {
    return res.status(400).json({ error: "mobile must be 10 digits" });
  }

  try {
    await ensureStudentsTable();
    const result = await pool.query(
      `
        UPDATE students
        SET name = $1,
            email = $2,
            mobile = $3,
            avatar_url = $4
        WHERE id = $5
        RETURNING id, name, email, mobile, avatar_url
      `,
      [name.trim(), email.toLowerCase().trim(), mobile || "", avatar || null, req.user.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "user not found" });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatar: user.avatar_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/admin/students", requireAdmin, async (req, res) => {
  try {
    await ensureStudentsTable();
    const result = await pool.query(
      `
        SELECT id, name, mobile, email, course, status, created_at
        FROM students
        ORDER BY id DESC
      `
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/admin/notes", requireAdmin, upload.single("file"), async (req, res) => {
  const { course, subject, chapter } = req.body || {};
  if (!course || !subject || !chapter || !req.file) {
    return res.status(400).json({ error: "course, subject, chapter, and file are required" });
  }

  try {
    await ensureNotesTable();
    const result = await pool.query(
      `
        INSERT INTO notes (course, subject, chapter, file_name, file_path)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, course, subject, chapter, file_name, file_path, uploaded_at
      `,
      [course, subject, chapter, req.file.originalname, req.file.filename]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/notes", async (req, res) => {
  const { course, subject } = req.query;
  try {
    await ensureNotesTable();
    const values = [];
    const where = [];
    if (course) {
      values.push(course);
      where.push(`course = $${values.length}`);
    }
    if (subject) {
      values.push(subject);
      where.push(`subject = $${values.length}`);
    }
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const result = await pool.query(
      `
        SELECT id, course, subject, chapter, file_name, file_path, uploaded_at
        FROM notes
        ${clause}
        ORDER BY uploaded_at DESC
      `,
      values
    );
    res.json(
      result.rows.map((row) => ({
        ...row,
        file_url: `/uploads/${row.file_path}`,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/admin/notes/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid note id" });
  }

  try {
    await ensureNotesTable();
    const existing = await pool.query("SELECT file_path FROM notes WHERE id = $1", [id]);
    if (!existing.rowCount) {
      return res.status(404).json({ error: "note not found" });
    }

    const result = await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: "note not found" });
    }

    const filePath = path.join(uploadsDir, existing.rows[0].file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/admin/notes", requireAdmin, async (_req, res) => {
  try {
    await ensureNotesTable();
    const existing = await pool.query("SELECT file_path FROM notes");
    await pool.query("DELETE FROM notes");

    for (const row of existing.rows) {
      const filePath = path.join(uploadsDir, row.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/admin/students/:id/approve", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid student id" });
  }

  try {
    await ensureStudentsTable();
    const result = await pool.query(
      `
        UPDATE students
        SET status = 'approved'
        WHERE id = $1
        RETURNING id, name, mobile, email, course, status, created_at
      `,
      [id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "student not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/admin/students/approve-all", requireAdmin, async (_req, res) => {
  try {
    await ensureStudentsTable();
    const result = await pool.query(
      `
        UPDATE students
        SET status = 'approved'
        WHERE status IS DISTINCT FROM 'approved'
        RETURNING id, name, mobile, email, course, status, created_at
      `
    );

    res.json({
      approvedCount: result.rowCount,
      students: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/admin/students/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid student id" });
  }

  try {
    await ensureStudentsTable();
    const result = await pool.query("DELETE FROM students WHERE id = $1", [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: "student not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/admin/users", requireAdmin, async (req, res) => {
  try {
    await ensureStudentsTable();
    await ensureAdminsTable();

    await pool.query("DELETE FROM students");
    await pool.query("DELETE FROM admins");

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/admin/admins/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid admin id" });
  }

  try {
    await ensureAdminsTable();
    const result = await pool.query("DELETE FROM admins WHERE id = $1", [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: "admin not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/admin/users", requireAdmin, async (req, res) => {
  try {
    await ensureStudentsTable();
    await ensureAdminsTable();

    const students = await pool.query(
      `
        SELECT id, name, mobile, email, course, status, created_at
        FROM students
        ORDER BY id DESC
      `
    );

    const admins = await pool.query(
      `
        SELECT id, name, mobile, email, created_at
        FROM admins
        ORDER BY id DESC
      `
    );

    const users = [
      ...students.rows.map((row) => ({ ...row, role: "student" })),
      ...admins.rows.map((row) => ({ ...row, role: "admin", course: null, status: null })),
    ];

    users.sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/todos", async (_req, res) => {
  try {
    await ensureTable();
    const result = await pool.query("SELECT id, title, completed FROM todos ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/todos", async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }

  try {
    await ensureTable();
    const result = await pool.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING id, title, completed",
      [title.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/todos/:id/toggle", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      `
      UPDATE todos
      SET completed = NOT completed
      WHERE id = $1
      RETURNING id, title, completed
      `,
      [id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "todo not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/todos/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: "todo not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
