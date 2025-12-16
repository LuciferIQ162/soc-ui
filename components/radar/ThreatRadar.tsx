"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ThreatBlip {
  id: string
  angle: number
  distance: number
  severity: "low" | "medium" | "high" | "critical"
  alertId: string
  eventType: string
  timestamp: number
}

interface ThreatRadarProps {
  alerts: any[]
  size?: number
}

const ThreatRadar: React.FC<ThreatRadarProps> = ({ alerts, size = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [threats, setThreats] = useState<ThreatBlip[]>([])
  const [rotation, setRotation] = useState(0)
  const animationFrameRef = useRef<number>()

  // Convert alerts to threat blips
  useEffect(() => {
    if (!alerts || alerts.length === 0) {
      setThreats([])
      return
    }

    const newThreats: ThreatBlip[] = alerts.slice(0, 20)
      .filter(alert => alert != null) // Filter out null/undefined
      .map((alert, index) => {
        try {
          const severity = alert?.risk_score?.level?.toLowerCase() || "medium"
          const angle = (index * 137.5 + Date.now() * 0.001) % 360 // Golden angle distribution
          const distance = 0.3 + (Math.random() * 0.5) // Random distance from center
          
          return {
            id: alert?.id || alert?.alert_id || `threat-${index}`,
            angle: (angle * Math.PI) / 180,
            distance: distance,
            severity: ["low", "medium", "high", "critical"].includes(severity) 
              ? severity as "low" | "medium" | "high" | "critical"
              : "medium",
            alertId: alert?.alert_id || "unknown",
            eventType: alert?.correlated_alert?.base_alert?.event_type || "Unknown",
            timestamp: Date.now() + index * 100
          }
        } catch (error) {
          console.error("Error processing alert for radar:", error)
          return null
        }
      })
      .filter((threat): threat is ThreatBlip => threat != null) // Remove nulls
    setThreats(newThreats)
  }, [alerts])

  // Draw radar
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 40
    let currentRotation = rotation

    const draw = () => {
      try {
        ctx.clearRect(0, 0, size, size)

      // Draw concentric circles
      for (let i = 1; i <= 4; i++) {
        ctx.strokeStyle = "rgba(34, 197, 94, 0.2)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, (radius * i) / 4, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw grid lines
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + currentRotation
        ctx.strokeStyle = "rgba(34, 197, 94, 0.15)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        )
        ctx.stroke()
      }

      // Draw scanning line
      ctx.strokeStyle = "rgba(34, 197, 94, 0.6)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + Math.cos(currentRotation) * radius,
        centerY + Math.sin(currentRotation) * radius
      )
      ctx.stroke()

      // Draw scanning arc
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, "rgba(34, 197, 94, 0.1)")
      gradient.addColorStop(1, "rgba(34, 197, 94, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentRotation - 0.3, currentRotation + 0.3)
      ctx.closePath()
      ctx.fill()

      // Draw threat blips
      threats.forEach((threat) => {
        const x = centerX + Math.cos(threat.angle) * threat.distance * radius
        const y = centerY + Math.sin(threat.angle) * threat.distance * radius

        // Check if in scanning arc
        const angleDiff = Math.abs(threat.angle - currentRotation)
        const isDetected = angleDiff < 0.3 || angleDiff > Math.PI * 2 - 0.3

        if (isDetected) {
          // Draw threat blip
          const colors = {
            low: "rgba(59, 130, 246, 1)",
            medium: "rgba(234, 179, 8, 1)",
            high: "rgba(249, 115, 22, 1)",
            critical: "rgba(239, 68, 68, 1)"
          }

          const sizes = {
            low: 6,
            medium: 8,
            high: 10,
            critical: 12
          }

          // Pulsing effect
          const pulse = Math.sin(Date.now() * 0.005 + threat.timestamp) * 0.3 + 1

          ctx.fillStyle = colors[threat.severity]
          ctx.shadowBlur = 15
          ctx.shadowColor = colors[threat.severity]
          ctx.beginPath()
          ctx.arc(x, y, sizes[threat.severity] * pulse, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0

          // Draw ring
          ctx.strokeStyle = colors[threat.severity]
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x, y, sizes[threat.severity] * pulse * 1.5, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      // Update rotation
      currentRotation = (currentRotation + 0.02) % (Math.PI * 2)
      setRotation(currentRotation)
      } catch (error) {
        console.error("Error drawing radar:", error)
      }
    }

    const animate = () => {
      draw()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [threats, size])

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "bg-blue-500",
      medium: "bg-yellow-500",
      high: "bg-orange-500",
      critical: "bg-red-500"
    }
    return colors[severity as keyof typeof colors] || colors.medium
  }

  return (
    <div className="relative">
      <div className="relative" style={{ width: size, height: size }}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="absolute inset-0"
        />
        
        {/* Center indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
        </div>

        {/* Threat labels */}
        <AnimatePresence>
          {threats.slice(0, 10).map((threat) => {
            const x = size / 2 + Math.cos(threat.angle) * threat.distance * (size / 2 - 40)
            const y = size / 2 + Math.sin(threat.angle) * threat.distance * (size / 2 - 40)
            const angleDiff = Math.abs(threat.angle - (rotation % (Math.PI * 2)))
            const isDetected = angleDiff < 0.3 || angleDiff > Math.PI * 2 - 0.3

            if (!isDetected) return null

            return (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute pointer-events-none"
                style={{
                  left: x - 60,
                  top: y - 20,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <div className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(threat.severity)} text-white shadow-lg`}>
                  {threat.eventType.substring(0, 15)}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span>Critical</span>
        </div>
      </div>
    </div>
  )
}

export default ThreatRadar

