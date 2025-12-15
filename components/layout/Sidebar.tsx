import * as React from "react"
import Link from "next/link"
import { Shield, Activity, AlertTriangle } from "lucide-react"

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#0f1320] border-r border-slate-800 p-4">
      <h1 className="text-xl font-bold mb-6">SOC-X</h1>
      <nav className="space-y-4 text-sm">
        <Link href="/" className="flex items-center gap-2"><Activity size={16}/> Dashboard</Link>
        <Link href="/alerts" className="flex items-center gap-2"><AlertTriangle size={16}/> Alerts</Link>
        <Link href="/incidents" className="flex items-center gap-2"><Shield size={16}/> Incidents</Link>
      </nav>
    </aside>
  )
}

export default Sidebar
