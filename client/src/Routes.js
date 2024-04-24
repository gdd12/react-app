import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Signin from './pages/Signin/Signin';
import Profile from './pages/Profile/Profile';
import Loans from './pages/Loans/Loans'
import AddPaymentComponent from './components/AddPayment/AddPayment';
import AddLoanComponent from './components/AddLoan/AddLoan'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/loans/add-payment" element={<AddPaymentComponent />} />
        <Route path="/loans/add-loan" element={<AddLoanComponent />} />
      </Routes>
    </Router>
  )
};

export default App;
