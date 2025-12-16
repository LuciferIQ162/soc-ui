import Sidebar from "../components/layout/Sidebar"
import TopBar from "../components/layout/TopBar"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="overflow-auto bg-slate-950">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
