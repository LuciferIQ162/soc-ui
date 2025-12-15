type Props = {
  analysis: any
}

export default function ThreatNarrative({ analysis }: Props) {
  if (!analysis) return null

  return (
    <div className="border border-red-900 bg-black p-5 rounded-lg">
      <h3 className="text-red-500 text-lg font-bold mb-3">
        Threat Intelligence Narrative
      </h3>

      <section className="mb-4">
        <h4 className="font-semibold">Executive Summary</h4>
        <p className="text-sm opacity-90 mt-1">
          {analysis.executive_summary}
        </p>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold">Attack Narrative</h4>
        <pre className="text-sm whitespace-pre-wrap opacity-90 mt-1">
          {analysis.attack_narrative}
        </pre>
      </section>

      <section>
        <h4 className="font-semibold">Analyst Verification Checklist</h4>
        <ul className="list-disc list-inside text-sm mt-1">
          {analysis.analyst_tips.map((tip: string, i: number) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
