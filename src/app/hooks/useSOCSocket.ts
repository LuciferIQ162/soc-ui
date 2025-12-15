import { useEffect } from "react"
import { useAlerts } from "@/src/store/useAlerts"
import { connectSOCSocket } from "@/lib/ws"

export function useSOCSocket() {
  const addAlert = useAlerts((s: any) => s.addAlert)

  useEffect(() => {
    const ws = connectSOCSocket(addAlert)
    return () => ws.close()
  }, [])
}
