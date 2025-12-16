"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, Activity, AlertTriangle, Settings, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Activity, label: "Dashboard" },
    { href: "/alerts", icon: AlertTriangle, label: "Alerts" },
    { href: "/incidents", icon: Shield, label: "Incidents" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-r border-slate-800/50 p-6 flex flex-col">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              SOC-X
            </h1>
            <p className="text-xs text-slate-500">Odisha</p>
          </div>
        </div>
      </motion.div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-green-400" : ""
                  }`}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-green-400 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-auto pt-6 border-t border-slate-800/50"
      >
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-white">Operational</span>
          </div>
        </div>
      </motion.div>
    </aside>
  )
}

export default Sidebar
