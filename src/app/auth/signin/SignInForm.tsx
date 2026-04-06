"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
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
  const { refresh, isAuthenticated, status: authStatus } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authStatus !== 'loading' && isAuthenticated) {
      router.replace('/account')
    }
  }, [authStatus, isAuthenticated, router])

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured()) {
      setStatus({ type: 'error', message: 'Authentication is not yet configured.' })
      return
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      setStatus({ type: 'error', message: 'Authentication services are offline.' })
      return
    }

    setStatus({ type: 'pending', message: 'Connecting to Google…' })

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()
      
      console.log('[SignIn] Google auth succeeded, setting session')
      
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
        redirect: 'follow',
      })

      if (!sessionResponse.ok) {
        throw new Error('Could not establish a secure session with your Google account.')
      }

      setStatus({ type: 'success', message: 'Welcome! Verifying your membership…' })
      await new Promise(resolve => setTimeout(resolve, 300))
      await refresh()
      router.push('/account')
    } catch (error) {
      console.error('Google sign-in error:', error)
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Google sign-in failed. Please try again.' 
      })
    }
  }

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
// ... existing code ...

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
      
      console.log('[SignIn] Firebase auth succeeded, sending token to session endpoint')
      
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        credentials: 'include', // Include credentials to accept cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
        redirect: 'follow',
      })

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'We signed you in but could not establish a secure session. Please try again.')
      }

      console.log('[SignIn] Session endpoint succeeded, refreshing auth state')
      
      setStatus({ type: 'success', message: 'Welcome back! Verifying your session…' })

      // Wait a brief moment for the cookie to be fully set, then refresh auth state
      await new Promise(resolve => setTimeout(resolve, 200))
      
      console.log('[SignIn] Calling refresh() to check session')
      await refresh()
      
      console.log('[SignIn] Redirecting to /account')
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

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-green-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
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
