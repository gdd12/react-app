import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';
import axios from 'axios';
import './Loans.css'
import { config } from '../../config/default';

const Loans = () => {
  const navigate = useNavigate();
  const [validToken, setValidToken] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    const checkTokenValidity = async () => {
      const isValid = await ValidateToken(token);
      setValidToken(isValid);
    };

    checkTokenValidity();
  }, [navigate]);

  useEffect(() => {
    if (validToken === false) {
      navigate('/signin');
    } else {
      fetchLoanInformation(sessionStorage.getItem('token'));
      fetchPaymentInformation(sessionStorage.getItem('token'));
    }
  }, [validToken, navigate]);

  const fetchLoanInformation = async (token) => {
    try {
      const loansResponse = await axios.get(
        `${config.api}/loans/all-loans`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      setLoans(loansResponse.data.loans)
    } catch (error) {
      console.error('Error fetching loan information:', error);
    }
  };

  const fetchPaymentInformation = async (token) => {
    const paymentsResponse = await axios.get(
      `${config.api}/payments/all-payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    setPayments(paymentsResponse.data.payments)
  }
  
  const deleteLoanInformation = async (loanId) => {
    try {
      const token = sessionStorage.getItem('token')
      const deletedLoan = await axios.delete(
        `${config.api}/loans/loan/${loanId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
    } catch (error) {
      if (error.response.status === 401) {
        alert(error.response.statusText)
        navigate('/signin')
      }
      if (error.response.status === 500) {
        alert(`Error: ${error.response.data.error}`)
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="Loan-container">
      <SideNavigation />
      <div className="content">
        <h2>Loans</h2>
        <ul className="loan-list">
          { loans && loans.map((loan, index) => (
            <li key={index} className="loan-item">
              <div>
                <strong>{loan.loan_type}</strong>
              </div>
              <div>
                <strong>Amount:</strong>${loan.loan_amount}
              </div>
              <div>
                <strong>Interest Rate:</strong>{loan.interest_rate}%
              </div>
              <button onClick={() => deleteLoanInformation(loan.loan_id)}>Delete Loan</button>
            </li>
          ))}
        </ul>
        <h2>Payments</h2>
        <ul className="payment-list">
          {payments && payments.map((payment, index) => (
            <li key={index} className="payment-item">
              <div><strong>Payment ID:</strong> {payment.payment_id}</div>
              <div><strong>Loan:</strong> {payment.loan_id}</div>
              <div><strong>Amount:</strong> ${payment.payment_amount}</div>
              <div><strong>Date:</strong> {formatDate(payment.payment_date)}</div>
              <div><strong>Principle</strong> {payment.principal_amount}</div>
              <div><strong>Interest</strong> {payment.interest_amount}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Loans;
