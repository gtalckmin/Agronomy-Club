import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Query, DocumentData } from 'firebase-admin/firestore'
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

const SESSION_COOKIE_NAME = 'agronomy_session'

async function verifySessionCookie() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    return null
  }

  try {
    const adminAuth = getAdminAuth()
    return await adminAuth.verifySessionCookie(sessionCookie, true)
  } catch (error) {
    console.error('Failed to verify session cookie', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const decoded = await verifySessionCookie()

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pageSize = parseInt(searchParams.get('pageSize') ?? '20', 10)
    const pageToken = searchParams.get('pageToken')
    const chapterId = searchParams.get('chapterId')
    const search = searchParams.get('search')?.toLowerCase()

    const adminDb = getAdminDb()
    let query: Query<DocumentData> = adminDb.collection('users')

    // Filter by chapter if provided
    if (chapterId) {
      query = query.where('chapterId', '==', chapterId)
    }

    // Fetch one extra to determine if there are more pages
    const snapshot = await query.limit(pageSize + 1).get()

    const members = snapshot.docs.slice(0, pageSize).map((doc) => {
      const data = doc.data()
      return {
        uid: doc.id,
        name: data.fullName || 'Unknown',
        email: data.email,
        chapterInterest: data.chapterInterest,
        avatar: data.avatarUrl,
        role: data.role || 'member',
        bio: data.bio,
        joinedAt: data.joinedAt || data.createdAt,
      }
    })

    // Filter by search term (client-side, since Firestore doesn't support full-text search easily)
    let filtered = members
    if (search) {
      filtered = members.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.email.toLowerCase().includes(search) ||
          m.chapterInterest?.toLowerCase().includes(search)
      )
    }

    const hasMore = snapshot.docs.length > pageSize

    return NextResponse.json({
      members: filtered,
      hasMore,
      pageToken: hasMore ? snapshot.docs[pageSize]?.id : null,
    })
  } catch (error) {
    console.error('Failed to fetch members', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
