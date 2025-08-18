import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AuthGuard } from "@/components/AuthGuard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
              {children}
          </main>
          </div>
      </div>
    </AuthGuard>
  )
}

