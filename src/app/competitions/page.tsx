import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Competitions | Agronomy Club',
  description: 'Showcase your agronomy expertise in research challenges, pitch contests, and field diagnostics.',
}

export default function CompetitionsPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900">Competitions</h1>
      <p className="mt-4 text-lg text-gray-600">
        The Competitions platform will spotlight annual challenges, scoreboards, and judging criteria. We collaborate
        with industry partners to provide resources and mentorship for competing teams.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming formats</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>• Soil Diagnostics Field Challenge</li>
            <li>• Climate-Smart Crop Modeling Hackathon</li>
            <li>• Agribusiness Innovation Pitch</li>
          </ul>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-6 text-sm text-green-900">
          <h2 className="text-lg font-semibold">How to prepare</h2>
          <p className="mt-3">
            Members will get access to prep kits, timelines, and mentorship sign-ups. Subscribe to the community
            newsletter for early registration alerts.
          </p>
        </div>
      </div>
    </section>
  )
}
