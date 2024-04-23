import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../config/default'

const AddPayment = async (token, requestData) => {
  const [loanId, setLoanId] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestAmount, setInterestAmount] = useState('');


  /**
   need to send the following from the front end: 

      loan_id: loanId,
      payment_date: paymentDate,
      payment_amount: paymentAmount,
      principal_amount: principalAmount,
      interest_amount: interestAmount

  */
  try {
    const responseData = await axios.post(
      `${config.api}/payments/add-payment`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: {...requestData}
      }
    );
    return responseData;
  } catch (error) {
    console.error('Error adding payment', error);
    return error;
  };
};

const GetPayments = async (token) => {
  try {
    const responseData = await axios.get(
      `${config.api}/payments/all-payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return responseData
  } catch (error) {
    console.error('Error fetching payments', error);
    return error;
  }
};

const RemovePayment = async (token, requestData) => {

};

export { AddPayment, GetPayments, RemovePayment };