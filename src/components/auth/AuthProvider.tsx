'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getFirebaseAuth } from '@/lib/firebase/client'

type AuthUser = {
  uid: string
  email: string | null
  name: string | null
  chapterInterest: string | null
  createdAt: string | null
  role?: 'member' | 'chapter_lead' | 'curator' | 'admin'
  verified?: boolean
  chapterId?: string
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
  user: AuthUser | null
  status: AuthStatus
  isAuthenticated: boolean
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const payload = await response.json()
    return payload.user ?? null
  } catch (error) {
    console.error('Failed to load session', error)
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const hydrate = useCallback(async () => {
    setStatus('loading')
    const profile = await fetchCurrentUser()

    if (profile) {
      setUser(profile)
      setStatus('authenticated')
    } else {
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const handleSignOut = useCallback(async () => {
    try {
      const auth = getFirebaseAuth()
      if (auth) {
        await auth.signOut()
      }

      await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Failed to sign out', error)
    } finally {
      setUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      refresh: hydrate,
      signOut: handleSignOut,
    }),
    [user, status, hydrate, handleSignOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
