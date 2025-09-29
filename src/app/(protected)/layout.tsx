import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/AuthGuard"
import { QueryProvider } from "@/contexts/query-provider";

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
      <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
              {children}
          </main>
          </div>
      </div>
      </QueryProvider>
    </AuthGuard>
  )
}

