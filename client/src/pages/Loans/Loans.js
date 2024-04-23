import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ValidateToken from '../../helpers/ValidateToken';
import { AddLoan, GetLoans, RemoveLoan } from '../../components/Loans/Loans';
import { AddPayment, GetPayments, RemovePayment } from '../../components/Payments/Payments';
import './Loans.css';

const Loans = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [validToken, setValidToken] = useState(null);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanId, setLoanId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestAmount, setInterestAmount] = useState('');

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

  const addLoan = async (event) => {
    event.preventDefault();

    const requestData = {
      loan_type: loanType,
      loan_amount: loanAmount,
      interest_rate: interestRate
    };
    const addLoanData = await AddLoan(sessionStorage.getItem('token'), requestData);
    if (addLoanData.response && addLoanData.response.status !== 200) {
      return alert(`Error ${addLoanData.response.status} ${addLoanData.response.data.error}`)
    };
    setLoanType('');
    setLoanAmount('');
    setInterestRate('');
    await getLoans();
  }

  const removeLoan = async (loanId) => {
    if (window.confirm("Are you sure you want to remove this loan?")) {
      const removedLoanData = await RemoveLoan(token, loanId);
      if (removedLoanData.response && removedLoanData.response.status !== 200) {
        return alert(`Error ${removedLoanData.response.status} ${removedLoanData.response.data.error}`)
      };
      await getLoans();
    };
  };

  const addPayment = async (event) => {
    event.preventDefault();

    const requestData = {
      loan_id: loanId,
      payment_date: paymentDate,
      payment_amount: paymentAmount,
      principal_amount: principalAmount,
      interest_amount: interestAmount
    }

    const addPaymentData = await AddPayment(sessionStorage.getItem('token'), requestData);
    if (addPaymentData.response && addPaymentData.response.status !== 200) {
      return alert(`Error ${addPaymentData.response.status} ${addPaymentData.response.data.error}`)
    };
    setLoanId('');
    setPaymentDate('');
    setPaymentAmount('');
    setPrincipalAmount('');
    setInterestAmount('');
    await getPayments();
  }

  const getPayments = async () => {
    const paymentsData = await GetPayments(token);
    setPayments(paymentsData.data);
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
      <div className="content-container">
        <div className="loan-content">
          <h2>Loans</h2>
          <div className="form-container">
            <form onSubmit={addLoan}>
              <label>Loan Type:<input type="text" value={loanType} onChange={(e) => setLoanType(e.target.value)} /></label>
              <label>Loan Amount:<input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} /></label>
              <label>Interest Rate:<input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} /></label>
              <button type="submit">Add Loan</button>
            </form>
          </div>
          <ul className="loan-list">
            {loans.length > 0 && loans.map((loan, index) => (
              <li key={index} className="loan-item">
                <div><strong>{loan.loan_type}</strong></div>
                <div><strong>Amount:</strong>${loan.loan_amount}</div>
                <div><strong>Interest Rate:</strong>{loan.interest_rate}%</div>
                <button onClick={() => removeLoan(loan.loan_id)}>Delete Loan</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="payment-content">
          <h2>Payments</h2>
          <div className="form-container">
            <form onSubmit={addPayment}>
              <label>Loan ID:<input type="text" value={loanId} onChange={(e) => setLoanId(e.target.value)} /></label>
              <label>Payment Date:<input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} /></label>
              <label>Payment Amount:<input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} /></label>
              <label>Principal Amount:<input type="number" value={principalAmount} onChange={(e) => setPrincipalAmount(e.target.value)} /></label>
              <label>Interest Amount:<input type="number" value={interestAmount} onChange={(e) => setInterestAmount(e.target.value)} /></label>
              <button type="submit">Add Payment</button>
            </form>
          </div>
          <ul className="payment-list">
            {payments.length > 0 && payments.map((payment, index) => (
              <li key={index} className="payment-item">
                <div><strong>Payment ID:</strong> {payment.payment_id}</div>
                <div><strong>Loan:</strong> {payment.loan_id}</div>
                <div><strong>Amount:</strong> ${payment.payment_amount}</div>
                <div><strong>Date:</strong> {formatDate(payment.payment_date)}</div>
                <div><strong>Principal:</strong> {payment.principal_amount}</div>
                <div><strong>Interest:</strong> {payment.interest_amount}</div>
                <button onClick={() => removePayment(payment.payment_id)}>Delete Payment</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Loans;
