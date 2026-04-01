import type { Metadata } from 'next'
import { SignUpForm } from './SignUpForm'

export const metadata: Metadata = {
  title: 'Create Account | Agronomy Club',
  description: 'Register for an Agronomy Club account to join chapters, competitions, and the alumni network.',
}

export default function SignUpPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-sm uppercase tracking-widest text-green-600">Phase 2 preview</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Create your Agronomy Club account</h1>
        <p className="mt-3 text-sm text-gray-600">
          These onboarding fields were prioritized by chapter leaders to streamline membership reviews once authentication is live.
        </p>
      </header>

      <SignUpForm />
    </section>
  )
}
