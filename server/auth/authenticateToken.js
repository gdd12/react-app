const pool = require("../database/db");

const authenticateToken = async (token) => {
  try {
    const tokenQuery = await pool.query(
      'SELECT token_expires_at FROM users WHERE token = $1',
      [token]
    );
    
    const isTokenValid = tokenQuery.rows[0]?.token_expires_at > new Date();
    return(isTokenValid)
  } catch (error) {
    console.log(error)
  }

}

module.exports = { authenticateToken }