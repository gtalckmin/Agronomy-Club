import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyFirebaseToken } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

const TOKEN_COOKIE_NAME = 'firebase_token'
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'agronomy-club'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value

    if (!token) {
      console.warn('[auth/me] No token cookie found')
      return NextResponse.json({ user: null }, { status: 200 })
    }

    console.log('[auth/me] Token found, length:', token.length)

    // Verify token using JWT signature validation (no firebase-admin needed)
    const decoded = await verifyFirebaseToken(token, PROJECT_ID)

    // Ensure decoded is an object (not a string)
    if (typeof decoded !== 'object' || !decoded) {
      console.warn('[auth/me] Token verification returned non-object:', typeof decoded)
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Extract user info from token claims
    // Firebase ID tokens include: uid, email, email_verified, name, picture, etc.
    const decodedPayload = decoded as Record<string, any>
    const user = {
      uid: decodedPayload.sub || decodedPayload.uid || '',
      email: decodedPayload.email || null,
      name: decodedPayload.name || null,
      picture: decodedPayload.picture || null,
      emailVerified: decodedPayload.email_verified || false,
      chapterInterest: null,
      createdAt: null,
      role: 'member', // Default role, can be extended with custom claims
      verified: decodedPayload.email_verified || false,
    }

    if (!user.uid) {
      console.warn('[auth/me] Token missing uid claim')
      return NextResponse.json({ user: null }, { status: 200 })
    }

    console.log('[auth/me] User verified:', user.email)
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[auth/me] Token verification failed:', errorMessage)
    // Return null user but 200 status (not authenticated, but request succeeded)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(TOKEN_COOKIE_NAME)
  console.log('[auth/me] DELETE: Session cleared')
  return response
}
