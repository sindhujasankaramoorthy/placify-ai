import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

let dbInstance: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (!dbInstance) {
    const dbPath = path.resolve(process.cwd(), "sql_app.db");
    dbInstance = new DatabaseSync(dbPath);

    // Initialize required tables
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        hashed_password TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        is_superuser INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT DEFAULT 'Untitled Resume',
        template_id TEXT DEFAULT 'modern',
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS ats_scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL DEFAULT 1,
        job_description TEXT NOT NULL,
        result_json TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Ensure default user exists
    try {
      const userCheck = dbInstance.prepare("SELECT id FROM users WHERE id = 1").get();
      if (!userCheck) {
        dbInstance.prepare(`
          INSERT INTO users (id, email, full_name, hashed_password)
          VALUES (1, 'student@placify.ai', 'Sindhuja Sankaramoorthy', 'default_dev_hash')
        `).run();
      }
    } catch (e) {
      console.warn("[ATS DB] User check note:", e);
    }
  }
  return dbInstance;
}

export interface ATSHistoryItem {
  id: number;
  userId: number;
  jobDescription: string;
  result: any;
  createdAt: string;
}

export function saveScanToDb(userId: number, jobDescription: string, result: any): number {
  const db = getDb();
  let targetUserId = userId || 1;
  try {
    const userExists = db.prepare("SELECT id FROM users WHERE id = ?").get(targetUserId);
    if (!userExists) {
      targetUserId = 1;
    }
  } catch {
    targetUserId = 1;
  }
  const stmt = db.prepare(`
    INSERT INTO ats_scans (user_id, job_description, result_json, created_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `);
  const info = stmt.run(targetUserId, jobDescription, JSON.stringify(result));
  return Number(info.lastInsertRowid);
}

export function getScanHistoryFromDb(userId: number = 1, limit: number = 10): ATSHistoryItem[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, user_id, job_description, result_json, created_at
    FROM ats_scans
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT ?
  `);
  const rows = stmt.all(userId, limit) as any[];

  return rows.map((r) => {
    let parsedResult: any = {};
    try {
      parsedResult = JSON.parse(r.result_json);
    } catch {
      parsedResult = {};
    }
    return {
      id: Number(r.id),
      userId: Number(r.user_id),
      jobDescription: r.job_description,
      result: parsedResult,
      createdAt: r.created_at,
    };
  });
}

export function getLatestResumeFromDb(userId: number = 1): any | null {
  const db = getDb();
  try {
    const stmt = db.prepare(`
      SELECT id, title, content, updated_at
      FROM resumes
      WHERE user_id = ?
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
    `);
    const row = stmt.get(userId) as any;
    if (!row) return null;
    let content = row.content;
    if (typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch {
        // raw text
      }
    }
    return {
      id: row.id,
      title: row.title,
      content,
      updatedAt: row.updated_at,
    };
  } catch (err) {
    console.error("[ATS DB] getLatestResumeFromDb error:", err);
    return null;
  }
}
