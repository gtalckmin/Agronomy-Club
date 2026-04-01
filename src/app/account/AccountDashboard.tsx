'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'

export default function AccountDashboard() {
  const { status, user, signOut } = useAuth()

  if (status === 'loading') {
    return (
      <div className="mt-10 rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-40 rounded bg-green-100" />
          <div className="h-3 w-full rounded bg-green-50" />
          <div className="h-3 w-3/4 rounded bg-green-50" />
          <div className="h-3 w-2/3 rounded bg-green-50" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mt-10 rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Choose your next step</h2>
        <div className="mt-4 space-y-3 text-sm text-gray-700">
          <p>
            • Returning members: head to the sign-in preview to experience our password rules and future MFA prompts.
          </p>
          <p>
            • New to the club: complete the registration form so chapter leads can triage onboarding once accounts go live.
          </p>
          <p>
            • Curious about communities: visit the community hub to see how updates and collaboration tools are shaping up.
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/signin"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
          >
            Create account
          </Link>
        </div>
        <Link
          href="/community"
          className="mt-6 inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-800"
        >
          Preview community hub →
        </Link>
      </div>
    )
  }

  const displayName = user.name ?? user.email ?? 'Agronomy Member'

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">Welcome back</p>
            <h2 className="text-2xl font-semibold text-gray-900">{displayName}</h2>
            <p className="mt-1 text-sm text-gray-600">
              Keep your chapter interest current so leaders can share local programming and agronomy opportunities.
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center justify-center rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-600 hover:text-white"
          >
            Sign out
          </button>
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-green-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-green-800">Email</dt>
            <dd className="mt-1 text-sm text-green-900">{user.email ?? '—'}</dd>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-green-800">Chapter interest</dt>
            <dd className="mt-1 text-sm text-green-900">{user.chapterInterest ?? 'Share your region to personalize updates.'}</dd>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-green-800">Member since</dt>
            <dd className="mt-1 text-sm text-green-900">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Coming soon'}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Next on your Agronomy roadmap</h3>
        <ul className="mt-4 space-y-3 text-sm text-gray-700">
          <li>• Confirm your chapter interest so the right advisor can reach out.</li>
          <li>• Watch for agronomy competitions and field days in the competitions portal.</li>
          <li>
            • Join the <Link href="/community" className="text-green-700 hover:text-green-800">community hub</Link> to share crop trial results and best practices.
          </li>
        </ul>
      </div>
    </div>
  )
}
