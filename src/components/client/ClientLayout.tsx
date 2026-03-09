import { ReactNode } from "react";
import { ClientSidebar } from "./ClientSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface ClientLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function ClientLayout({ children, title, subtitle }: ClientLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
        <SidebarInset>
          <header className="h-14 flex items-center gap-4 border-b border-border px-6">
            <SidebarTrigger className="-ml-2" />
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </header>
          <main className="p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
