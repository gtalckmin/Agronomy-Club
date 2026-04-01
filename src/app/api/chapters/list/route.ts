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

export async function GET(request: NextRequest) {
  const decoded = await verifySessionCookie()

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminDb = getAdminDb()
    const snapshot = await adminDb.collection('chapters').get()

    const chapters = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        region: data.region,
        description: data.description,
        membersCount: data.memberCount || 0,
        leadName: data.leadName,
        leadEmail: data.leadEmail,
        imageUrl: data.imageUrl,
      }
    })

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error('Failed to fetch chapters', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
