import React, { useCallback, useEffect, useState } from "react"
import type { AuthSession, AuthUser } from "@/types"
import { authService } from "@/lib/services"
import { clearSession, getSession, saveSession } from "@/lib/api"
import { AuthContext } from "./use-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const setSessionUser = async () => {
      const session = getSession()
      if (session?.user) {
        setUser(session.user)
      }
      setIsLoading(false)
    }
    setSessionUser()
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const session: AuthSession = await authService.login(username, password)
    saveSession(session)
    setUser(session.user)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
