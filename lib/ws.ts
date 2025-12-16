export function connectSOCSocket(onAlert: (a: any) => void) {
  const base = process.env.NEXT_PUBLIC_SOC_API || "http://127.0.0.1:8000"
  const wsUrl = base.replace(/^http/, "ws") + "/ws/alerts"

  try {
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg?.type === "alert") {
          onAlert(msg.payload || msg)
        } else if (msg?.alert_id) {
          // Direct alert object
          onAlert(msg)
        }
      } catch (err) {
        // ignore malformed messages
        console.debug("Failed to parse WebSocket message:", err)
      }
    }

    ws.onerror = (event) => {
      // WebSocket error event doesn't contain detailed error info
      // This is expected if backend is not running - don't log as error
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.debug("WebSocket connection issue (backend may not be running). URL:", wsUrl)
      }
    }

    ws.onopen = () => {
      console.log("WebSocket connected to:", wsUrl)
    }

    ws.onclose = (event) => {
      if (event.code !== 1000) {
        // Not a normal closure
        console.warn("WebSocket closed unexpectedly. Code:", event.code, "Reason:", event.reason || "Unknown")
      }
    }

    return ws
  } catch (error) {
    console.error("Failed to create WebSocket connection:", error)
    // Return a mock WebSocket object that won't cause errors
    return {
      close: () => {},
      readyState: WebSocket.CLOSED
    } as WebSocket
  }
}
