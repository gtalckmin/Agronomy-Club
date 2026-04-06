import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// 12-hour session lifetime: user must re-authenticate after 12 hours
// Firebase SDK auto-refreshes tokens for up to 7 days of inactivity
const TOKEN_LIFETIME_MS = 60 * 60 * 12 * 1000 // 12 hours
const TOKEN_COOKIE_NAME = 'firebase_token'

export async function POST(request: Request) {
  const { idToken } = await request.json()

  if (!idToken || typeof idToken !== 'string') {
    console.warn('[auth/session] POST: Invalid token format')
    return NextResponse.json({ error: 'Missing or invalid token' }, { status: 400 })
  }

  try {
    if (idToken.length < 100) {
      console.warn('[auth/session] POST: Token too short:', idToken.length)
      return NextResponse.json({ error: 'Token format invalid' }, { status: 400 })
    }

    console.log('[auth/session] POST: Route handler invoked, setting cookie, token length:', idToken.length)

    // Simple approach: store Firebase ID token in a secure HTTP-only cookie
    // Token validation happens in /api/auth/me using JWT signature verification
    const response = NextResponse.json({ ok: true, message: 'Session created successfully' })
    
    // OPTION 2: Use SameSite=Lax for non-cross-domain but keep session persistence
    const isProd = process.env.NODE_ENV === 'production';
    
    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: idToken,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_LIFETIME_MS / 1000,
    })

    console.log('[auth/session] POST: Cookie set successfully')
    // Add header to prove this endpoint was reached
    response.headers.set('X-Handler-Invoked', 'true')
    return response
  } catch (error) {
    console.error('[auth/session] POST: Failed to set token cookie', error)
    return NextResponse.json({ error: 'Failed to set session' }, { status: 500 })
  }
}

export async function DELETE() {
  console.log('[auth/session] DELETE: Clearing session')
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(TOKEN_COOKIE_NAME)
  return response
}
