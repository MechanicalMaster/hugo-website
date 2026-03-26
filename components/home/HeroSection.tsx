import Image from 'next/image'
import Link from 'next/link'
import { Mail, MessageCircle, FileText, ArrowRight } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

const socialLinks = [
  {
    href: 'https://github.com/MechanicalMaster',
    label: 'GitHub',
    icon: GithubIcon,
  },
  {
    href: 'https://www.linkedin.com/in/ronaksethiya/',
    label: 'LinkedIn',
    icon: LinkedinIcon,
  },
  {
    href: 'mailto:job@ronaksethiya.com',
    label: 'Email',
    icon: Mail,
  },
  {
    href: 'https://wa.me/8454881721',
    label: 'WhatsApp',
    icon: MessageCircle,
  },
]

export function HeroSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12">
      <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-10 md:gap-16">
        {/* Text column */}
        <div className="flex-1 text-center md:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
            bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-700/50 
            text-brand-600 dark:text-brand-400 text-xs font-medium tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Product Manager focused on AI &amp; Fintech
          </div>

          {/* H1 */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight text-[var(--fg)] mb-4 font-bold">
            I build products<br className="hidden sm:block" /> that{' '}
            <span className="text-gradient">ship and scale.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[var(--muted)] mb-8 max-w-lg mx-auto md:mx-0">
            10+ years turning complex problems into products people actually want.
            Currently at{' '}
            <span className="text-[var(--fg)] font-medium">YES BANK</span> leading
            AI-powered fintech products.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 mb-8">
            <a
              href="mailto:job@ronaksethiya.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 
                text-white font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/25
                hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              Let&apos;s Talk
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/files/Ronak_Sethiya_CV.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)]
                text-[var(--fg)] font-medium text-sm hover:bg-[var(--card)] transition-all duration-200
                hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              <FileText className="w-4 h-4" />
              View Resume
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            {socialLinks.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--border)]
                  text-[var(--muted)] hover:text-brand-500 hover:border-brand-300 dark:hover:border-brand-600
                  transition-all duration-200 hover:-translate-y-0.5"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Profile photo */}
        <div className="flex-shrink-0">
          <div className="relative w-48 h-48 md:w-56 md:h-56">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 opacity-20 blur-2xl scale-110" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-[var(--border)]">
              <Image
                src="/images/avatar.png"
                alt="Ronak Sethiya"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
