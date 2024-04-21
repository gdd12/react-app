import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';
import { SendRequest } from '../../helpers/SendRequest';

const AddLoans = () => {
  const navigate = useNavigate();
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

  const handleLoanSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      const response = await SendRequest('/loans/add-loan', 'POST', {
        loan_type: loanType,
        loan_amount: loanAmount,
        interest_rate: interestRate
      }, token);
      console.log(response)
      setLoanType('');
      setLoanAmount('');
      setInterestRate('');
      alert('Loan added successfully!');
    } catch (error) {
      console.error('Error adding loan:', error);
      alert('Failed to add loan. Please try again later.');
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
