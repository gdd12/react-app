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

loans.post('/add-payment', authenticateToken, async (req, res) => {
  const { loan_id, payment_date, payment_amount, principal_amount, interest_amount } = req.body;
  try {
    if (!loan_id || !payment_date || !payment_amount || !principal_amount || !interest_amount) {
      return res.status(400).json({ error: 'Bad request' });
    };

    const result = await pool.query(
      'INSERT INTO payments (loan_id, payment_date, payment_amount, principal_amount, interest_amount) VALUES ($1, $2, $3, $4, $5)',
      [loan_id, payment_date, payment_amount, principal_amount, interest_amount]
    );
    logger.info('POST /add-payment: Payment added successfully')
    return res.status(200).json({ success: true, message: 'Payment added successfully' });
  } catch (error) {
    logger.error('POST /add-payment:', error);
    return res.status(500).json({ error: 'Error adding payment' });
  };
});

loans.get('/loans', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loans');
    logger.info('GET /loans: Fetched loans successfully')
    return res.status(200).json({ success: true, loans: result.rows });
  } catch (error) {
    logger.error('GET /loans:', error);
    return res.status(500).json({ error: 'Error fetching loans' });
  }
});

loans.get('/payments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments');
    logger.info('GET /payments: Fetched loans successfully')
    return res.status(200).json({ success: true, payments: result.rows });
  } catch (error) {
    logger.error('GET /payments:', error);
    return res.status(500).json({ error: 'Error fetching payments' });
  }
});

module.exports = loans;
