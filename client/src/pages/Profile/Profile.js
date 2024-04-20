import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';

function Profile() {
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
    <div className="profile">
      <SideNavigation />
      <div className="content">
        <h1>Profile</h1>
      </div>
    </div>
  );
}

export default Profile;
