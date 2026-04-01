import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params
  const decoded = await verifySessionCookie()

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminDb = getAdminDb()
    const docSnapshot = await adminDb.collection('users').doc(uid).get()

    if (!docSnapshot.exists) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const data = docSnapshot.data()
    if (!data) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json({
      member: {
        uid: docSnapshot.id,
        name: data.fullName,
        email: data.email,
        chapterInterest: data.chapterInterest,
        avatar: data.avatarUrl,
        bio: data.bio,
        role: data.role || 'member',
        verified: data.verified || false,
        joinedAt: data.joinedAt || data.createdAt,
        chapterId: data.chapterId,
      },
    })
  } catch (error) {
    console.error('Failed to fetch member', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params
  const decoded = await verifySessionCookie()

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Members can only update their own profile
  if (decoded.uid !== uid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { bio, avatarUrl, chapterInterest } = body

    // Validate input
    if (typeof bio !== 'undefined' && typeof bio !== 'string') {
      return NextResponse.json({ error: 'Invalid bio' }, { status: 400 })
    }
    if (typeof avatarUrl !== 'undefined' && typeof avatarUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid avatarUrl' }, { status: 400 })
    }
    if (typeof chapterInterest !== 'undefined' && typeof chapterInterest !== 'string') {
      return NextResponse.json({ error: 'Invalid chapterInterest' }, { status: 400 })
    }

    const adminDb = getAdminDb()
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    }

    if (typeof bio !== 'undefined') updates.bio = bio
    if (typeof avatarUrl !== 'undefined') updates.avatarUrl = avatarUrl
    if (typeof chapterInterest !== 'undefined') updates.chapterInterest = chapterInterest

    await adminDb.collection('users').doc(uid).update(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update member', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
