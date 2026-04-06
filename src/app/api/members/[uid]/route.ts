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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params
  const decoded = await verifyToken()

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // NOTE: Member details endpoint requires Firestore access
    // In Option 1 architecture, Firestore queries should be done from the client or via REST API
    // For now, return placeholder response
    
    return NextResponse.json({
      error: 'Member endpoint is under development',
      message: 'For MVP Phase 1, please fetch member details from the client using Firebase SDK',
      member: null,
    }, { status: 200 })
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
  const decoded = await verifyToken()

  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure decoded is an object with the user ID
  if (typeof decoded !== 'object' || !decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const decodedPayload = decoded as Record<string, any>

  // Members can only update their own profile
  if ((decodedPayload.sub || decodedPayload.uid) !== uid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // NOTE: Member update endpoint requires Firestore access
    // In Option 1 architecture, Firestore writes should be done from the client or via REST API
    // For now, return placeholder response
    
    const body = await request.json()
    const { bio, avatarUrl, chapterInterest } = body

    return NextResponse.json({
      error: 'Member update is under development',
      message: 'For MVP Phase 1, please update member profile from the client using Firebase SDK',
      success: false,
    }, { status: 200 })
  } catch (error) {
    console.error('Failed to update member', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
