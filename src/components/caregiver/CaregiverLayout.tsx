import { ReactNode } from "react";
import { CaregiverSidebar } from "./CaregiverSidebar";

interface CaregiverLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function CaregiverLayout({ children, title, subtitle }: CaregiverLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <CaregiverSidebar />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
