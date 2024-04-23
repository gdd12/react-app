import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../../helpers/Login';
import './Signin.css';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestData = {
        username: username,
        password: password
      };

      const signinResponse = await Login(requestData)

      if (signinResponse && signinResponse.status === 200 && signinResponse.data && signinResponse.data.token) {
        const token = signinResponse.data.token
        sessionStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        console.log(signinResponse.response)
        setError(`${signinResponse.response.status}: ${signinResponse.response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container">
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="item">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="item">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="item button">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
