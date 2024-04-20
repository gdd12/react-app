const express = require('express');
const payments = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require("../database/db");
const logger = require('../logger');

payments.post("/payments", async (req, res) => {
  const { token, loan_id, payment_date, payment_amount, principal_amount, interest_amount } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO payments (loan_id, payment_date, payment_amount, principal_amount, interest_amount) VALUES ($1, $2, $3, $4, $5)',
      [loan_id, payment_date, payment_amount, principal_amount, interest_amount]
    );
    res.status(200).json({ success: true, message: 'Payment added successfully' });
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

payments.get("/payments", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments');
    res.status(200).json({ success: true, payments: result.rows });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
})

module.exports = payments;
