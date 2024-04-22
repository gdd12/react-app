import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';
import { SendRequest } from '../../helpers/SendRequest';


const Loans = () => {
  const navigate = useNavigate();
  const [validToken, setValidToken] = useState(null);
  const [loans, setLoans] = useState()
  const [payments, setPayments] = useState()

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
    } else {
      fetchLoanInformation(sessionStorage.getItem('token'));
    }
  }, [validToken, navigate]);

  const fetchLoanInformation = async (token) => {
    try {
      const loansResponse = await SendRequest('loans/loans', 'GET', {}, token)
      const paymentsResponse = await SendRequest('loans/loans', 'GET', {}, token)
      loansResponse.loans !== (null || undefined) ? setLoans(loansResponse.loans) : setLoans([])
      paymentsResponse.payments !== (null || undefined) ? setPayments(paymentsResponse.payments) : setPayments([])
    } catch (error) {
      console.error('Error adding loan:', error);
    }
  }
  return (
    <div className="Loan-container">
      <SideNavigation />
      <div className="content">
      <h2>Loans</h2>
      <ul>
        {loans && loans.map((loan, index) => (
          <li key={index}>
            Loan ID: {loan.loan_id}, Type: {loan.loan_type}, Amount: {loan.loan_amount}, Interest Rate: {loan.interest_rate}
          </li>
        ))}
      </ul>
      <h2>Payments</h2>
      <ul>
        {payments && payments.map((payment, index) => (
          <li key={index}>
            Payment ID: {payment.payment_id}, Amount: {payment.payment_amount}
          </li>
        ))}
      </ul>
      </div>
    </div>
  );  
};

export default Loans;
