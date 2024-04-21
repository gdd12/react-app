import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import ValidateToken from '../../helpers/ValidateToken';

function Template() {
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
      <SideNavigation />
    </>
  );
}

export default Template;
