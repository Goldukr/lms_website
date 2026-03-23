/*const express = require("express");
const cors = require("cors");
require("dotenv").config();

const apiRouter = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (_req, res) => {
  res.json({
    message: "Backend is running",
    endpoints: [
      "/api/health",
      "/api/todos",
      "/api/auth/signup",
      "/api/auth/signin",
      "/api/admin/students",
      "/api/admin/students/:id/approve",
      "/api/admin/students/:id",
      "/api/admin/admins/:id",
      "/api/profile",
      "/api/admin/notes",
      "/api/notes",
      "/api/admin/notes/:id",
      "/api/admin/users",
    ],
  });
});

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});