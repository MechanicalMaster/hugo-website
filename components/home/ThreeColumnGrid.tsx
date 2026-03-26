import { Quote } from 'lucide-react'

const experience = [
  {
    company: 'YES BANK',
    role: 'Product Manager',
    period: '2023 – Present',
    color: 'from-blue-500 to-blue-600',
    badge: 'YB',
  },
  {
    company: 'IDFC FIRST BANK',
    role: 'Product Manager',
    period: '2020 – Dec 2022',
    color: 'from-emerald-500 to-emerald-600',
    badge: 'IF',
  },
  {
    company: 'L&T',
    role: 'Engineer',
    period: '2015 – 2018',
    color: 'from-slate-500 to-slate-600',
    badge: 'LT',
  },
]

const skills = [
  'Product Strategy', 'AI/ML Products', 'Fintech', 'Banking',
  'Roadmapping', 'User Research', 'Data Analysis', 'API Design',
  'Agile / Scrum', 'Prompt Engineering', 'Python', 'SQL',
  'Stakeholder Management', 'Go-to-Market',
]

export function ThreeColumnGrid() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Experience */}
        <div className="card p-6">
          <h3 className="font-semibold text-[var(--fg)] text-sm uppercase tracking-wider mb-4">
            Experience
          </h3>
          <div className="space-y-4">
            {experience.map((e) => (
              <div key={e.company} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${e.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{e.badge}</span>
                </div>
                <div>
                  <div className="font-medium text-[var(--fg)] text-sm">{e.company}</div>
                  <div className="text-xs text-[var(--muted)]">{e.role}</div>
                  <div className="text-xs text-[var(--muted)] opacity-70">{e.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6">
          <h3 className="font-semibold text-[var(--fg)] text-sm uppercase tracking-wider mb-4">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg)] border border-[var(--border)] text-[var(--muted)] hover:text-brand-500 hover:border-brand-300 dark:hover:border-brand-600 transition-colors cursor-default"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="card p-6 bg-gradient-to-br from-brand-50/50 to-accent-500/5 dark:from-brand-900/20 dark:to-accent-500/5">
          <h3 className="font-semibold text-[var(--fg)] text-sm uppercase tracking-wider mb-4">
            What Others Say
          </h3>
          <Quote className="w-6 h-6 text-brand-400 mb-3" />
          <blockquote className="text-sm text-[var(--muted)] leading-relaxed italic mb-4">
            &ldquo;Ronak has a rare ability to combine deep product thinking with
            technical understanding. His work on our AI automation pipeline was
            transformative — he shipped things others said couldn&apos;t be done.&rdquo;
          </blockquote>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">AS</span>
            </div>
            <div>
              <div className="text-xs font-medium text-[var(--fg)]">Aman Sharma</div>
              <div className="text-xs text-[var(--muted)]">Colleague, YES BANK</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
