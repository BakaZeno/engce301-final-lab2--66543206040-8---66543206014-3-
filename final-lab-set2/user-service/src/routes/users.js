const express = require('express');
const { pool } = require('../db/db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();


// ===============================
// Health check
// GET /api/users/health
// ===============================
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'user-service'
  });
});


// ===============================
// GET /api/users/profile
// ดู profile ของตัวเอง (T6)
// ===============================
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [req.user.sub]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: 'ไม่พบข้อมูล profile'
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error('[USER] profile error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// ===============================
// PUT /api/users/profile
// แก้ไข profile (T7)
// ===============================
router.put('/profile', requireAuth, async (req, res) => {
  const { display_name, bio, avatar_url } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, display_name, bio, avatar_url)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id)
       DO UPDATE SET
         display_name = EXCLUDED.display_name,
         bio = EXCLUDED.bio,
         avatar_url = EXCLUDED.avatar_url
       RETURNING *`,
      [req.user.sub, display_name, bio, avatar_url]
    );

    res.json({
      message: 'Profile updated',
      profile: result.rows[0]
    });

  } catch (err) {
    console.error('[USER] update profile error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// ===============================
// GET /api/users
// ดู users ทั้งหมด (admin)
// ===============================
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT user_id, display_name, bio, avatar_url, updated_at
       FROM user_profiles
       ORDER BY updated_at DESC`
    );

    res.json({
      users: result.rows,
      total: result.rowCount
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;