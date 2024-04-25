import React, { useState, useCallback, useEffect } from 'react';
import { AddPayment } from '../../helpers/Payments';
import { GetLoans } from '../../helpers/Loans';
import './AddPayment.css'

const AddPaymentComponent = ({ onPaymentAdded, onCancel }) => {
  const [loanId, setLoanId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestAmount, setInterestAmount] = useState('');
  const [loanNames, setLoanNames] = useState([]);

  const fetchLoanNames = useCallback(async () => {
    try {
      const response = await GetLoans(sessionStorage.getItem('token'));
      setLoanNames(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  }, []);

  useEffect(() => {
    fetchLoanNames();
  }, [fetchLoanNames]);

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
    onPaymentAdded();
    setLoanId('');
    setPaymentDate('');
    setPaymentAmount('');
    setPrincipalAmount('');
    setInterestAmount('');
  };

  return (
    <div className="add-payment-content">
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
          <label>Total Amount:
            <input type="number" value={paymentAmount} onChange={(e) => {
              const totalAmount = parseFloat(e.target.value);
              const principal = parseFloat(principalAmount);

              if (!isNaN(totalAmount) && !isNaN(principal)) {
                setInterestAmount((totalAmount - principal).toFixed(2));
              }
              setPaymentAmount(totalAmount);
            }} />
          </label>
          <label>Principal Amount:
            <input type="number" value={principalAmount} onChange={(e) => {
              const principal = parseFloat(e.target.value);
              const totalAmount = parseFloat(paymentAmount);

              if (!isNaN(totalAmount) && !isNaN(principal)) {
                setInterestAmount((totalAmount - principal).toFixed(2));
              }
              setPrincipalAmount(principal);
            }} />
          </label>
          <label>Interest Amount:
            <input type="number" value={interestAmount} onChange={(e) => {
              const interest = parseFloat(e.target.value);
              const totalAmount = parseFloat(paymentAmount);
              const principal = parseFloat(principalAmount);

              if (!isNaN(totalAmount) && !isNaN(principal) && !isNaN(interest)) {
                setInterestAmount((totalAmount - principal).toFixed(2));
              }
            }} />
          </label>
          <button type="submit" onClick={onPaymentAdded}>Add Payment</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

export default AddPaymentComponent;
