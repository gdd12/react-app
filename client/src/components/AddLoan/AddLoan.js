import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ValidateToken from '../../helpers/ValidateToken';
import { AddLoan } from '../../helpers/Loans';

const AddLoanComponent = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [validToken, setValidToken] = useState(null);
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');

  useEffect(() => {
    const checkTokenValidity = async () => {
      setValidToken(await ValidateToken(token));
    };
    checkTokenValidity();
  }, [token]);

  useEffect(() => {
    if (validToken === false) navigate('/signin');
    else {/** Init functions run here */}
  }, [validToken, navigate]);

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
  };

  return (
    <>
    <Navigation />
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
      </div>
    </>
  );
};

export default AddLoanComponent;
