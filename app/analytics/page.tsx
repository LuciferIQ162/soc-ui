"use client"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Activity } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8" />
          Analytics & Reports
        </h1>
        <p className="text-slate-400">Comprehensive threat analysis and insights</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Threat Trends</h2>
          <p className="text-slate-400">Coming soon: Historical threat analysis and trend visualization</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Asset Analysis</h2>
          <p className="text-slate-400">Coming soon: Asset vulnerability and risk assessment</p>
        </motion.div>
      </div>
    </div>
  )
}

