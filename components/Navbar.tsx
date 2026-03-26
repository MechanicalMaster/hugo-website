'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const navLinks = [
  { href: '/projects/', label: 'Projects' },
  { href: '/tags/', label: 'Tags' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-lg font-normal tracking-tight text-[var(--fg)] hover:text-brand-500 transition-colors"
        >
          Ronak Sethiya
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)]"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-[var(--border)] bg-[var(--bg)] px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
