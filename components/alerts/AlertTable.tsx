"use client"
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { fetchLiveAlerts } from "@/lib/api"

interface Alert {
  id?: string
  alert_id?: string
  correlated_alert?: {
    base_alert?: {
      alert_id?: string
      event_type?: string
      asset_id?: string
      severity?: string
    }
  }
  risk_score?: {
    level?: string
    score?: number
  }
  threat_assessment?: {
    threat_level?: string
  }
  timestamp?: string
}

export default function AlertTable() {
  const [alerts, setAlerts] = React.useState<Alert[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true)
        const data = await fetchLiveAlerts()
        setAlerts(data || [])
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load alerts")
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()
    const interval = setInterval(loadAlerts, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const getSeverityVariant = (severity?: string) => {
    if (!severity) return "default"
    const s = severity.toLowerCase()
    if (s === "high" || s === "critical") return "destructive"
    if (s === "medium") return "default"
    return "secondary"
  }

  const getRiskVariant = (level?: string) => {
    if (!level) return "default"
    const l = level.toLowerCase()
    if (l === "high" || l === "critical") return "destructive"
    if (l === "medium") return "default"
    return "secondary"
  }

  if (loading) {
    return (
      <div className="w-full text-sm border border-slate-800 p-4 text-center">
        Loading alerts...
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full text-sm border border-red-800 bg-red-950/20 p-4 text-red-400">
        Error: {error}
      </div>
    )
  }

  return (
    <table className="w-full text-sm border border-slate-800">
      <thead className="bg-slate-900">
        <tr>
          <th className="p-2 text-left">Alert ID</th>
          <th className="p-2 text-left">Type</th>
          <th className="p-2 text-left">Asset</th>
          <th className="p-2 text-left">Severity</th>
          <th className="p-2 text-left">Risk Level</th>
          <th className="p-2 text-left">Time</th>
        </tr>
      </thead>
      <tbody>
        {alerts.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-4 text-center text-slate-500">
              No alerts available
            </td>
          </tr>
        ) : (
          alerts.map((alert, i) => {
            const baseAlert = alert.correlated_alert?.base_alert
            const alertId = alert.alert_id || baseAlert?.alert_id || alert.id || `alert-${i}`
            const eventType = baseAlert?.event_type || "Unknown"
            const assetId = baseAlert?.asset_id || "N/A"
            const severity = baseAlert?.severity || alert.threat_assessment?.threat_level || "unknown"
            const riskLevel = alert.risk_score?.level || "unknown"
            const timestamp = alert.timestamp ? new Date(alert.timestamp).toLocaleString() : "N/A"

            return (
              <tr key={alert.id || i} className="border-t border-slate-800 hover:bg-slate-900/50">
                <td className="p-2 font-mono text-xs">{alertId}</td>
                <td className="p-2">{eventType}</td>
                <td className="p-2 text-slate-400">{assetId}</td>
                <td className="p-2">
                  <Badge variant={getSeverityVariant(severity)}>
                    {severity.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-2">
                  <Badge variant={getRiskVariant(riskLevel)}>
                    {riskLevel.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-2 text-xs text-slate-500">{timestamp}</td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}
