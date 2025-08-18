import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/AuthContext"
import '@/lib/axios-config'; // Initialize global axios interceptors

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CliqHire",
  description: "Recruitment Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className } suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

