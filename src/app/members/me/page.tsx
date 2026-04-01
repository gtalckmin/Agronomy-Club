'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { ArrowLeft } from 'lucide-react'

type FormState = {
  bio: string
  avatarUrl: string
  chapterInterest: string
}

type StatusState =
  | { type: 'idle'; message: null }
  | { type: 'pending'; message: string }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }

export default function MyProfilePage() {
  const { status, user, refresh } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState<FormState>({
    bio: '',
    avatarUrl: '',
    chapterInterest: '',
  })
  const [statusMsg, setStatusMsg] = useState<StatusState>({ type: 'idle', message: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && user) {
      // Pre-fill form with existing data
      setForm((prev) => ({
        ...prev,
        bio: user.name || '',
        chapterInterest: user.chapterInterest || '',
      }))
      setLoading(false)
    }
  }, [status, user, router])

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatusMsg({ type: 'pending', message: 'Updating your profile…' })

    try {
      const response = await fetch(`/api/members/${user?.uid}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: form.bio,
          avatarUrl: form.avatarUrl,
          chapterInterest: form.chapterInterest,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setStatusMsg({
        type: 'success',
        message: 'Profile updated successfully!',
      })

      // Refresh auth context to reflect changes
      await refresh()

      setTimeout(() => {
        router.push(`/members/${user?.uid}`)
      }, 1500)
    } catch (error) {
      console.error('Error updating profile:', error)
      setStatusMsg({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile.',
      })
    }
  }

  if (status === 'loading' || loading) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 rounded bg-green-100" />
        </div>
      </section>
    )
  }

  if (!user) {
    return null // Redirect happens in useEffect
  }

  const isSubmitting = statusMsg.type === 'pending'

  return (
    <section className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href={`/members/${user.uid}`}
        className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to my profile
      </Link>

      <div className="rounded-2xl border border-green-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-900">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange('bio')}
              placeholder="Tell fellow members about yourself…"
              rows={4}
              className="mt-1 w-full rounded-lg border border-green-200 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>

          <div>
            <label htmlFor="chapterInterest" className="block text-sm font-semibold text-gray-900">
              Chapter Interest
            </label>
            <input
              id="chapterInterest"
              name="chapterInterest"
              type="text"
              value={form.chapterInterest}
              onChange={handleChange('chapterInterest')}
              placeholder="e.g., Midwest Regional Chapter, Sahel Innovation Hub"
              className="mt-1 w-full rounded-lg border border-green-200 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>

          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-semibold text-gray-900">
              Avatar URL (optional)
            </label>
            <input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              value={form.avatarUrl}
              onChange={handleChange('avatarUrl')}
              placeholder="https://example.com/avatar.jpg"
              className="mt-1 w-full rounded-lg border border-green-200 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-green-400 disabled:hover:bg-green-400"
          >
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>

          {statusMsg.type === 'success' && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {statusMsg.message}
            </div>
          )}
          {statusMsg.type === 'error' && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {statusMsg.message}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
