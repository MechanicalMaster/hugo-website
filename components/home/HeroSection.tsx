import Image from 'next/image'
import Link from 'next/link'
import { Code2, Globe, Mail, MessageCircle, FileText, ArrowRight } from 'lucide-react'

const socialLinks = [
  {
    href: 'https://github.com/MechanicalMaster',
    label: 'GitHub',
    icon: Code2,
  },
  {
    href: 'https://www.linkedin.com/in/ronaksethiya/',
    label: 'LinkedIn',
    icon: Globe,
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
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight text-[var(--fg)] mb-4">
            I build products<br className="hidden sm:block" /> that{' '}
            <span className="text-gradient">ship and scale.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[var(--muted)] mb-8 max-w-lg mx-auto md:mx-0">
            6+ years turning complex problems into products people actually want.
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
