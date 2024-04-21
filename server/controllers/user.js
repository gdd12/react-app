const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require("../database/db");
const logger = require('../logger');
const defaultTokenExpiry = 30 * 60 * 1000 // 30 minutes for JWT
const config = require('config');
const { secretKey } = config

const user = express.Router();

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
      return res.status(403).json({ error: 'Incorrect username or password' });
    }

    const token = jwt.sign({ userId: userRecord.user_id }, secretKey, { expiresIn: '30m' });

    const expiryTime = new Date(Date.now() + defaultTokenExpiry);

    const updateQuery = {
      text: 'UPDATE users SET token = $1, token_expires_at = $2 WHERE user_id = $3',
      values: [token, expiryTime, userRecord.user_id]
    };

    await pool.query(updateQuery);
    logger.info('POST /signin: ', username, ' Signed in successfully')
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
      return res.status(404).json({ error: 'User does not have valid session' });
    }

    const updateQuery = {
      text: 'UPDATE users SET token = null, token_expires_at = null WHERE token = $1',
      values: [token]
    };

    await pool.query(updateQuery);
    logger.info('POST /logout: Logout successful')
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = user;
