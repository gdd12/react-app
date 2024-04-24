const express = require('express');
const pool = require("../database/db");
const logger = require('../logger');
const authenticateToken = require('../auth/authenticateToken')

const loans = express.Router();

loans.post('/add-loan', authenticateToken, async (req, res) => {
  const { loan_type, loan_amount, interest_rate } = req.body;
  try {
    if (!loan_type || !loan_amount || !interest_rate) {
      return res.status(400).json({ error: 'Bad request' });
    };

    const result = await pool.query(
      'INSERT INTO loans (loan_type, loan_amount, interest_rate) VALUES ($1, $2, $3)',
      [loan_type, loan_amount, interest_rate]
    );
    logger.info('POST /add-loan: Loans added successfully')
    return res.status(200).json({ success: true, message: 'Loan added successfully' });
  } catch (error) {
    logger.error('POST /add-loan:', error);
    return res.status(500).json({ error: 'Error adding loan' });
  };
});

loans.get('/all-loans', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loans');
    logger.info('GET /all-loans: Fetched loans successfully')
    return res.status(200).json(result.rows);
  } catch (error) {
    logger.error('GET /loans:', error);
    return res.status(500).json({ error: 'Error fetching loans' });
  }
});

loans.delete('/loan/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'DELETE FROM loans WHERE loan_id = $1',
      [id]
    );
    logger.info('DELETE /loan/:id: Loan deleted successfully')
    return res.status(200).json({ success: true, message: 'Loan deleted successfully' });
  } catch (error) {
    logger.error('DELETE /loan/:id:', error);
    return res.status(500).json({ error: error.detail });
  }
});

module.exports = loans;
