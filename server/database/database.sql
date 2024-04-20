CREATE DATABASE react

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(50) NOT NULL,
  token TEXT,
  token_expires_at TIMESTAMP
);

CREATE TABLE loans(
  loan_id SERIAL PRIMARY KEY,
  loan_type VARCHAR(50) NOT NULL,
  loan_amount DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL
);

CREATE TABLE payments(
  payment_id SERIAL PRIMARY KEY,
  loan_id INT REFERENCES loans(loan_id),
  payment_date DATE NOT NULL,
  payment_amount DECIMAL(15, 2) NOT NULL,
  principal_amount DECIMAL(15, 2) NOT NULL,
  interest_amount DECIMAL(15, 2) NOT NULL
);
