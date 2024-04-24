import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import ValidateToken from '../../helpers/ValidateToken';
import { AddPayment } from '../../helpers/Payments';
import { GetLoans, AddLoan } from '../../helpers/Loans';
import './AddLoanInfo.css'

const AddLoanInfo = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [validToken, setValidToken] = useState(null);
/* For Payments */
  const [loanId, setLoanId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestAmount, setInterestAmount] = useState('');
  const [loanNames, setLoanNames] = useState([]);
/* For Loans */
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');

  const fetchLoanNames = useCallback(async () => {
    try {
      const response = await GetLoans(token);
      setLoanNames(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
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
      fetchLoanNames();
    }
  }, [validToken, navigate, token, fetchLoanNames]);

  const addPayment = async (event) => {
    event.preventDefault();

    const requestData = {
      loan_id: loanId,
      payment_date: paymentDate,
      payment_amount: paymentAmount,
      principal_amount: principalAmount,
      interest_amount: interestAmount
    };

    const addPaymentData = await AddPayment(sessionStorage.getItem('token'), requestData);
    if (addPaymentData.response && addPaymentData.response.status !== 200) {
      return alert(`Error ${addPaymentData.response.status} ${addPaymentData.response.data.error}`);
    }
    alert(addPaymentData.data.message);
    setLoanId('');
    setPaymentDate('');
    setPaymentAmount('');
    setPrincipalAmount('');
    setInterestAmount('');
  };

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
    alert(addLoanData.data.message)
    setLoanType('');
    setLoanAmount('');
    setInterestRate('');
    fetchLoanNames();
  };

  return (
    <>
      <Navigation />
      <div className="add-payment-content">
        <h2>Add Payment</h2>
        <div className="form-container">
          <form onSubmit={addPayment}>
            <label>
              Select Loan:
              <select value={loanId} onChange={(e) => setLoanId(e.target.value)}>
                <option value="">Select Loan Type</option>
                {loanNames.map((loan) => (
                  <option key={loan.loan_id} value={loan.loan_id}>
                    {loan.loan_type}
                  </option>
                ))}
              </select>
            </label>
            <label>Payment Date:<input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} /></label>
            <label>Total Amount:<input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} /></label>
            <label>Principal Amount:<input type="number" value={principalAmount} onChange={(e) => setPrincipalAmount(e.target.value)} /></label>
            <label>Interest Amount:<input type="number" value={interestAmount} onChange={(e) => setInterestAmount(e.target.value)} /></label>
            <button type="submit">Add Payment</button>
          </form>
        </div>
      </div>
      <div className="add-loan-content">
        <h2>Loans</h2>
        <div className="form-container">
          <form onSubmit={addLoan}>
            <label>Loan Type:<input type="text" value={loanType} onChange={(e) => setLoanType(e.target.value)} /></label>
            <label>Loan Amount:<input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} /></label>
            <label>Interest Rate:<input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} /></label>
            <button type="submit">Add Loan</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddLoanInfo;
