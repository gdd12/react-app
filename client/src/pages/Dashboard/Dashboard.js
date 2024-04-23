import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import ValidateToken from '../../helpers/ValidateToken';
import './Dashboard.css'

function Dashboard() {
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
