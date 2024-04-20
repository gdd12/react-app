import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';

function Template() {
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
    <>
      <SideNavigation />
    </>
  );
}

export default Template;
