'use client'

import { Mail, MessageCircle } from 'lucide-react'

export function CTAFooter() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      <div className="card p-8 sm:p-12 text-center bg-gradient-to-br from-brand-500/5 to-accent-500/5 border-brand-200 dark:border-brand-700/50">
        <h2 className="font-display text-2xl sm:text-3xl text-[var(--fg)] mb-3">
          Interested in working together?
        </h2>
        <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
          I&apos;m always open to interesting conversations about product, AI, and fintech.
          Reach out — I respond within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="mailto:job@ronaksethiya.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 
              text-white font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/25
              hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </a>
          <a
            href="#open-chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)]
              text-[var(--fg)] font-medium text-sm hover:bg-[var(--card)] transition-all duration-200
              hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with my AI
          </a>
        </div>
      </div>
    </section>
  )
}
