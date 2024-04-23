import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';
import { AddLoan, GetLoans, RemoveLoan } from '../../components/Loans/Loans';
import { AddPayment, GetPayments, RemovePayment } from '../../components/Payments/Payments';
import './Loans.css'

const Loans = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [validToken, setValidToken] = useState(null);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const checkTokenValidity = async () => {
      setValidToken(await ValidateToken(token));
    };
    checkTokenValidity();
  }, [navigate]);

  useEffect(() => {
    if (validToken === false) navigate('/signin');
    else {
      getLoans()
      getPayments()
    }
  }, [validToken, navigate]);

  const getLoans = async () => {
    const loansData = await GetLoans(token);
    setLoans(loansData.data)
  }

  // const addLoan = async () => {
  //   await AddLoan();
  // }

  // const removeLoan = async () => {
  //   await RemoveLoan();
  // }

  // const addPayment = async () => {
  //   await AddPayment();
  // }

  const getPayments = async () => {
    const paymentsData = await GetPayments(token);
    setPayments(paymentsData.data);
  }

  // const removePayment = async () => {
  //   await RemoveLoan();
  // }

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
          { loans.length > 0 && loans.map((loan, index) => (
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
              {/* <button onClick={() => deleteLoanInformation(loan.loan_id)}>Delete Loan</button> */}
            </li>
          ))}
        </ul>
        <h2>Payments</h2>
        <ul className="payment-list">
          {payments.length > 0 && payments.map((payment, index) => (
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
