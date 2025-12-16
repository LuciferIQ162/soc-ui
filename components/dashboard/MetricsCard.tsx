"use client"
import React from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  color: string
  delay?: number
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 hover:border-slate-600 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change && (
          <span className={`text-xs font-semibold ${
            change.startsWith("+") ? "text-green-400" : "text-red-400"
          }`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  )
}

export default MetricsCard

