const express = require('express');
const logger = require('../logger');

const authenticateToken = require('../auth/authenticateToken')

const auth = express.Router();

auth.post("/validate-token", authenticateToken, async (req, res) => {
  try {
    logger.info('POST /validate-token: Token is valid')
    return res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    logger.error("POST /validate-token: Token is invalid", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = auth;
