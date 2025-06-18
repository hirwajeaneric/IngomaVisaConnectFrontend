import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/lib/api/services/auth.service';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export const RouteGuard = ({ children, requireAuth = false, requireAdmin = false }: RouteGuardProps) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required and user is not an admin
  if (requireAdmin && user?.role !== 'ADMIN') {
    // Redirect to dashboard login page
    return <Navigate to="/dashboard/login" replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
}; 