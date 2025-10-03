import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Member Accounts | Agronomy Club',
  description: 'Manage your Agronomy Club profile, membership, and personalized learning plan.',
}

export default function AccountPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900">Member Accounts</h1>
      <p className="mt-4 text-lg text-gray-600">
        Authentication is coming soon. Member accounts will unlock discussion posting, chapter management tools,
        personalized resource recommendations, and competition registration dashboards.
      </p>

      <div className="mt-10 rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Planned capabilities</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>• Unified profile for academic background, interests, and chapter roles</li>
          <li>• Secure document vault for credentials and fieldwork reports</li>
          <li>• Progress tracking across games, certifications, and mentorship goals</li>
        </ul>
        <Link
          href="/community"
          className="mt-6 inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-800"
        >
          Preview community hub →
        </Link>
      </div>
    </section>
  )
}
