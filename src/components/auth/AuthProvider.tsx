'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { onIdTokenChanged, type User as FirebaseUser } from 'firebase/auth'
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

function toAuthUser(firebaseUser: FirebaseUser): AuthUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    chapterInterest: null,
    createdAt: firebaseUser.metadata?.creationTime ?? null,
    role: 'member',
    verified: firebaseUser.emailVerified,
  }
}

async function syncServerSessionFromFirebaseUser(firebaseUser: FirebaseUser) {
  try {
    const idToken = await firebaseUser.getIdToken()
    await fetch('/api/auth/session', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    })
  } catch (error) {
    console.warn('Failed to sync server session from Firebase user', error)
  }
}

async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      console.warn(`Session check returned ${response.status}`)
      return null
    }

    const payload = await response.json()
    const user = payload.user ?? null
    
    if (user) {
      console.log('User authenticated:', user.email)
    }
    
    return user
  } catch (error) {
    console.error('Failed to load session:', error)
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
      return
    }

    // Fallback to client-side Firebase auth state if cookie-backed session is unavailable.
    const auth = getFirebaseAuth()
    const firebaseUser = auth?.currentUser ?? null

    if (!firebaseUser) {
      setUser(null)
      setStatus('unauthenticated')
      return
    }

    setUser(toAuthUser(firebaseUser))
    setStatus('authenticated')

    await syncServerSessionFromFirebaseUser(firebaseUser)

    const refreshedProfile = await fetchCurrentUser()
    if (refreshedProfile) {
      setUser(refreshedProfile)
    }
  }, [])

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      return
    }

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setStatus('unauthenticated')
        return
      }

      setUser((current) => current ?? toAuthUser(firebaseUser))
      setStatus('authenticated')

      await syncServerSessionFromFirebaseUser(firebaseUser)
      const profile = await fetchCurrentUser()
      if (profile) {
        setUser(profile)
      }
    })

    return unsubscribe
  }, [])

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
