const stats = [
  {
    value: '60%',
    label: 'Faster lead processing',
    sublabel: 'via AI automation at YES BANK',
  },
  {
    value: '0→1',
    label: 'AI automation shipped',
    sublabel: 'from concept to production',
  },
  {
    value: '3x',
    label: 'Scalable impact',
    sublabel: 'across supply chain finance',
  },
]

export function StatsStrip() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.value}
            className="card p-6 text-center hover:border-brand-300 dark:hover:border-brand-600 transition-colors duration-200"
          >
            <div className="font-display text-4xl sm:text-5xl text-gradient mb-1">
              {s.value}
            </div>
            <div className="font-semibold text-[var(--fg)] text-sm mb-1">{s.label}</div>
            <div className="text-xs text-[var(--muted)]">{s.sublabel}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
