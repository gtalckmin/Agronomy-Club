// Option 1: Using Firebase native tokens (no firebase-admin needed)
// Tokens are validated on server using JWT signature verification with jsonwebtoken
// This avoids the Turbopack bundling issue entirely

import { verify, decode } from 'jsonwebtoken'

const FIREBASE_CERT_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'

// Cache for Firebase public keys (1 hour TTL)
let publicKeyCache: Record<string, string> | null = null
let keysCacheTime = 0
const CACHE_TTL_MS = 3600000 // 1 hour

async function getFirebasePublicKeys() {
  const now = Date.now()

  // Return cached keys if still valid
  if (publicKeyCache && keysCacheTime + CACHE_TTL_MS > now) {
    return publicKeyCache
  }

  try {
    const response = await fetch(FIREBASE_CERT_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch Firebase public keys: ${response.status}`)
    }

    const keys = await response.json()
    publicKeyCache = keys
    keysCacheTime = now

    return keys
  } catch (error) {
    console.error('Failed to get Firebase public keys:', error)
    throw error
  }
}

export async function verifyFirebaseToken(token: string, projectId: string) {
  try {
    // Decode header to get key ID (without verification first)
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid token format: expected 3 parts')
    }

    let header: any
    let payload: any

    try {
      header = JSON.parse(Buffer.from(parts[0], 'base64').toString())
      payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    } catch (e) {
      throw new Error('Invalid token encoding: unable to parse header or payload')
    }

    console.log('[token-verify] Token decoded. kid:', header.kid, 'uid:', payload.sub)

    // Validate basic claims before signature verification
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < now) {
      throw new Error(`Token has expired (exp: ${payload.exp}, now: ${now})`)
    }

    if (payload.iat && payload.iat > now + 10) { // Allow 10 second clock skew
      throw new Error(`Token not yet valid (iat: ${payload.iat}, now: ${now})`)
    }

    if (payload.aud !== projectId) {
      throw new Error(`Invalid token audience: expected ${projectId}, got ${payload.aud}`)
    }

    if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
      throw new Error(`Invalid token issuer: expected https://securetoken.google.com/${projectId}, got ${payload.iss}`)
    }

    // Get the public key for signature verification
    if (!header.kid) {
      throw new Error('Token missing key ID (kid) in header')
    }

    console.log('[token-verify] Basic claims valid, fetching public keys')
    const keys = await getFirebasePublicKeys()
    const publicKey = keys[header.kid]

    if (!publicKey) {
      console.error('[token-verify] Available key IDs:', Object.keys(keys))
      throw new Error(`Public key not found for key ID: ${header.kid}`)
    }

    console.log('[token-verify] Public key found, verifying signature')

    // Verify JWT signature using the public key
    const verified = verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    })

    console.log('[token-verify] Signature verified successfully, uid:', (verified as any).sub)
    return verified
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[token-verify] Token verification failed:', errorMsg)
    throw error
  }
}
