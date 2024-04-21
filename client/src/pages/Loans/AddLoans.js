import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';
import './Loans.css'
import axios from 'axios';


const AddLoans = () => {
  const navigate = useNavigate();
  const [loanId, setLoanId] = useState('');
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [validToken, setValidToken] = useState(null);

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
    }
  }, [validToken, navigate]);

  const token = sessionStorage.getItem('token');

  const handleLoanSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/v1/loans/add-loan', {
        token: token,
        loan_type: loanType,
        loan_amount: loanAmount,
        interest_rate: interestRate
      });
      console.log(response.data);
      setLoanType('');
      setLoanAmount('');
      setInterestRate('');
      alert('Loan added successfully!');
    } catch (error) {
      console.error('Error adding loan:', error);
    }
  };

  return (
    <div className="Loans">
      <SideNavigation />
      <div className="content">
        <p>Loans</p>
        <div className="form-container">
          <div>
            <h2>Add Loan</h2>
            <form onSubmit={handleLoanSubmit}>
              <label>
                Loan Type:
                <input type="text" value={loanType} onChange={(e) => setLoanType(e.target.value)} />
              </label>
              <label>
                Loan Amount:
                <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
              </label>
              <label>
                Interest Rate:
                <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
              </label>
              <button type="submit">Add Loan</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default AddLoans;
