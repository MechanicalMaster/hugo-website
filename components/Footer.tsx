import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
        <p>© {new Date().getFullYear()} Ronak Sethiya</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy-policy/" className="hover:text-[var(--fg)] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions/" className="hover:text-[var(--fg)] transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
