import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signin.css'

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState([])
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setError([])
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/v1/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (response.status === 200) {
        const { token } = await response.json();
        sessionStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        setError([response])
      }
    } catch (error) {
      setError([error])
    }
  };

  return (
    <div className="container">
      <h2>Sign In</h2>
      <div className="error-placeholder" style={{ height: error.length > 0 ? '0' : '50px' }}></div>
      {error.length > 0 && (
          <div className="error">
            {error.map((err, index) => (
              <div key={index}>
                {err instanceof Response ? (
                  <p>{err.status}: {err.statusText}</p>
                ) : (
                  <p>{err.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      <form onSubmit={handleSubmit}>
        <div className="item">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
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
