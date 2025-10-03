import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Community Posts | Agronomy Club',
  description: 'Engage with the Agronomy Club community through discussions, announcements, and chapter highlights.',
}

export default function CommunityPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-green-600">Connect &amp; collaborate</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">Community Hub</h1>
        <p className="mt-4 text-lg text-gray-600">
          Share field updates, exchange agronomic insights, and amplify chapter initiatives. A unified feed and topic
          channels are coming soon to make it easier to collaborate across campuses and regions.
        </p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Planned features</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            <li>• Chapter announcement boards with scheduling tools</li>
            <li>• Agronomy Q&amp;A threads and field trial photo journals</li>
            <li>• Resource sharing tagged by crop, climate, and practice</li>
            <li>• Moderation and safety guidelines for respectful dialogue</li>
          </ul>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-6">
          <h2 className="text-xl font-semibold text-green-900">Get involved now</h2>
          <p className="mt-3 text-sm text-green-800">
            While we build the digital hub, join our pilot Slack community and monthly community calls.
          </p>
          <div className="mt-6 space-y-4 text-sm">
            <Link href="/account" className="block rounded-md bg-green-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-800">
              Request community access
            </Link>
            <Link href="/chapters" className="block rounded-md border border-green-600 px-4 py-3 text-center font-semibold text-green-700 transition hover:bg-green-600 hover:text-white">
              Meet local chapter leaders
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
