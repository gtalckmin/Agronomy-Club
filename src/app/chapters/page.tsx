import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MapPinned, Users } from 'lucide-react'
import { chapters } from '@/data/chapters'

export const metadata: Metadata = {
  title: 'Chapters | Agronomy Club',
  description: 'Discover Agronomy Club chapters, launch new student groups, and collaborate across regions.',
}

export default function ChaptersPage() {
  const acceptingChapters = chapters.filter((chapter) => chapter.isAcceptingMembers)

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-sm uppercase tracking-widest text-brand-600">Global network</p>
        <h1 className="mt-2 text-4xl font-bold text-soil-900">Chapters &amp; Field Alliances</h1>
        <p className="mt-4 text-lg text-soil-700">
          Chapters empower local leaders to adapt agronomic solutions to their region&apos;s climate, crops, and community
          needs. This directory will grow as new universities and partner farms come online.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {chapters.map((chapter) => (
          <article
            key={chapter.name}
            className="flex h-full flex-col justify-between rounded-2xl border border-brand-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
          >
            <div>
              <h2 className="text-xl font-semibold text-soil-900">{chapter.name}</h2>
              <div className="mt-3 flex items-center gap-2 text-sm text-brand-700">
                <MapPinned className="h-4 w-4" aria-hidden="true" />
                <span>{chapter.region}</span>
              </div>
              <p className="mt-3 text-sm text-soil-700">{chapter.focus}</p>
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <Link
                href={`mailto:${chapter.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-100 px-3 py-2 font-semibold text-brand-700 transition hover:bg-brand-200"
              >
                <Mail className="h-4 w-4" aria-hidden="true" /> Contact
              </Link>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  chapter.isAcceptingMembers
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-soil-100 text-soil-700'
                }`}
              >
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                {chapter.isAcceptingMembers ? 'Accepting members' : 'Waitlist only'}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-brand-400 bg-brand-50 p-8 text-sm text-brand-900">
        <h2 className="text-lg font-semibold">Start a new chapter</h2>
        <p className="mt-2">
          We provide toolkits, governance templates, and micro-grants to help you launch a chapter. You&apos;ll also be
          paired with alumni mentors and subject-matter experts.
        </p>
        <Link href="/account" className="mt-4 inline-flex items-center text-brand-700 font-semibold hover:text-brand-800">
          Apply for chapter starter kit →
        </Link>
      </div>

      <aside className="mt-12 rounded-2xl bg-white/80 p-6 text-sm text-soil-700 shadow-sm">
        <p className="font-semibold text-soil-900">Looking to collaborate?</p>
        <p className="mt-2">
          Regional research institutions and agricultural organizations can partner with accepting chapters for joint
          field trials, internship exchanges, and curriculum support. Currently {acceptingChapters.length} chapters are
          welcoming new partnerships.
        </p>
      </aside>
    </section>
  )
}
