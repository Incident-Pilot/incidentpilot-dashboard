export function TopologyView({ topology }: { topology: Record<string, string[]> }) {
  const services = Object.keys(topology);

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-muted">
        Affected topology
      </h3>
      {services.length === 0 ? (
        <p className="mt-2 text-sm text-text-secondary">
          No topology data for this incident's services yet.
        </p>
      ) : (
        <ul className="mt-2 space-y-1">
          {services.map((service) => (
            <li
              key={service}
              className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
            >
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
