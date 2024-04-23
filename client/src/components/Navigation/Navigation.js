import React from 'react';
import { Link } from 'react-router-dom';
import Logout from '../../helpers/Logout';
import './Navigation.css'

function Navigation() {
  return (
    <div className="navigation">
      <ul className="navigation-container">
        <li className="navigation-link"><Link to="/dashboard">Dashboard</Link></li>
        <li className="navigation-link"><Link to="/profile">Profile</Link></li>
        <li className="navigation-link"><Link to="/loans">Loans</Link></li>
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
