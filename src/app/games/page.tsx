'use client'

import type { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Gamepad2 } from 'lucide-react'

// Note: Metadata doesn't work with 'use client', so it's moved to a separate metadata file
function GamesContent() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Gamepad2 className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl font-bold text-gray-900">Educational Games</h1>
        </div>
        <p className="text-sm text-green-600 font-semibold">Members Only</p>
      </div>

      <p className="mt-4 text-lg text-gray-600 leading-relaxed">
        Welcome to the members-only game portal! We are building interactive experiences that reinforce agronomy
        fundamentals, soil science best practices, and climate-smart decision making. Games will launch in phases,
        starting with quick concept quizzes and scaling to scenario-based simulations that translate classroom
        knowledge to field-ready insights.
      </p>

      <div className="mt-10 space-y-6">
        <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Available Games</h2>
          <div className="mt-4 space-y-4">
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <h3 className="font-semibold text-gray-900">🌾 Soil Profile Flashcards</h3>
              <p className="text-sm text-gray-600 mt-2">Learn soil composition, pH levels, and nutrient profiles through interactive flashcards.</p>
              <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                Play Now
              </button>
            </div>

            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="font-semibold text-gray-900">💧 Precision Irrigation Quiz</h3>
              <p className="text-sm text-gray-600 mt-2">Master irrigation strategies with real-world scenarios and decision-making challenges.</p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                Play Now
              </button>
            </div>

            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 opacity-60">
              <h3 className="font-semibold text-gray-900">🔄 Crop Rotation Strategy (Coming Soon)</h3>
              <p className="text-sm text-gray-600 mt-2">Plan seasonal rotations with decision points that affect crop yield and soil health.</p>
              <button className="mt-3 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed text-sm font-semibold" disabled>
                Coming in Phase 2
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Phase Roadmap</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span><strong>Phase 1:</strong> Soil profile flashcards and precision irrigation quizzes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2</span>
              <span><strong>Phase 2:</strong> Crop rotation strategy game with seasonal decision points</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">3</span>
              <span><strong>Phase 3:</strong> Multi-player sustainability challenge powered by real datasets</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-blue-300 bg-blue-50 p-6">
          <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            💡 Tips for Success
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-blue-800">
            <li>• Aim for 100% accuracy on flashcards to unlock achievements</li>
            <li>• Track your quiz scores on your <a href="/account" className="underline font-semibold">member dashboard</a></li>
            <li>• Compare scores with other members in the leaderboard (coming soon)</li>
            <li>• Earn badges and certificates as you complete games</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function GamesPage() {
  return (
    <ProtectedRoute>
      <GamesContent />
    </ProtectedRoute>
  )
}

