export function TrustBar() {
  const companies = [
    { name: 'YES BANK', color: 'text-blue-600 dark:text-blue-400' },
    { name: 'Razorpay', color: 'text-blue-500 dark:text-blue-300' },
    { name: 'Perfios', color: 'text-green-600 dark:text-green-400' },
    { name: 'Upstox', color: 'text-purple-600 dark:text-purple-400' },
    { name: 'Crocs', color: 'text-orange-500 dark:text-orange-400' },
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
              className={`font-semibold text-base sm:text-lg tracking-tight opacity-70 hover:opacity-100 transition-opacity ${c.color}`}
            >
              {c.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
