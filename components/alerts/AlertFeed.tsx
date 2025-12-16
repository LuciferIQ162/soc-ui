"use client"
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Shield, Clock, Activity } from "lucide-react"

interface AlertFeedProps {
  alerts: any[]
  maxItems?: number
}

const AlertFeed: React.FC<AlertFeedProps> = ({ alerts = [], maxItems = 10 }) => {
  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "border-blue-500/50 bg-blue-500/10",
      medium: "border-yellow-500/50 bg-yellow-500/10",
      high: "border-orange-500/50 bg-orange-500/10",
      critical: "border-red-500/50 bg-red-500/10"
    }
    return colors[severity?.toLowerCase() as keyof typeof colors] || colors.medium
  }

  const getSeverityIcon = (severity: string) => {
    if (severity?.toLowerCase() === "critical") return AlertTriangle
    if (severity?.toLowerCase() === "high") return Shield
    return Activity
  }

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "Just now"
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Real-Time Alert Feed
      </h3>
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        <AnimatePresence>
          {(alerts || []).slice(0, maxItems).map((alert, index) => {
            if (!alert) return null
            const severity = alert?.risk_score?.level?.toLowerCase() || "medium"
            const Icon = getSeverityIcon(severity)
            const eventType = alert.correlated_alert?.base_alert?.event_type || "Unknown Event"
            const assetId = alert.correlated_alert?.base_alert?.asset_id || "Unknown Asset"
            const riskScore = alert.risk_score?.score || 0

            return (
              <motion.div
                key={alert.id || alert.alert_id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`border-l-4 rounded-lg p-4 ${getSeverityColor(severity)} backdrop-blur-sm hover:scale-[1.02] transition-transform cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      severity === "critical" ? "bg-red-500/20" :
                      severity === "high" ? "bg-orange-500/20" :
                      severity === "medium" ? "bg-yellow-500/20" :
                      "bg-blue-500/20"
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        severity === "critical" ? "text-red-400" :
                        severity === "high" ? "text-orange-400" :
                        severity === "medium" ? "text-yellow-400" :
                        "text-blue-400"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white truncate">{eventType}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                          severity === "critical" ? "bg-red-500/20 text-red-400" :
                          severity === "high" ? "bg-orange-500/20 text-orange-400" :
                          severity === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{assetId}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(alert.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Risk: {riskScore}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      severity === "critical" ? "text-red-400" :
                      severity === "high" ? "text-orange-400" :
                      severity === "medium" ? "text-yellow-400" :
                      "text-blue-400"
                    }`}>
                      {riskScore}%
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {alerts.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active alerts</p>
            <p className="text-xs mt-2">Alerts will appear here in real-time</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertFeed

