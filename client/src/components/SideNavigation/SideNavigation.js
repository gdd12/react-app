import React from 'react';
import { Link } from 'react-router-dom';

function SideNavigation() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
        <li><Link to="/profile" className="nav-link">Profile</Link></li>
      </ul>
    </div>
  );
}

export default SideNavigation;
