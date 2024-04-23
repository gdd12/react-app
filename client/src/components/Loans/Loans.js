import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../config/default'

const AddLoan = async (token, requestData) => {
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');

  try {
    // Remove the request Data from here since this will have to be sent from the front-end page
    // const requestData = {
    //   loan_type: loanType,
    //   loan_amount: loanAmount,
    //   interest_rate: interestRate
    // }
    const responseData = await axios.post(
      `${config.api}/loans/add-loan`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {...requestData}
      }
    );
    setLoanType('');
    setLoanAmount('');
    setInterestRate('');
    alert('Loan added successfully!');
    return responseData;
    // May need to have return somewhere in here. Remove the state management and add it to the primary component?
  } catch (error) {
    console.error('Error adding loan:', error);
    return error;
  }
};

const GetLoans = async (token) => {
  try {
    const responseData = await axios.get(
      `${config.api}/loans/all-loans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return responseData
  } catch (error) {
    console.error('Error fetching loans:', error);
    return error;
  }
};

const RemoveLoan = async (token, loanId) => {
  try {
    const responseData = await axios.delete(
      `${config.api}/loans/loan/${loanId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return responseData;
  } catch (error) {
    console.error('Error removing loans:', error);
    return error;
  }
};

export { AddLoan, GetLoans, RemoveLoan };

