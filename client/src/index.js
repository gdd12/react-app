import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import './components/SideNavigation/SideNavigation.css'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
  document.getElementById('root')
);