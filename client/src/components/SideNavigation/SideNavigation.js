import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../../helpers/Logout';

function SideNavigation() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
        <li><Link to="/profile" className="nav-link">Profile</Link></li>
        <li>
          <div className="nav-link" onClick={toggleDropdown}>
            <Link>Loans ↴</Link>
          </div>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/loans/add-loan" className="nav-link small">{`>`} Add Loan</Link></li>
              <li><Link to="/loans/add-payment" className="nav-link small">{`>`} Add Payment</Link></li>
            </ul>
          )}
        </li>
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
