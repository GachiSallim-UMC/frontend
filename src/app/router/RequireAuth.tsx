import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/store';

export const RequireAuth = () => {
  const isAuthenticated = useAuthStore(s => Boolean(s.accessToken && s.userId));
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
