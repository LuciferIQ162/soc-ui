"use client"

import { useSOCSocket } from "./hooks/useSOCSocket"
import { useAlerts } from "@/store/useAlerts"
import { motion } from "framer-motion"

export default function Home() {
  useSOCSocket()
  const alerts = useAlerts((s) => s.alerts)

  return (
    <main className="min-h-screen bg-black text-green-400 p-6">
      <h1 className="text-3xl font-mono mb-6">SOC-X LIVE WALL</h1>

      <div className="space-y-4">
        {alerts.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-green-700 bg-green-950 p-4 rounded"
          >
            <div className="font-bold">
              {a.correlated_alert.base_alert.event_type}
            </div>
            <div className="text-sm">
              Asset: {a.correlated_alert.base_alert.asset_id}
            </div>
            <div className="text-sm">
              Risk: {a.risk_score.level} ({a.risk_score.score})
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
