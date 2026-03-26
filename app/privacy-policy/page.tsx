import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Ronak Sethiya\'s personal website.',
}

async function getContent() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), 'content', 'privacy-policy.md'),
    'utf8'
  )
  const { data, content } = matter(raw)
  const html = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content)
  return { title: data.title, html: html.toString() }
}

export default async function PrivacyPolicyPage() {
  const { title, html } = await getContent()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl sm:text-4xl text-[var(--fg)] mb-8">
        {title || 'Privacy Policy'}
      </h1>
      <div className="prose-custom" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
