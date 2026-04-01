import { App, cert, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let cachedApp: App | null = null

function initializeFirebaseAdmin(): App {
  if (cachedApp) {
    return cachedApp
  }

  if (getApps().length) {
    cachedApp = getApp()
    return cachedApp
  }

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!rawServiceAccount) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY is not set. Provide a service account JSON string in the environment.'
    )
  }

  const serviceAccount = JSON.parse(rawServiceAccount)
  cachedApp = initializeApp({
    credential: cert(serviceAccount),
  })

  return cachedApp
}

export function getFirebaseAdminApp() {
  return initializeFirebaseAdmin()
}

export function getAdminAuth() {
  return getAuth(initializeFirebaseAdmin())
}

export function getAdminDb() {
  return getFirestore(initializeFirebaseAdmin())
}
