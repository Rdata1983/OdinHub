import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import Navigation from "@/components/Navigation"
import { AppConfigProvider } from "@/lib/app-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Zeiterfassung für Handwerksbetriebe",
  description: "Effiziente Zeiterfassung für Handwerksbetriebe und Fertigungsunternehmen",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <AppConfigProvider>
          <div className="flex min-h-screen">
            <Navigation />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <main className="p-4 max-w-7xl mx-auto">{children}</main>
            </div>
          </div>
          <Toaster />
        </AppConfigProvider>
      </body>
    </html>
  )
}



import './globals.css'