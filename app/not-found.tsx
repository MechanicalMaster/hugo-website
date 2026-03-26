import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
      <div className="font-display text-8xl text-gradient mb-4">404</div>
      <h1 className="font-display text-2xl text-[var(--fg)] mb-4">Page not found</h1>
      <p className="text-[var(--muted)] mb-8 max-w-sm mx-auto">
        This page doesn&apos;t exist or may have moved.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 
            text-white text-sm font-medium transition-all"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
        <Link
          href="/projects/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)]
            text-[var(--fg)] text-sm font-medium hover:bg-[var(--card)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          View Projects
        </Link>
      </div>
    </div>
  )
}
