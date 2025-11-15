import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AuthGuard } from "@/components/AuthGuard";
import { QueryProvider } from "@/contexts/query-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <QueryProvider>
        <SidebarProvider
          style={{ ["--sidebar-width" as any]: "13rem", ["--sidebar-width-icon" as any]: "3rem" }}
        >
          <Sidebar />
          <SidebarInset>
            <main className="flex-1 min-h-screen flex flex-col overflow-hidden">
              <Header />
              <div className="flex-1 overflow-auto">{children}</div>
            </main>   
          </SidebarInset>
        </SidebarProvider>
      </QueryProvider>
    </AuthGuard>
  );
}
