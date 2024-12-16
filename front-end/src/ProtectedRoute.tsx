import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: any) => state.auth.user);

  // Kullanıcı giriş yapmadıysa login sayfasına yönlendirin
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Kullanıcı giriş yaptıysa içeriği göster
  return <Outlet />;
};

export default ProtectedRoute;
