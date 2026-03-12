-- ═══════════════════════════════════════════════
-- USERS TABLE (auth-service)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  DEFAULT 'member',
  created_at    TIMESTAMP    DEFAULT NOW(),
  last_login    TIMESTAMP
);

-- ═══════════════════════════════════════════════
-- TASKS TABLE (task-service)
-- ⚠️ ห้ามใช้ FK เพราะเป็นคนละ service DB
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER      NOT NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  DEFAULT 'TODO'
               CHECK (status IN ('TODO','IN_PROGRESS','DONE')),
  priority    VARCHAR(10)  DEFAULT 'medium'
               CHECK (priority IN ('low','medium','high')),
  created_at  TIMESTAMP    DEFAULT NOW(),
  updated_at  TIMESTAMP    DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- LOGS TABLE (log-service)
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS logs (
  id         SERIAL PRIMARY KEY,
  service    VARCHAR(50)  NOT NULL,
  level      VARCHAR(10)  NOT NULL
              CHECK (level IN ('INFO','WARN','ERROR')),
  event      VARCHAR(100) NOT NULL,
  user_id    INTEGER,
  ip_address VARCHAR(45),
  method     VARCHAR(10),
  path       VARCHAR(255),
  status_code INTEGER,
  message    TEXT,
  meta       JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index สำหรับ logs
CREATE INDEX IF NOT EXISTS idx_logs_service    ON logs(service);
CREATE INDEX IF NOT EXISTS idx_logs_level      ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);

-- ═══════════════════════════════════════════════
-- SEED USERS
-- ═══════════════════════════════════════════════
INSERT INTO users (username, email, password_hash, role) VALUES
(
 'alice',
 'alice@lab.local',
 '$2b$10$lYwLFHYKymqwR.KqzjnBzenGeJIw9NJgjNJ/YHmDh53WP6bPivNGy',
 'member'
),
(
 'bob',
 'bob@lab.local',
 '$2b$10$g4rcgyBYIMHWtnJiMPYyJucKl7EkWwWtRRjNwoui7tdV2y7AecwzK',
 'member'
),
(
 'admin',
 'admin@lab.local',
 '$2b$10$dUoUNhcHdQmsLzHCo5qyw.WsbEnjB3tGNqPCyHcmCSrymICYN.Ucm',
 'admin'
)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════
-- SEED TASKS
-- ═══════════════════════════════════════════════
INSERT INTO tasks (user_id,title,description,status,priority) VALUES
(1,'ออกแบบ UI หน้า Login','ใช้ Figma ออกแบบ mockup','TODO','high'),
(1,'เขียน API สำหรับ Task CRUD','Express.js + PostgreSQL','IN_PROGRESS','high'),
(2,'ทดสอบ JWT Authentication','ใช้ Postman ทดสอบทุก endpoint','TODO','medium'),
(3,'Deploy บน Railway','ทำ Final Lab ชุดที่ 2','TODO','medium')
ON CONFLICT DO NOTHING;