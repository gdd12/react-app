import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import ValidateToken from '../../helpers/ValidateToken';
import { AddPayment } from '../../helpers/Payments';

const AddPaymentComponent = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [validToken, setValidToken] = useState(null);
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
  }, [token]);

  useEffect(() => {
    if (validToken === false) navigate('/signin');
    else {
      /** Init functions run here */

      // Going to want to hit the DB to fetch all loans and make a dropdown menu for adding payments
    }
  }, [validToken, navigate]);

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
    alert(addPaymentData.data.message)
    setLoanId('');
    setPaymentDate('');
    setPaymentAmount('');
    setPrincipalAmount('');
    setInterestAmount('');
  };

  return (
    <>
      <Navigation/>
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
      </div>
    </>
  );
};

export default AddPaymentComponent;
