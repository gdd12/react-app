import { config } from '../config/default';
import axios from 'axios';

const Login = async (loginInfo) => {
  try {
    const responseData = await axios.post(
      `${config.api}/user/signin`, loginInfo, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return responseData
  } catch (error) {
    console.error('Error fetching loans:', error);
    return error;
  }
}

export default Login;