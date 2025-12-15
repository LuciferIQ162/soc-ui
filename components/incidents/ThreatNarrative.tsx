import * as React from "react"

export default function ThreatNarrative() {
  return (
    <div className="border border-slate-800 p-4 bg-slate-900 text-sm">
      <h3 className="font-semibold mb-2">Threat Explanation</h3>
      <p className="text-slate-300">
        Repeated authentication failures indicate a brute-force attempt
        targeting credential access.
      </p>
    </div>
  )
}
