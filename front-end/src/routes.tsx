import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InvoicePage from './pages/InvoicePage';
import ReportPage from './pages/ReportPage';
import CreateAccountPage from './pages/CreateAnAcount';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/invoices" element={<InvoicePage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/create" element = {<CreateAccountPage/>} />
        <Route path="/profile" element = {<Profile/>} />
        <Route path='/notifications' element = {<Notifications/>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
