"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FirebaseError } from 'firebase/app'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { validationRules } from '@/lib/security'
import { getFirebaseAuth, getFirestoreDb, isFirebaseConfigured } from '@/lib/firebase/client'
import { useAuth } from '@/components/auth/AuthProvider'

type FormState = {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  chapterInterest: string
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
  confirmPassword: '',
  fullName: '',
  chapterInterest: '',
}

function usePasswordBlacklist() {
  return useMemo(
    () => new Set(validationRules.password.blacklistedPasswords.map((password) => password.toLowerCase())),
    []
  )
}

function validatePassword(password: string, blacklist: Set<string>) {
  if (password.length < validationRules.password.minLength) {
    return `Password must be at least ${validationRules.password.minLength} characters.`
  }
  if (validationRules.password.requireUppercase && !/[A-Z]/.test(password)) {
    return 'Include at least one uppercase letter.'
  }
  if (validationRules.password.requireLowercase && !/[a-z]/.test(password)) {
    return 'Include at least one lowercase letter.'
  }
  if (validationRules.password.requireNumbers && !/[0-9]/.test(password)) {
    return 'Include at least one number.'
  }
  if (validationRules.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>\-_+=\[\]~]/.test(password)) {
    return 'Include at least one special character.'
  }
  if (blacklist.has(password.toLowerCase())) {
    return 'Choose a password that is harder to guess.'
  }
  return null
}

export function SignUpForm() {
  const blacklist = usePasswordBlacklist()
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<StatusState>({ type: 'idle', message: null })
  const { refresh } = useAuth()
  const router = useRouter()

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setStatus({ type: 'idle', message: null })
  }

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Please share your name so chapters can greet you properly.'
    }

    if (!validationRules.email.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    const passwordError = validatePassword(form.password, blacklist)
    if (passwordError) {
      nextErrors.password = passwordError
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords must match.'
    }

    if (!form.chapterInterest.trim()) {
      nextErrors.chapterInterest = 'Let us know your primary region or chapter focus.'
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
    const db = getFirestoreDb()

    if (!auth || !db) {
      setStatus({
        type: 'error',
        message: 'Authentication services are offline. Please try again later.',
      })
      return
    }

    setStatus({ type: 'pending', message: 'Creating your Agronomy Club account…' })

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)

      await updateProfile(userCredential.user, {
        displayName: form.fullName,
      })

      const userDocument = doc(db, 'users', userCredential.user.uid)
      await setDoc(userDocument, {
        uid: userCredential.user.uid,
        fullName: form.fullName.trim(),
        email: form.email.toLowerCase(),
        chapterInterest: form.chapterInterest.trim(),
        role: 'member',
        verified: false,
        createdAt: serverTimestamp(),
        joinedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      const idToken = await userCredential.user.getIdToken()
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      if (!sessionResponse.ok) {
        throw new Error('We created your account but could not establish a secure session. Please try signing in.')
      }

      await refresh()
      setStatus({
        type: 'success',
        message: 'All set! Your account is ready. Redirecting you to your dashboard…',
      })
      setErrors({})
      setForm(initialState)
      router.push('/account')
    } catch (error) {
      let message = 'Something went wrong while creating your account. Please try again.'

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = 'That email is already registered. Try signing in instead.'
            break
          case 'auth/weak-password':
            message = 'Please choose a stronger password to finish signing up.'
            break
          case 'auth/network-request-failed':
            message = 'We lost connection while contacting Firebase. Check your network and try again.'
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
      className="mt-10 space-y-6 rounded-2xl border border-green-100 bg-white/95 p-6 shadow-sm"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange('fullName')}
            className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            placeholder="Amelia Torres"
          />
          {errors.fullName ? <p className="mt-2 text-xs text-red-600">{errors.fullName}</p> : null}
        </div>

        <div className="sm:col-span-2">
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
            placeholder="you@example.edu"
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
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange('password')}
            className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            placeholder="Create a strong password"
            aria-describedby="password-help"
          />
          <p id="password-help" className="mt-2 text-xs text-gray-500">
            Must include upper & lower case letters, a number, and a special character.
          </p>
          {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword ? <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p> : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="chapterInterest" className="block text-sm font-semibold text-gray-900">
            Chapter or region of interest
          </label>
          <input
            id="chapterInterest"
            name="chapterInterest"
            type="text"
            value={form.chapterInterest}
            onChange={handleChange('chapterInterest')}
            className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            placeholder="e.g., Midwest Regional Chapter, Sahel Innovation Hub"
          />
          {errors.chapterInterest ? <p className="mt-2 text-xs text-red-600">{errors.chapterInterest}</p> : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-green-400 disabled:hover:bg-green-400"
      >
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </button>

      <div className="text-center text-sm text-gray-600">
        <span>Already part of the community?</span>{' '}
        <Link href="/auth/signin" className="font-semibold text-green-700 hover:text-green-800">
          Sign in here
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
