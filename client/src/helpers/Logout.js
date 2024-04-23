import { config } from '../config/default';
import axios from 'axios';

const Logout = async () => {
  try {
    const token = sessionStorage.getItem('token')
    const responseData = await axios.post(
      `${config.api}/user/logout`, {
        headers: {
          'Authorization': `Bearer: ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    sessionStorage.removeItem('token');
    return(responseData)
  } catch (error) {
    console.error('Logout error:', error.message);
    return error;
  }
};

export default Logout;