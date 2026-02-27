-- Run this file using psql connected to the default postgres database.
-- PowerShell example:
-- $env:PGPASSWORD="5683"
-- psql -h localhost -p 8100 -U postgres -d postgres -f database/setup.sql

SELECT 'CREATE DATABASE mydatabase'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mydatabase')\gexec

\connect mydatabase

CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
