import React, { useState } from 'react';
import { AddLoan } from '../../helpers/Loans';
import './AddLoan.css';

const AddLoanComponent = ({ onLoanAdded, onCancel }) => {
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');

  const addLoan = async (event) => {
    event.preventDefault();

    const requestData = {
      loan_type: loanType,
      loan_amount: loanAmount,
      interest_rate: interestRate
    };

    const addLoanData = await AddLoan(sessionStorage.getItem('token'), requestData);
    if (addLoanData.response && addLoanData.response.status !== 200) {
      return alert(`Error ${addLoanData.response.status} ${addLoanData.response.data.error}`);
    }

    // alert(addLoanData.data.message);

    onLoanAdded();

    setLoanType('');
    setLoanAmount('');
    setInterestRate('');
  };

  return (
    <div className="add-loan-content">
      <form onSubmit={addLoan}>
        <label>Loan Name:<input type="text" value={loanType} onChange={(e) => setLoanType(e.target.value)} /></label>
        <label>Loan Amount:<input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} /></label>
        <label>Interest Rate:<input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} /></label>
        <button type="submit">Add Loan</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default AddLoanComponent;
