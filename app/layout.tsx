import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AuthProvider } from "@/components/auth-provider"
import { WebSocketProvider } from "@/components/websocket-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ESTIN Entry Detection System",
  description: "Smart campus security monitoring system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get WebSocket URL from environment variable
  const wsUrl = process.env.BACKEND_URL
    ? process.env.BACKEND_URL.replace(/^http/, "ws") + "/ws"
    : "ws://localhost:8000/ws"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <WebSocketProvider url={wsUrl}>
              <SidebarProvider>
                <div className="flex h-screen">
                  <AppSidebar />
                  <div className="flex-1 overflow-auto">{children}</div>
                </div>
              </SidebarProvider>
            </WebSocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'