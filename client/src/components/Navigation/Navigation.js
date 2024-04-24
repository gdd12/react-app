import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../../helpers/Logout';
import './Navigation.css';

function Navigation() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="navigation">
      <ul className="navigation-container">
        <li className="navigation-link"><Link to="/dashboard">Dashboard</Link></li>
        <li className="navigation-link"><Link to="/profile">Profile</Link></li>
        <li className={`navigation-link dropdown ${dropdownOpen ? 'open' : ''}`} onMouseEnter={handleDropdownToggle} onMouseLeave={handleDropdownToggle}>
          <Link to="/loans">Loans</Link>
          <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
            <Link to="/loans/add-info" onClick={closeDropdown}>Add Loan/Payment</Link>
          </div>
        </li>
      </ul>
      <ul className="logout">
        <li className="navigation-link">
          <Link to="/signin" onClick={Logout}>
            <button className="logout-button">Logout</button>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
