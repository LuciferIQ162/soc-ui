"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { motion } from "framer-motion"

interface ThreatTimelineProps {
  alerts: any[]
}

const ThreatTimeline: React.FC<ThreatTimelineProps> = ({ alerts }) => {
  // Process alerts into timeline data (last 24 hours)
  const now = Date.now()
  const hours = 24
  const data = Array.from({ length: hours }, (_, i) => {
    const hourStart = now - (hours - i) * 3600000
    const hourEnd = hourStart + 3600000
    
    const hourAlerts = (alerts || []).filter(alert => {
      try {
        const timestamp = new Date(alert?.timestamp || alert?.correlated_alert?.base_alert?.timestamp || 0).getTime()
        return timestamp >= hourStart && timestamp < hourEnd && !isNaN(timestamp)
      } catch {
        return false
      }
    })

    return {
      time: new Date(hourStart).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      alerts: hourAlerts.length,
      critical: hourAlerts.filter(a => a?.risk_score?.level?.toLowerCase() === 'critical').length,
      high: hourAlerts.filter(a => a?.risk_score?.level?.toLowerCase() === 'high').length,
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Threat Activity Timeline</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#e5e7eb'
            }}
          />
          <Area
            type="monotone"
            dataKey="alerts"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#colorAlerts)"
          />
          <Area
            type="monotone"
            dataKey="critical"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorCritical)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default ThreatTimeline

