import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ValidateToken from '../../helpers/ValidateToken';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const [validToken, setValidToken] = useState(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      setValidToken(await ValidateToken(token));
    };
    checkTokenValidity();
  }, [token]);

  useEffect(() => {
    if (validToken === false) navigate('/signin');
    else {
      /** Proceed with INIT functions */
    }
  }, [validToken, navigate]);

  return (
    <>
      <Navigation />
      <div className="content">
        <p>Dashboard</p>
      </div>
    </>
  );
}

export default Dashboard;
