import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    const tokenInfo = ValidateToken(token)
    console.log(tokenInfo)
  }, [navigate]);

  return (
    <div className="dashboard">
      <SideNavigation />
      <div className="content">
        <h1>Welcome to Dashboard</h1>
      </div>
    </div>
  );
}

export default Dashboard;
