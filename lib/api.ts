
const API_BASE = process.env.NEXT_PUBLIC_SOC_API || "http://127.0.0.1:8000";

export async function fetchLiveAlerts() {
  const res = await fetch(`${API_BASE}/api/alerts/live`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return res.json();
}
