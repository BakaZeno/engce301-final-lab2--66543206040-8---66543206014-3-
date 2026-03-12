import pkg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "init.sql"),
      "utf8"
    );

    await pool.query(sql);

    console.log("[task-db] Tables initialized");
  } catch (err) {
    console.error("[task-db] Init error:", err.message);
  }
}

export { pool, initDB };