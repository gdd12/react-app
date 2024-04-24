import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ValidateToken from '../../helpers/ValidateToken';
import { GetLoans, RemoveLoan } from '../../helpers/Loans';
import { GetPayments, RemovePayment } from '../../helpers/Payments';
import './Loans.css';

const Loans = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [validToken, setValidToken] = useState(null);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);

  const getLoans = useCallback(async () => {
    const loansData = await GetLoans(token);
    setLoans(loansData.data)
  }, [token]);

  const getPayments = useCallback(async () => {
    const paymentsData = await GetPayments(token);
    setPayments(paymentsData.data);
  }, [token]);

  useEffect(() => {
    const checkTokenValidity = async () => {
      setValidToken(await ValidateToken(token));
    };
    checkTokenValidity();
  }, [token]);

  useEffect(() => {
    if (validToken === false) navigate('/signin');
    else {
      getLoans()
      getPayments()
    }
  }, [validToken, navigate, getLoans, getPayments]);

  const removeLoan = async (loanId) => {
    if (window.confirm("Are you sure you want to remove this loan?")) {
      const removedLoanData = await RemoveLoan(token, loanId);
      if (removedLoanData.response && removedLoanData.response.status !== 200) {
        return alert(`Error ${removedLoanData.response.status} ${removedLoanData.response.data.error}`)
      };
      await getLoans();
    };
  };

  const removePayment = async (paymentId) => {
    if (window.confirm("Are you sure you want to remove this payment?")) {
      const removePaymentData = await RemovePayment(token, paymentId);
      if (removePaymentData.response && removePaymentData.response.status !== 200) {
        alert(`Error ${removePaymentData.response.status} ${removePaymentData.response.data.error}`)
      } else {
        await getPayments();
      };
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Navigation />
      <div className="loan-content-container">
        <div className="loan-content">
          <h2>Loans</h2>
          <ul className="loan-list">
            {loans.length > 0 && loans.map((loan, index) => (
              <li key={index} className="loan-item">
                <div className="loan-details">
                  <div><strong>{loan.loan_type}</strong></div>
                  <div><strong>Amount:</strong> ${loan.loan_amount}</div>
                  <div><strong>APR:</strong> {loan.interest_rate}%</div>
                </div>
                <div className="loan-actions">
                  <button onClick={() => removeLoan(loan.loan_id)}>Delete Loan</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="payment-content">
          <h2>Payments</h2>
          <table className="payment-table">
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td><strong>Loan:</strong> {payment.loan_type}</td>
                  <td><strong>Amount:</strong> ${payment.payment_amount}</td>
                  <td><strong>Date:</strong> {formatDate(payment.payment_date)}</td>
                  <td><strong>Principal:</strong> ${payment.principal_amount}</td>
                  <td><strong>Interest:</strong> ${payment.interest_amount}</td>
                  <td><button onClick={() => removePayment(payment.payment_id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Loans;
