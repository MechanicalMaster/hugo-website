import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

const metrics = [
  { key: '60%', label: 'Faster lead processing' },
  { key: '3x', label: 'Improved conversion' },
  { key: '0→1', label: 'Built from scratch' },
]

const tags = ['Product Management', 'AI', 'Banking', 'Automation']

export function FeaturedWork() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl text-[var(--fg)]">
          Featured Work
        </h2>
        <Link
          href="/projects/"
          className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          All projects <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="card overflow-hidden hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5">
        <div className="flex flex-col lg:flex-row">
          {/* Content */}
          <div className="flex-1 p-6 sm:p-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800"
                >
                  {t}
                </span>
              ))}
            </div>

            <h3 className="font-display text-xl sm:text-2xl text-[var(--fg)] mb-3">
              Supply Chain Finance Lead Management
            </h3>
            <p className="text-sm text-[var(--muted)] mb-6 leading-relaxed">
              Led development of an AI-powered lead management system for YES BANK&apos;s
              Supply Chain Finance division — transforming manual banking workflows into
              an intelligent, automated pipeline.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {metrics.map((m) => (
                <div key={m.key} className="text-center">
                  <div className="font-display text-2xl text-gradient">{m.key}</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5 leading-tight">{m.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/projects/supply-chain-finance-lead-management/"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
            >
              Read case study <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Image panel */}
          <div className="lg:w-64 xl:w-80 bg-gradient-to-br from-brand-500/10 to-accent-500/10 border-t lg:border-t-0 lg:border-l border-[var(--border)] flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <span className="text-white text-2xl">🏦</span>
              </div>
              <p className="text-xs text-[var(--muted)] font-medium">YES BANK</p>
              <p className="text-xs text-[var(--muted)]">2023 – Present</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
