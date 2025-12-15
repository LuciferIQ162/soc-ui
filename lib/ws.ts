export function connectSOCSocket(onAlert: (a: any) => void) {
  const base = process.env.NEXT_PUBLIC_SOC_API || "http://127.0.0.1:8000"
  const wsUrl = base.replace(/^http/, "ws") + "/ws"

  const ws = new WebSocket(wsUrl)

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      if (msg?.type === "alert") {
        onAlert(msg.payload)
      }
    } catch {
      // ignore malformed messages
    }
  }

  return ws
}
