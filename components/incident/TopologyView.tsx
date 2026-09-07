export function TopologyView({ topology }: { topology: Record<string, string[]> }) {
  const services = Object.keys(topology);

  return (
    <div>
      {services.length === 0 ? (
        <p className="text-sm text-text-secondary">No topology data for this incident&rsquo;s services yet.</p>
      ) : (
        <ul className="space-y-1.5">
          {services.map((service) => (
            <li key={service} className="rounded-lg border border-border bg-surface-1 px-3 py-2.5 text-sm">
              <span className="font-medium text-text-primary">{service}</span>
              {topology[service].length > 0 && (
                <span className="text-text-secondary"> → {topology[service].join(", ")}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
