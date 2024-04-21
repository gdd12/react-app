const jwt = require('jsonwebtoken');
const pool = require("../database/db");
const config = require('config');
const { secretKey } = config

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  };

  try {
    const decoded = jwt.verify(token, secretKey);
    const tokenQuery = await pool.query(
      'SELECT token_expires_at FROM users WHERE token = $1',
      [token]
    );

    const isTokenValid = tokenQuery.rows[0]?.token_expires_at > new Date();

    if (!isTokenValid || !decoded) {
      return res.status(401).json({ message: 'Unauthorized.' });
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  };
};

module.exports = authenticateToken;
