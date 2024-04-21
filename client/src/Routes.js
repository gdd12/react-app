import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard/Dashboard';
import Signin from './pages/Signin/Signin';
import Profile from './pages/Profile/Profile';
import AddLoans from './pages/Loans/AddLoans';
import AddPayment from './pages/Loans/AddPayment';
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
        <Route path="/loans/add-loan" element={<AddLoans />} />
        <Route path="/loans/add-payment" element={<AddPayment />} />
      </Routes>
    </Router>
  )
};

export default App;
