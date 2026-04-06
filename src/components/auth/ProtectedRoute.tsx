'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { Loader } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'member' | 'chapter_lead' | 'curator' | 'admin' | 'member'[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { status, isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    if (!isAuthenticated) {
      router.replace('/auth/signin')
      return
    }

    // Role-based access control
    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (user?.role && !allowedRoles.includes(user.role)) {
        router.replace('/account')
        return
      }
    }
  }, [status, isAuthenticated, user, requiredRole, router])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-green-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Check role permissions if required
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (user?.role && !allowedRoles.includes(user.role)) {
      return null
    }
  }

  return <>{children}</>
}
