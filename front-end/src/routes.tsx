import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InvoicePage from './pages/InvoicePage';
import ReportPage from './pages/ReportPage';
import CreateAccountPage from './pages/CreateAnAcount';
import Profile from './pages/Profile';

import Invoice from './pages/Invoice';
import Page404 from './pages/page404';
import PrivateRoute from './PrivateRoute'; // PrivateRoute'ı import et
import VerifyEmailForm from './pages/VerifyEmailForm';
import Help from './pages/Help';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<PrivateRoute element={<HomePage />} />} /> {/* PrivateRoute kullandık */}
        </Route>
        <Route path="/invoices" element={<PrivateRoute element={<InvoicePage />} />} /> {/* PrivateRoute kullandık */}
        <Route path="/reports" element={<PrivateRoute element={<ReportPage />} />} />
        <Route path="/create" element={<CreateAccountPage />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path='/help' element={<PrivateRoute element={<Help />} />} />
        <Route path='/invoices/invoice/:invoiceId' element={<PrivateRoute element={<Invoice />} />} />
        <Route path='/verify-email' element= {<VerifyEmailForm/>}/>
        <Route path='/404' element={<Page404 />} />
        <Route path='*' element={<Page404 />} /> 
      </Routes>
    </Router>
  );
};

export default AppRoutes;
