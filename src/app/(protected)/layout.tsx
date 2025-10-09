import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/AuthGuard"
import { QueryProvider } from "@/contexts/query-provider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <QueryProvider>
        <SidebarProvider
          style={{ ["--sidebar-width" as any]: "13rem", ["--sidebar-width-icon" as any]: "2.5rem" }}
        >
          <Sidebar />
          <SidebarInset>
            <Header />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </QueryProvider>
    </AuthGuard>
  )
}

