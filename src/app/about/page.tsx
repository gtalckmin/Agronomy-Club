import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | Agronomy Club',
  description: 'Discover the purpose, values, and impact strategy guiding the Agronomy Club.',
}

export default function AboutPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-6 text-gray-700">
        <div>
          <p className="text-sm uppercase tracking-widest text-green-600">Our purpose</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Growing resilient food systems through collaboration</h1>
          <p className="mt-4 text-lg leading-relaxed">
            The Agronomy Club empowers students, researchers, and professionals to collaborate on solutions that
            strengthen global food security. We blend scientific exploration with community-driven field work to
            accelerate sustainable agricultural impact.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Our pillars</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>⚙️ Research &amp; Innovation — Translating agronomic science into applied solutions.</li>
              <li>🤝 Community Engagement — Connecting chapters and partners across regions.</li>
              <li>🌱 Sustainability — Championing climate-smart practices and regenerative agriculture.</li>
              <li>🎓 Education — Building leadership and technical skills in the agri-food workforce.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-green-100 bg-green-50 p-6 shadow-inner">
            <h2 className="text-xl font-semibold text-green-900">Strategic priorities</h2>
            <p className="mt-3 text-sm text-green-800 leading-relaxed">
              Every growing season we identify focus areas with our advisory board and industry partners, publishing a
              living roadmap for members. This year&apos;s emphasis includes regenerative soil health, data-driven irrigation,
              and equitable market access for smallholder farmers.
            </p>
            <Link
              href="/resources"
              className="mt-5 inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-800"
            >
              View our strategic plan →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
