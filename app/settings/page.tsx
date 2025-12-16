"use client"
import { motion } from "framer-motion"
import { Settings, Bell, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-slate-400">Configure your SOC-X system preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          <p className="text-slate-400 mb-4">Configure alert notifications and preferences</p>
          <p className="text-sm text-slate-500">Coming soon</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>
          <p className="text-slate-400 mb-4">Manage security policies and access controls</p>
          <p className="text-sm text-slate-500">Coming soon</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Data Management</h2>
          </div>
          <p className="text-slate-400 mb-4">Configure data retention and storage settings</p>
          <p className="text-sm text-slate-500">Coming soon</p>
        </motion.div>
      </div>
    </div>
  )
}

