import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InvoicePage from './pages/InvoicePage';
import ReportPage from './pages/ReportPage';
import CreateAccountPage from './pages/CreateAnAcount';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Invoice from './pages/Invoice';
import Page404 from './pages/page404';

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
        <Route path='/invoices' element = {<Invoice/>}/>
        <Route path='/404' element = {<Page404/>}/>
        <Route path='*' element = {<Page404/>}/>

      </Routes>
    </Router>
  );
};

export default AppRoutes;
