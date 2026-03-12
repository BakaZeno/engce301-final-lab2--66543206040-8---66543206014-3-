import express from "express";
import { pool } from "../db/db.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

// GET /api/users/profile
router.get("/profile", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_profiles WHERE user_id=$1",
      [req.user.sub]
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/profile
router.put("/profile", async (req, res) => {
  const { display_name, bio, avatar_url } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, display_name, bio, avatar_url)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id)
       DO UPDATE SET
         display_name=$2,
         bio=$3,
         avatar_url=$4
       RETURNING *`,
      [req.user.sub, display_name, bio, avatar_url]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;