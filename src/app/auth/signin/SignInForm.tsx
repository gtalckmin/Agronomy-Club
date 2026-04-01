"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { validationRules } from '@/lib/security'
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase/client'
import { useAuth } from '@/components/auth/AuthProvider'

type FormState = {
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

type StatusState =
  | { type: 'idle'; message: null }
  | { type: 'pending'; message: string }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }

const initialState: FormState = {
  email: '',
  password: '',
}

export function SignInForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<StatusState>({ type: 'idle', message: null })
  const { refresh } = useAuth()
  const router = useRouter()

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setStatus({ type: 'idle', message: null })
  }

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!validationRules.email.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (form.password.length < validationRules.password.minLength) {
      nextErrors.password = `Password must be at least ${validationRules.password.minLength} characters.`
    }

    if (validationRules.password.requireUppercase && !/[A-Z]/.test(form.password)) {
      nextErrors.password = 'Include at least one uppercase letter.'
    }

    if (validationRules.password.requireLowercase && !/[a-z]/.test(form.password)) {
      nextErrors.password = 'Include at least one lowercase letter.'
    }

    if (validationRules.password.requireNumbers && !/[0-9]/.test(form.password)) {
      nextErrors.password = 'Include at least one number.'
    }

    if (validationRules.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>\-_+=\[\]~]/.test(form.password)) {
      nextErrors.password = 'Include at least one special character.'
    }

    return nextErrors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    if (!isFirebaseConfigured()) {
      setStatus({
        type: 'error',
        message: 'Authentication is not yet configured. Ask your site admin to finish the Firebase setup.',
      })
      return
    }

    const auth = getFirebaseAuth()

    if (!auth) {
      setStatus({ type: 'error', message: 'Authentication services are offline. Please try again later.' })
      return
    }

    setStatus({ type: 'pending', message: 'Signing you in securely…' })

    try {
      const credentials = await signInWithEmailAndPassword(auth, form.email, form.password)
      const idToken = await credentials.user.getIdToken()
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      if (!sessionResponse.ok) {
        throw new Error('We signed you in but could not establish a secure session. Please try again.')
      }

  await refresh()
  setStatus({ type: 'success', message: 'Welcome back! Your account is now authenticated.' })
  setErrors({})
  setForm(initialState)
  router.push('/account')
    } catch (error) {
      let message = 'Your email or password could not be verified. Please try again.'

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            message = 'We could not find an account with those credentials. Check your email and password.'
            break
          case 'auth/too-many-requests':
            message = 'Too many attempts. Please wait a moment before trying again.'
            break
          case 'auth/network-request-failed':
            message = 'We hit a network hiccup. Check your connection and retry.'
            break
          default:
            message = error.message
        }
      } else if (error instanceof Error) {
        message = error.message
      }

      setStatus({ type: 'error', message })
    }
  }

  const isSubmitting = status.type === 'pending'

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 space-y-6 rounded-xl border border-green-100 bg-white/90 p-6 shadow-sm"
      noValidate
    >
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange('email')}
          className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          placeholder="you@example.com"
        />
        {errors.email ? <p className="mt-2 text-xs text-red-600">{errors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange('password')}
          className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          placeholder="Enter your password"
          aria-describedby="password-help"
        />
        <p id="password-help" className="mt-2 text-xs text-gray-500">
          Use at least {validationRules.password.minLength} characters with upper and lower case letters, a number, and a special character.
        </p>
        {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-green-400 disabled:hover:bg-green-400"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>

      <div className="text-center text-sm text-gray-600">
        <span>Don&apos;t have an account?</span>{' '}
        <Link href="/auth/signup" className="font-semibold text-green-700 hover:text-green-800">
          Create one now
        </Link>
      </div>

      {status.type === 'success' ? (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-center text-sm text-green-700">{status.message}</p>
      ) : null}
      {status.type === 'error' ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-700">{status.message}</p>
      ) : null}
      {status.type === 'pending' ? (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-center text-sm text-green-700">{status.message}</p>
      ) : null}
    </form>
  )
}
