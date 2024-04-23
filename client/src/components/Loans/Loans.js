import { config } from '../../config/default'
import axios from 'axios';

const AddLoan = async (token, requestData) => {
  try {
    const responseData = await axios.post(
      `${config.api}/loans/add-loan`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return responseData;
  } catch (error) {
    // console.error('Error adding loan:', error);
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

