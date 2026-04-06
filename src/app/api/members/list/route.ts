import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyFirebaseToken } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

const TOKEN_COOKIE_NAME = 'firebase_token'
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'agronomy-club'

async function verifyToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    return await verifyFirebaseToken(token, PROJECT_ID)
  } catch (error) {
    console.error('Failed to verify token', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const decoded = await verifyToken()

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // NOTE: Members list endpoint requires Firestore access
    // In Option 1 architecture, Firestore queries should be done from the client or via REST API
    // For now, this endpoint returns a placeholder response
    
    const { searchParams } = new URL(request.url)
    const pageSize = parseInt(searchParams.get('pageSize') ?? '20', 10)
    const chapterId = searchParams.get('chapterId')
    
    // TODO: Implement Firestore REST API calls to fetch members
    // Or use client-side Firebase SDK for member queries
    
    return NextResponse.json({
      error: 'Members endpoint is under development',
      message: 'For MVP Phase 1, please fetch members from the client using Firebase SDK',
      members: [],
      hasMore: false,
      pageToken: null,
    }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch members', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
