// ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthenContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAuth();

  const redirectPath = (role) => {
    switch (role) {
      case 'owner':
        return '/ownerpage';
      case 'manager':
        return '/firstpage';
      case 'employee':
        return '/firstpage';
      default:
        return '/prelogin';
    }
  };

  console.log('Protected route check:', { 
    isAuthenticated, 
    user, 
    loading, 
    allowedRoles,
    token: sessionStorage.getItem('token')
  });

  if (loading) {
    return <div>กำลังตรวจสอบสิทธิ์...</div>;
  }
  console.log('Current path:', location.pathname);
console.log('Token in localStorage:', localStorage.getItem('token'));

  if (!isAuthenticated) {
    
    return <Navigate to="/prelogin" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.includes(user.role)) {
   
    return children;
  } else {
    

    return <Navigate to={redirectPath(user.role)} replace />;
  }

  
};

export default ProtectedRoute;