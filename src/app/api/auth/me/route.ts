import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

const SESSION_COOKIE_NAME = 'agronomy_session'

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  try {
    const adminAuth = getAdminAuth()
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)

    const adminDb = getAdminDb()
    const userSnapshot = await adminDb.collection('users').doc(decoded.uid).get()
    const profile = userSnapshot.exists ? userSnapshot.data() : null

    const createdAtValue = (() => {
      const raw = profile?.createdAt
      if (!raw) {
        return null
      }
      if (typeof raw === 'string') {
        return raw
      }
      if (typeof raw === 'object' && 'toDate' in raw && typeof raw.toDate === 'function') {
        return raw.toDate().toISOString()
      }
      return null
    })()

    return NextResponse.json(
      {
        user: {
          uid: decoded.uid,
          email: decoded.email ?? profile?.email ?? null,
          name: decoded.name ?? profile?.fullName ?? null,
          chapterInterest: profile?.chapterInterest ?? null,
          createdAt: createdAtValue,
          role: profile?.role ?? 'member',
          verified: profile?.verified ?? false,
          chapterId: profile?.chapterId ?? null,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to verify session cookie', error)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
