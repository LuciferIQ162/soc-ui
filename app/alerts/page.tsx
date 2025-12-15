"use client"
import { useEffect, useState } from "react"
import ThreatNarrative from "@/components/ThreatNarrative"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_SOC_API}/api/alerts/live`
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then(setAlerts)
      .catch((e) => setError(String(e)))
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Live Alerts</h2>
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      <div className="space-y-3">
        {alerts.map((a: any, i: number) => (
          <div key={i} className="space-y-4">
            <div className="border border-green-800 bg-black p-3 rounded">
              <div className="font-bold">
                {a?.correlated_alert?.base_alert?.event_type}
              </div>
              <div className="text-sm opacity-80">
                Asset: {a?.correlated_alert?.base_alert?.asset_id}
              </div>
              <div className="text-sm">Risk: {a?.risk_score?.level}</div>
            </div>
            <ThreatNarrative analysis={a?.llm_analysis} />
          </div>
        ))}
        {alerts.length === 0 && !error && (
          <div className="text-sm opacity-70">No live alerts</div>
        )}
      </div>
    </div>
  )
}
