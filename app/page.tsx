"use client"
import { useEffect, useState } from "react"
import { fetchLiveAlerts } from "@/lib/api"
import { connectSOCSocket } from "@/lib/ws"
import AttackActivityGraph from "@/components/graphs/AttackActivityGraph"

export default function Dashboard() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLiveAlerts()
        setAlerts(data)
      } catch (e) {
        setError("Backend not reachable")
      }
    }

    load()
    const interval = setInterval(load, 2000)
    const ws = connectSOCSocket((alert: any) => {
      setAlerts((prev) => [alert, ...prev])
    })
    return () => {
      clearInterval(interval)
      ws.close()
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <AttackActivityGraph alerts={alerts} />
      <h2 className="text-xl mb-4">Live Alerts</h2>

      {error && <p className="text-red-500">{error}</p>}
      {alerts.length === 0 && !error && <p>No active alerts</p>}

      <div className="space-y-3">
        {alerts.map((a, i) => (
          <div key={i} className="border border-green-800 bg-black p-3 rounded">
            <strong>{a.correlated_alert.base_alert.event_type}</strong>
            <div>Asset: {a.correlated_alert.base_alert.asset_id}</div>
            <div>Risk: {a.risk_score.level}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
