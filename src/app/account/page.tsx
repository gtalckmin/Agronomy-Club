import type { Metadata } from 'next'
import AccountDashboard from './AccountDashboard'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Member Accounts | Agronomy Club',
  description: 'Manage your Agronomy Club profile, membership, and personalized learning plan.',
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">Member Accounts</h1>
        <p className="mt-4 text-lg text-gray-600">
          Track your membership status, see chapter preferences, and access community tools. Sign in to view your profile
          or create an account to join the agronomy network.
        </p>

        <AccountDashboard />
      </section>
    </ProtectedRoute>
  )
}
