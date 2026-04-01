'use client'

import { useEffect, useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { ArrowLeft } from 'lucide-react'

type MemberProfile = {
  uid: string
  name: string
  email: string
  chapterInterest?: string
  avatar?: string
  bio?: string
  role: string
  verified?: boolean
  joinedAt?: string
  chapterId?: string
}

export default function MemberProfilePage() {
  const params = useParams()
  const uid = params.uid as string
  const { status, user } = useAuth()
  const router = useRouter()

  const [member, setMember] = useState<MemberProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMember = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/members/${uid}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch member')
      }

      const data = await response.json()
      setMember(data.member)
    } catch (err) {
      console.error('Error fetching member:', err)
      setError('Could not load member profile.')
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchMember()
    }
  }, [status, router, fetchMember])

  if (status === 'loading' || loading) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 rounded bg-green-100" />
        </div>
      </section>
    )
  }

  if (error || !member) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to directory
        </Link>
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error || 'Member not found.'}</p>
        </div>
      </section>
    )
  }

  const isOwnProfile = user?.uid === member.uid

  return (
    <section className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/members"
        className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to directory
      </Link>

      <div className="rounded-2xl border border-green-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 h-16 w-16 rounded-full bg-green-100" />
            <h1 className="text-4xl font-bold text-gray-900">{member.name}</h1>
            <p className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
              {member.role}
            </p>
            {member.verified && (
              <p className="mt-2 text-sm text-green-700 font-medium">✓ Verified member</p>
            )}
          </div>
        </div>

        <div className="space-y-6 border-t border-green-100 pt-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Email</h2>
            <p className="mt-1 text-gray-600">{member.email}</p>
          </div>

          {member.chapterInterest && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Chapter Interest</h2>
              <p className="mt-1 text-gray-600">{member.chapterInterest}</p>
            </div>
          )}

          {member.bio && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bio</h2>
              <p className="mt-1 text-gray-600">{member.bio}</p>
            </div>
          )}

          {member.joinedAt && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Member Since</h2>
              <p className="mt-1 text-gray-600">
                {new Date(member.joinedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        {isOwnProfile && (
          <div className="mt-8 border-t border-green-100 pt-6">
            <Link
              href="/members/me"
              className="inline-flex rounded-lg bg-green-700 px-6 py-2 font-semibold text-white transition hover:bg-green-800"
            >
              Edit Profile
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
