import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Signin from './pages/Signin/Signin';
import Profile from './pages/Profile/Profile';
import Loans from './pages/Loans/Loans'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/loans" element={<Loans />} />
      </Routes>
    </Router>
  )
};

export default App;
