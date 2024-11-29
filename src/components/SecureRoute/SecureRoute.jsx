import React from 'react';
import { useCurrentUser } from '../../lib/UserContext';
import { Navigate, Outlet, Route } from 'react-router';
import AccessDenied from '../AccessDenied/AccessDenied';

const SecureRoute = ({ element }) => {
  const { isAdmin } = useCurrentUser();

  return isAdmin ? element : <AccessDenied />
};

export const Secure = (element) => {
  return(<SecureRoute element={element} />)
};

export default SecureRoute;