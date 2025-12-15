import { useEffect, useMemo, useRef, useState } from "react"
import { useAlerts } from "@/src/store/useAlerts"

type Props = {
  alerts?: any[]
  width?: number
  height?: number
  pointsCount?: number
}

export default function AttackActivityGraph({ alerts, width = 600, height = 120, pointsCount = 120 }: Props) {
  const storeAlerts = useAlerts((s: any) => s.alerts)
  const sourceAlerts = alerts ?? storeAlerts
  const [points, setPoints] = useState<number[]>(Array(pointsCount).fill(2))
  const [stroke, setStroke] = useState<string>("#10b981")
  const prevLen = useRef<number>(sourceAlerts.length)
  const lastSeverity = useRef<number>(0)

  function severityFromAlert(a: any): { value: number; color: string } {
    const level = a?.risk_score?.level?.toUpperCase?.()
    const score = typeof a?.risk_score?.score === "number" ? a.risk_score.score : undefined
    const llm = typeof a?.llm_analysis?.threat_score === "number" ? a.llm_analysis.threat_score : undefined

    let value = 6
    let color = "#10b981" // emerald for low
    if (level === "LOW") { value = 6; color = "#10b981" }
    else if (level === "MEDIUM") { value = 12; color = "#f59e0b" }
    else if (level === "HIGH") { value = 20; color = "#ef4444" }
    else if (level === "CRITICAL") { value = 28; color = "#ef4444" }

    if (typeof score === "number") {
      value = 5 + Math.max(0, Math.min(100, score)) * 0.25 // 5..30
      if (score >= 70) color = "#ef4444"
      else if (score >= 40) color = "#f59e0b"
      else color = "#10b981"
    }

    if (typeof llm === "number") {
      const llmScaled = 5 + Math.max(0, Math.min(100, llm)) * 0.25
      value = Math.max(value, llmScaled)
      if (llm >= 70) color = "#ef4444"
      else if (llm >= 40) color = "#f59e0b"
    }

    return { value, color }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const baseline = 3 + Math.random() * 1
      const newest = sourceAlerts[0]
      if (newest) {
        const { value, color } = severityFromAlert(newest)
        lastSeverity.current = value
        setStroke(color)
      }
      const target = newest ? lastSeverity.current : baseline
      const spike = Math.min(30, target)
      setPoints((prev) => prev.slice(1).concat(spike))
      prevLen.current = sourceAlerts.length
    }, 1000)
    return () => clearInterval(timer)
  }, [sourceAlerts])

  const path = useMemo(() => {
    const maxVal = 30
    const stepX = width / (points.length - 1)
    return points
      .map((v, i) => {
        const x = i * stepX
        const y = height - (v / maxVal) * height
        return `${x},${y}`
      })
      .join(" ")
  }, [points, width, height])

  return (
    <div style={{ width, height }}>
      <svg width={width} height={height}>
        <polyline points={path} fill="none" stroke={stroke} strokeWidth={2} />
      </svg>
    </div>
  )
}
