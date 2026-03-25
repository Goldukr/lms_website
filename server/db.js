require("dotenv").config();
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:ratnakar@localhost:5432/lms_db";
console.log("ENV CHECK:", DATABASE_URL);

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ Database Error:", err));

module.exports = pool;
