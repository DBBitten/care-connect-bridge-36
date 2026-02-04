import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useKyc } from '@/contexts/KycContext';
import { useAuth } from '@/contexts/AuthContext';

interface RequireApprovedKycProps {
  children: ReactNode;
}

export function RequireApprovedKyc({ children }: RequireApprovedKycProps) {
  const { kycStatus } = useKyc();
  const { userType, isAuthenticated } = useAuth();

  // Only apply to caregivers
  if (userType !== 'cuidador') {
    return <>{children}</>;
  }

  // Redirect to KYC page if not approved
  if (kycStatus !== 'APPROVED') {
    return <Navigate to="/cuidador/verificacao" replace />;
  }

  return <>{children}</>;
}
