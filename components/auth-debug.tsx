"use client"

import { useAuth } from '@/hooks/use-auth'
import { getUserFromToken, isAuthenticated } from '@/lib/api/auth'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export function AuthDebug() {
  const { user, isAuthenticated: isAuth, isLoading } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const debug = {
      isAuthenticated: isAuthenticated(),
      tokenData: getUserFromToken(),
      cookies: {
        jwtToken: Cookies.get('jwtToken'),
        user: Cookies.get('user'),
        userId: Cookies.get('userId')
      },
      contextUser: user,
      contextIsAuth: isAuth,
      contextIsLoading: isLoading
    }
    setDebugInfo(debug)
    console.log('Debug Info:', debug)
  }, [user, isAuth, isLoading])

  if (!debugInfo) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  )
}
