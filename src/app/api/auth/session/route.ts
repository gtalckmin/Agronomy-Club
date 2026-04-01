import { NextResponse } from 'next/server'
import { getAdminAuth } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

const FIVE_DAYS_IN_MS = 60 * 60 * 24 * 5 * 1000
const SESSION_COOKIE_NAME = 'agronomy_session'

export async function POST(request: Request) {
  const { idToken } = await request.json()

  if (!idToken || typeof idToken !== 'string') {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  try {
  const adminAuth = getAdminAuth()
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: FIVE_DAYS_IN_MS,
    })

    const response = NextResponse.json({ ok: true })
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: FIVE_DAYS_IN_MS / 1000,
    })

    return response
  } catch (error) {
    console.error('Failed to create session cookie', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(SESSION_COOKIE_NAME)
  return response
}
