export function TrustBar() {
  const companies = [
    { name: 'YES BANK', color: 'text-blue-600 dark:text-blue-400' },
    { name: 'IDFC FIRST BANK', color: 'text-emerald-600 dark:text-emerald-400' },
    { name: 'L&T', color: 'text-slate-700 dark:text-slate-300' },
  ]

  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)] py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-medium text-[var(--muted)] uppercase tracking-widest mb-5">
          Companies I&apos;ve worked with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {companies.map((c) => (
            <span
              key={c.name}
              className={`font-bold text-base sm:text-lg tracking-tight opacity-70 hover:opacity-100 transition-opacity ${c.color}`}
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
