const express = require('express');
const pool = require("../database/db");
const logger = require('../logger');
const authenticateToken = require('../auth/authenticateToken')

const payments = express.Router();

payments.post('/add-payment', authenticateToken, async (req, res) => {
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

payments.get('/all-payments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments');
    logger.info('GET /payments: Fetched loans successfully')
    return res.status(200).json(result.rows);
  } catch (error) {
    logger.error('GET /payments:', error);
    return res.status(500).json({ error: 'Error fetching payments' });
  }
});

payments.delete('/payment/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('DELETE FROM payments WHERE payment_id = $1',
      [id]
    );
    logger.info('DELETE /payment/:id: Payment deleted successfully');
    return res.status(200).json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    logger.error('DELETE /payment/:id:', error);
    console.log(error)
    return res.status(500).json({ error: error.detail });
  };
});

module.exports = payments;
