/*const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "5683",
  database: process.env.DB_NAME || "mydatabase",
});
pool.connect()
  .then(() => console.log("Database Connected"))
  .catch(err => console.error("Database Error:", err));

  

module.exports = pool;*/

require("dotenv").config();

console.log("ENV CHECK:", process.env.DATABASE_URL);

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ Database Error:", err));

module.exports = pool;
