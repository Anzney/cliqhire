import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
            {children}
        </main>
        </div>
    </div>
  )
}

