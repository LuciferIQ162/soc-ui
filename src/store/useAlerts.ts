import { create } from "zustand"

export type Alert = any

interface AlertState {
  alerts: Alert[]
  addAlert: (a: Alert) => void
}

export const useAlerts = create<AlertState>((set) => ({
  alerts: [],
  addAlert: (a) =>
    set((s) => ({ alerts: [a, ...s.alerts].slice(0, 100) })),
}))
