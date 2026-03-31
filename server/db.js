require("dotenv").config();

const { Pool } = require("pg");
const { URL } = require("url");

function normalizeDatabaseUrl(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) {
    return "postgresql://postgres:5683@localhost:5432/mydatabase";
  }

  return value.startsWith("DATABASE_URL=") ? value.slice("DATABASE_URL=".length).trim() : value;
}

const DATABASE_URL = normalizeDatabaseUrl(process.env.DATABASE_URL);

function getPoolConfig(connectionString) {
  const config = { connectionString };

  try {
    const parsed = new URL(connectionString);
    const host = parsed.hostname || "";
    const isLocalhost = host === "localhost" || host === "127.0.0.1";

    if (!isLocalhost) {
      config.ssl = {
        rejectUnauthorized: false,
      };
    }
  } catch (_error) {
    config.ssl = {
      rejectUnauthorized: false,
    };
  }

  return config;
}

const pool = new Pool(getPoolConfig(DATABASE_URL));

pool.connect()
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ Database Error:", err));

module.exports = pool;
