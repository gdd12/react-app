const express = require('express');
const user = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require("../database/db");

user.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    };
    const result = await pool.query(query);
    const userRecord = result.rows[0];

    if (!userRecord || userRecord.password !== password) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    const token = jwt.sign({ userId: userRecord.user_id }, 'your_secret_key', { expiresIn: '30m' });

    const expiryTime = new Date(Date.now() + 30 * 60 * 1000);

    const updateQuery = {
      text: 'UPDATE users SET token = $1, token_expires_at = $2 WHERE user_id = $3',
      values: [token, expiryTime, userRecord.user_id]
    };

    await pool.query(updateQuery);

    return res.status(200).json({ message: 'Sign-in successful', token, expiry: expiryTime });
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

user.post("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    const query = {
      text: 'SELECT * FROM users WHERE token = $1',
      values: [token]
    };
    const result = await pool.query(query);
    const userRecord = result.rows[0];

    if (!userRecord) {
      return res.status(200).json({ error: 'User does not have valid session' });
    }

    const updateQuery = {
      text: 'UPDATE users SET token = null, token_expires_at = null WHERE token = $1',
      values: [token]
    };

    await pool.query(updateQuery);

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

user.post("/validate-token", async (req, res) => {
  try {
    const { token } = req.body;
    const query = {
      text: 'SELECT * FROM users WHERE token = $1',
      values: [token]
    };
    const result = await pool.query(query);
    const userRecord = result.rows[0];

    if (!userRecord) {
      return res.status(400).json({ error: 'No user/token combination' });
    }
    const tokenExpiresAt = new Date(userRecord.token_expires_at);
    if (!userRecord.token || tokenExpiresAt < new Date()) {
      return res.status(403).json({ error: 'User does not have valid session' });
    }
    return res.status(200).json({ message: "Token is valid", token: userRecord.token })
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = user;
