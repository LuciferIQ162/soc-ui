"use client"
import { Bell, Search, User, Menu } from "lucide-react"
import { motion } from "framer-motion"

const TopBar: React.FC = () => {
  return (
    <header className="h-16 bg-gradient-to-r from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-b border-slate-800/50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts, assets, threats..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg text-white hover:from-green-500/30 hover:to-blue-500/30 transition-all"
        >
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">Admin</span>
        </motion.button>
      </div>
    </header>
  )
}

export default TopBar
