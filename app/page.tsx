"use client"
import { useEffect, useState } from "react"
import { fetchLiveAlerts } from "@/lib/api"
import { connectSOCSocket } from "@/lib/ws"
import ThreatRadar from "@/components/radar/ThreatRadar"
import MetricsCard from "@/components/dashboard/MetricsCard"
import AlertFeed from "@/components/alerts/AlertFeed"
import ThreatTimeline from "@/components/graphs/ThreatTimeline"
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  TrendingUp,
  Zap,
  Globe,
  Server
} from "lucide-react"
import { motion } from "framer-motion"

export default function Dashboard() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLiveAlerts()
        setAlerts(data)
        setError(null)
      } catch (e) {
        setError("Backend not reachable")
      }
    }

    load()
    const interval = setInterval(load, 5000) // Poll every 5 seconds

    // WebSocket connection - handle gracefully if backend is not available
    let ws: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null
    
    const connectWebSocket = () => {
      try {
        ws = connectSOCSocket((alert: any) => {
          try {
            setAlerts((prev) => {
              // Avoid duplicates
              const exists = prev.some(a => a.id === alert.id || a.alert_id === alert.alert_id)
              if (exists) return prev
              return [alert, ...prev].slice(0, 100) // Keep last 100
            })
            setIsConnected(true)
          } catch (err) {
            console.error("Error processing alert:", err)
          }
        })
        
        if (ws) {
          // Override error handler to set connection state
          // Note: WebSocket error events don't contain detailed error info (browser security)
          // The error object will be empty {} - this is expected behavior
          ws.onerror = () => {
            // Silently handle errors - connection state will be updated via onclose
            // This prevents console errors when backend is not running
            setIsConnected(false)
          }
          
          ws.onclose = (event) => {
            setIsConnected(false)
            // Attempt to reconnect after 5 seconds if not a normal closure
            if (event.code !== 1000 && event.code !== 1001) {
              reconnectTimeout = setTimeout(() => {
                console.log("Attempting to reconnect WebSocket...")
                connectWebSocket()
              }, 5000)
            }
          }
          
          ws.onopen = () => {
            setIsConnected(true)
            if (reconnectTimeout) {
              clearTimeout(reconnectTimeout)
              reconnectTimeout = null
            }
          }
        }
      } catch (e) {
        console.warn("WebSocket connection failed (backend may not be running):", e)
        setIsConnected(false)
      }
    }

    // Initial connection attempt
    connectWebSocket()

    return () => {
      clearInterval(interval)
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (ws) {
        try {
          // Remove event handlers to prevent reconnection
          ws.onclose = null
          ws.onerror = null
          ws.close()
        } catch (e) {
          // Ignore close errors
        }
      }
    }
  }, [])

  // Calculate metrics with safety checks
  const safeAlerts = alerts || []
  const totalAlerts = safeAlerts.length
  const criticalAlerts = safeAlerts.filter(a => 
    a?.risk_score?.level?.toLowerCase() === "critical"
  ).length
  const highAlerts = safeAlerts.filter(a => 
    a?.risk_score?.level?.toLowerCase() === "high"
  ).length
  const activeThreats = safeAlerts.filter(a => {
    try {
      const timestamp = a?.timestamp || a?.correlated_alert?.base_alert?.timestamp
      if (!timestamp) return false
      const alertTime = new Date(timestamp).getTime()
      if (isNaN(alertTime)) return false
      const now = Date.now()
      return (now - alertTime) < 3600000 // Last hour
    } catch {
      return false
    }
  }).length

  const avgRiskScore = safeAlerts.length > 0
    ? Math.round(
        safeAlerts.reduce((sum, a) => sum + (a?.risk_score?.score || 0), 0) / safeAlerts.length
      )
    : 0

  const uniqueAssets = new Set(
    safeAlerts.map(a => a?.correlated_alert?.base_alert?.asset_id).filter(Boolean)
  ).size

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
            isConnected 
              ? "bg-green-500/20 text-green-400 border border-green-500/50"
              : "bg-red-500/20 text-red-400 border border-red-500/50"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
          }`} />
          {isConnected ? "Live" : "Disconnected"}
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
            SOC-X Command Center
          </h1>
          <p className="text-slate-400">Real-time threat monitoring and response</p>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricsCard
            title="Total Alerts"
            value={totalAlerts}
            change={totalAlerts > 0 ? `+${totalAlerts} today` : undefined}
            icon={Activity}
            color="bg-blue-500/20"
            delay={0}
          />
          <MetricsCard
            title="Critical Threats"
            value={criticalAlerts}
            change={criticalAlerts > 0 ? "Immediate action" : undefined}
            icon={AlertTriangle}
            color="bg-red-500/20"
            delay={0.1}
          />
          <MetricsCard
            title="High Risk Alerts"
            value={highAlerts}
            change={highAlerts > 0 ? "Review required" : undefined}
            icon={Shield}
            color="bg-orange-500/20"
            delay={0.2}
          />
          <MetricsCard
            title="Active Threats"
            value={activeThreats}
            change={activeThreats > 0 ? "Last hour" : undefined}
            icon={Zap}
            color="bg-yellow-500/20"
            delay={0.3}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricsCard
            title="Average Risk Score"
            value={`${avgRiskScore}%`}
            icon={TrendingUp}
            color="bg-purple-500/20"
            delay={0.4}
          />
          <MetricsCard
            title="Monitored Assets"
            value={uniqueAssets}
            icon={Server}
            color="bg-cyan-500/20"
            delay={0.5}
          />
          <MetricsCard
            title="System Status"
            value={error ? "Degraded" : "Operational"}
            icon={Globe}
            color={error ? "bg-red-500/20" : "bg-green-500/20"}
            delay={0.6}
          />
        </div>

        {/* Main Content: Radar and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Threat Radar - Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="lg:col-span-2 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Threat Radar</h2>
                <p className="text-sm text-slate-400">Real-time threat detection and visualization</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-slate-400">Scanning</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ThreatRadar alerts={safeAlerts} size={500} />
            </div>
          </motion.div>

          {/* Alert Feed - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
          >
            <AlertFeed alerts={safeAlerts} maxItems={15} />
          </motion.div>
        </div>

        {/* Threat Timeline Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <ThreatTimeline alerts={safeAlerts} />
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
