import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';
import axios from 'axios';


const Loans = () => {
  const navigate = useNavigate();
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
    } else {
      fetchLoanInformation(sessionStorage.getItem('token'));
    }
  }, [validToken, navigate]);

  const fetchLoanInformation = async (token) => {
    try {
      const paymentsResponse = await axios.get('http://localhost:3000/api/v1/loans/payments', {
        data: {
          token: token
        }
      });
      // const loansResponse = await axios.get('http://localhost:3000/api/v1/loans/loans', {
      //   token: token
      // });

      console.log("payments",paymentsResponse)
      // console.log("loans", loansResponse)
    } catch (error) {
      console.error('Error adding loan:', error);
    }
  }
  return (
    <div className="Loan-container">
      <SideNavigation />
      <div className="content">
        
      </div>
    </div>
  );  
};

export default Loans;
