import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Educational Games | Agronomy Club',
  description: 'Interactive learning modules that teach agronomy concepts through play.',
}

export default function GamesPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900">Educational Games</h1>
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">
        We are building interactive experiences that reinforce agronomy fundamentals, soil science best practices, and
        climate-smart decision making. Games will launch in phases, starting with quick concept quizzes and scaling to
        scenario-based simulations that translate classroom knowledge to field-ready insights.
      </p>

      <div className="mt-10 space-y-6">
        <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Phase roadmap</h2>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>• Phase 1: Soil profile flashcards and precision irrigation quizzes</li>
            <li>• Phase 2: Crop rotation strategy game with seasonal decision points</li>
            <li>• Phase 3: Multi-player sustainability challenge powered by real datasets</li>
          </ul>
        </div>
        <div className="rounded-xl border border-dashed border-green-300 bg-green-50 p-6 text-sm text-green-800">
          <p>
            Interested in playtesting? Sign up for early access through your <span className="font-semibold">member dashboard</span> once
            authentication launches in Phase 2.
          </p>
        </div>
      </div>
    </section>
  )
}
