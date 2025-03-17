import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: JSX.Element;
}

// Local storage'de bir token olup olmadığını kontrol et
const isAuthenticated = () => {
  const token = localStorage.getItem('token');  // 'token' ile localStorage'de giriş bilgilerini saklıyorsun
  return !!token;  // Token varsa true döner
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;  // Eğer token yoksa giriş sayfasına yönlendir
};

export default PrivateRoute;
