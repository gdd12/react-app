import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../components/SideNavigation/SideNavigation';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // Redirect to sign-in page if token is not found
      navigate('/signin');
      return;
    }

    // Send token to backend for validation
    const validateToken = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        if (response.ok) {
          // Token is valid, continue with dashboard
          console.log('Token is valid');
        } else {
          // Token is invalid, redirect to sign-in page
          console.error('Token validation failed:', response.statusText);
          navigate('/signin');
        }
      } catch (error) {
        console.error('Token validation error:', error.message);
        navigate('/signin');
      }
    };

    validateToken(); // Call validateToken function
  }, [navigate]);

  const logout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      sessionStorage.removeItem('token');
      const response = await fetch('http://localhost:3000/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        navigate('/signin');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className="dashboard">
      <SideNavigation />
      <div className="content">
        <h1>Welcome to Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
