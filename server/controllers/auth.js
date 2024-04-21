const express = require('express');
const pool = require("../database/db");
const logger = require('../logger');

const auth = express.Router();

auth.post("/validate-token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Bad request' });
    }
    
    const query = {
      text: 'SELECT * FROM users WHERE token = $1',
      values: [token]
    };
    const result = await pool.query(query);
    const userRecord = result.rows[0];

    if (!userRecord) {
      return res.status(200).json({ error: 'No user/token combination' });
    }
    const tokenExpiresAt = new Date(userRecord.token_expires_at);
    if (!userRecord.token || tokenExpiresAt < new Date()) {
      return res.status(403).json({ error: 'User does not have valid session' });
    }
    logger.info('POST /validate-token: Validate Token successful')
    return res.status(200).json({ message: "Token is valid", token: userRecord.token, tokenValid: true })
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = auth;