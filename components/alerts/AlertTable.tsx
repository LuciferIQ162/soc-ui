import * as React from "react"
import { Badge } from "@/components/ui/badge"

export default function AlertTable() {
  return (
    <table className="w-full text-sm border border-slate-800">
      <thead className="bg-slate-900">
        <tr>
          <th className="p-2 text-left">Alert ID</th>
          <th>Type</th>
          <th>Severity</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t border-slate-800">
          <td className="p-2">inc-005</td>
          <td>SSH Brute Force</td>
          <td><Badge variant="destructive">HIGH</Badge></td>
        </tr>
      </tbody>
    </table>
  )
}
