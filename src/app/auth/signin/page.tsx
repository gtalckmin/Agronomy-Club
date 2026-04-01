import type { Metadata } from 'next'
import { SignInForm } from './SignInForm'

export const metadata: Metadata = {
  title: 'Sign In | Agronomy Club',
  description: 'Access your Agronomy Club account to manage chapters, resources, and competitions.',
}

export default function SignInPage() {
  return (
    <section className="max-w-md mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <header className="text-center">
        <p className="text-sm uppercase tracking-widest text-green-600">Member access</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Sign in to Agronomy Club</h1>
        <p className="mt-3 text-sm text-gray-600">
          Secure authentication is part of Phase 2. Use this preview to prepare content, validation, and future API wiring.
        </p>
      </header>

      <SignInForm />
    </section>
  )
}
