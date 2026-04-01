'use client'

import { useEffect, useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { Users } from 'lucide-react'

type Member = {
  uid: string
  name: string
  email: string
  chapterInterest?: string
  avatar?: string
  role: string
  bio?: string
  joinedAt?: string
}

export default function MembersPage() {
  const { status, isAuthenticated } = useAuth()
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ pageSize: '100' })
      if (search) params.append('search', search)

      const response = await fetch(`/api/members/list?${params}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch members')
      }

      const data = await response.json()
      setMembers(data.members || [])
    } catch (err) {
      console.error('Error fetching members:', err)
      setError('Could not load members. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchMembers()
    }
  }, [status, router, fetchMembers])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchMembers()
  }

  if (status === 'loading') {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-green-100" />
          <div className="h-60 rounded bg-green-50" />
        </div>
      </section>
    )
  }

  if (!isAuthenticated) {
    return null // Redirect happens in useEffect
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-green-700" />
          <h1 className="text-4xl font-bold text-gray-900">Member Directory</h1>
        </div>
        <p className="text-lg text-gray-600">
          Connect with fellow agronomy club members, explore their expertise, and find chapter leads near you.
        </p>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="mb-8 rounded-xl border border-green-100 bg-white p-6 shadow-sm"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or chapter..."
            value={search}
            onChange={handleSearchChange}
            className="flex-1 rounded-lg border border-green-200 bg-white px-4 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
          <button
            type="submit"
            className="rounded-lg bg-green-700 px-6 py-2 font-semibold text-white transition hover:bg-green-800"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-green-50 p-4 h-24" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-xl border border-green-100 bg-white p-8 text-center">
          <p className="text-gray-600">
            {search ? 'No members found matching your search.' : 'No members available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Link
              key={member.uid}
              href={`/members/${member.uid}`}
              className="rounded-xl border border-green-100 bg-white p-4 shadow-sm transition hover:border-green-300 hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                  <p className="text-xs text-green-700 uppercase font-medium">{member.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{member.email}</p>
              <p className="text-sm text-gray-500">{member.chapterInterest || 'Chapter: Not specified'}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
