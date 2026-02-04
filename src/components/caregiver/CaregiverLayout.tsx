import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CaregiverSidebar } from "./CaregiverSidebar";
import { KycStatusBanner } from "@/components/kyc/KycStatusBanner";
import { useKyc } from "@/contexts/KycContext";

interface CaregiverLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function CaregiverLayout({ children, title, subtitle }: CaregiverLayoutProps) {
  const location = useLocation();
  const { kycStatus, currentSubmission } = useKyc();
  
  // Don't show banner on the KYC page itself
  const showBanner = !location.pathname.includes('/verificacao');

  return (
    <div className="min-h-screen bg-background">
      <CaregiverSidebar />
      <main className="ml-64 p-8">
        {showBanner && (
          <KycStatusBanner 
            status={kycStatus}
            pendingItems={currentSubmission?.pendingItems}
            rejectionReason={currentSubmission?.rejectionReason}
            rejectionDetails={currentSubmission?.rejectionDetails}
          />
        )}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
