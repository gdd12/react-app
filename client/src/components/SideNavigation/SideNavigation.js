import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../../helpers/Logout';

function SideNavigation() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
        <li><Link to="/profile" className="nav-link">Profile</Link></li>
        <li><Link to="/loans" className="nav-link">Loans</Link></li>
      </ul>
      <div className="logout">
        <ul>
          <li><Link to="/signin" className="nav-link logout" onClick={Logout}>Logout</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default SideNavigation;
