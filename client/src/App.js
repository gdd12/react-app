import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import SignIn from './components/SignIn';
// import Dashboard from './components/Dashboard';
import Dashboard from './pages/Dashboard';
import Signin from './pages/Signin';
import Profile from './pages/Profile';

function App() {
  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/" element={<Navigate to="/signin" />} />
  //       <Route path="/signin" element={<SignIn/>} />
  //       <Route path="/dashboard" element={<Dashboard />}/>
  //     </Routes>
  //   </Router>
  // );
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
};

export default App;
