/**
 * Firestore document schemas and TypeScript types for the Agronomy Club.
 */

/**
 * User profile stored in the `users` collection.
 * Document ID: Firebase Auth UID
 */
export type UserProfile = {
  uid: string
  email: string
  fullName: string
  chapterInterest: string
  bio?: string
  avatarUrl?: string
  role: 'member' | 'chapter_lead' | 'curator' | 'admin'
  joinedAt: string // ISO date
  createdAt: string // ISO date
  updatedAt: string // ISO date
  verified: boolean
  skills?: string[] // e.g., ["soil science", "crop rotation"]
  chapterId?: string // Reference to chapters collection
}

/**
 * Chapter (regional or university-based).
 * Document ID: unique chapter slug (e.g., "midwest-chapter")
 */
export type Chapter = {
  id: string
  name: string
  region: string
  description: string
  leadUid: string // Reference to users collection
  leadName?: string
  leadEmail?: string
  memberCount: number
  createdAt: string // ISO date
  updatedAt: string // ISO date
  imageUrl?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

/**
 * Quiz metadata (optional, for scheduling/listing quizzes).
 * Document ID: unique quiz slug
 */
export type Quiz = {
  id: string
  title: string
  description?: string
  createdBy: string // Reference to users collection
  createdAt: string // ISO date
  updatedAt: string // ISO date
  scheduledFor?: string // ISO date for upcoming quizzes
  status: 'draft' | 'scheduled' | 'active' | 'completed'
  questions: number
  imageUrl?: string
}

/**
 * Firestore collection structure:
 * - users/{uid} → UserProfile
 * - chapters/{chapterId} → Chapter
 * - quizzes/{quizId} → Quiz
 * - quizzes/{quizId}/questions/{questionId} → QuestionData (optional, if storing questions server-side)
 */
