import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/AuthContext"
import '@/lib/axios-config'; // Initialize global axios interceptors
import { QueryProvider } from "@/contexts/query-provider";

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
            <QueryProvider>
              <Toaster />
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

