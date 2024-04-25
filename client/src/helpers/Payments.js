import { config } from '../config/default';
import axios from 'axios';

const AddPayment = async (token, requestData) => {
  try {
    const responseData = await axios.post(
      `${config.api}/payments/add-payment`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return responseData;
  } catch (error) {
    console.error('Error adding payment', error);
    return error;
  };
};

const GetPayment = async (token, paymentId) => {
  try {
    const responseData = await axios.get(
      `${config.api}/payments/payment/${paymentId}`, {
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
}

const EditPayment = async (token, requestData) => {
  try {
    const { payment_id } = requestData
    const responseData = await axios.put(
      `${config.api}/payments/edit-payment/${payment_id}`, requestData,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return responseData
  } catch (error) {
    console.error('Error updating payment', error);
    return error;
  }
}

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

const RemovePayment = async (token, paymentId) => {
  try {
    const responseData = await axios.delete(
      `${config.api}/payments/payment/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return responseData
  } catch (error) {
    console.error('Error removing payment', error);
    return error;
  };
};

export { AddPayment, GetPayment, EditPayment, GetPayments, RemovePayment };