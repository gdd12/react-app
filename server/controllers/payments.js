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

payments.get('/payment/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(`
      SELECT payments.payment_id, payments.loan_id, payments.payment_date, payments.payment_amount, payments.principal_amount, payments.interest_amount, loans.loan_type
      FROM payments
      JOIN loans ON payments.loan_id = loans.loan_id
      WHERE payments.payment_id = $1;
    `, [id]);
    logger.info('GET /payment/:id: Fetched payment successfully')
    return res.status(200).json(result.rows);
  } catch (error) {
    logger.error('GET /payments/:id:', error);
    return res.status(500).json({ error: 'Error fetching payment' });
  }
});

payments.get('/all-payments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT payments.payment_id, payments.payment_date, payments.payment_amount, payments.principal_amount, payments.interest_amount, loans.loan_type
      FROM payments
      JOIN loans ON payments.loan_id = loans.loan_id
    `);
    logger.info('GET /payments: Fetched payments successfully')
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
    return res.status(500).json({ error: error.detail });
  };
});

payments.put('/edit-payment/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { payment_id, loan_id, payment_date, payment_amount, principal_amount, interest_amount } = req.body;
  try {
    const result = await pool.query(`
      UPDATE payments
      SET loan_id = $1, payment_date = $2, payment_amount = $3, principal_amount = $4, interest_amount = $5
      WHERE payment_id = $6
      `,[loan_id, payment_date, payment_amount, principal_amount, interest_amount, id]
    )
    logger.info('PUT /edit-payment/:id: Payment edited successfully');
    return res.status(200).json({ success: true, message: 'Payment edited successfully' });
  } catch (error) {
    logger.error('PUT /edit-payment/:id:', error);
    return res.status(500).json({ error: error.detail });    
  }
});

module.exports = payments;
