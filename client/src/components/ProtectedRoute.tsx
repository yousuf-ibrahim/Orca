import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireInvestorType?: boolean;
}

export function ProtectedRoute({ children, requireInvestorType = false }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation('/login');
      } else if (requireInvestorType && !user?.investorType) {
        setLocation('/onboarding');
      }
    }
  }, [isAuthenticated, isLoading, user?.investorType, requireInvestorType]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireInvestorType && !user?.investorType) {
    return null;
  }

  return <>{children}</>;
}
