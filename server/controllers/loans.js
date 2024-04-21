const express = require('express');
const pool = require("../database/db");
const logger = require('../logger');
const { authenticateToken } = require('../auth/authenticateToken')

const loans = express.Router();

loans.post('/add-loan', async (req, res) => {
  const { token, loan_type, loan_amount, interest_rate } = req.body;
  try {
    if (!token) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (!loan_type || !loan_amount || !interest_rate) {
      return res.status(400).json({ error: 'Bad request' });
    }
    if (!await authenticateToken(token)) { 
      return res.status(403).json({ error: 'Unauthorized' });
    }
  
    const result = await pool.query(
      'INSERT INTO loans (loan_type, loan_amount, interest_rate) VALUES ($1, $2, $3)',
      [loan_type, loan_amount, interest_rate]
    );
    return res.status(200).json({ success: true, message: 'Loan added successfully' });
  } catch (error) {
    console.error('Error adding loan:', error);
    return res.status(500).json({ error: 'Error adding loan' });
  }
});

module.exports = loans;


/**
const result = await pool.query(
  'INSERT INTO payments (loan_id, payment_date, payment_amount, principal_amount, interest_amount) VALUES ($1, $2, $3, $4, $5)',
  [loan_id, payment_date, payment_amount, principal_amount, interest_amount]
);
 */