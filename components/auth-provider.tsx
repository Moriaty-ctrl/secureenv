"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { BackendService } from "./backend-service"

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [service] = useState<BackendService>(() => new BackendService())
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token
        const isAuth = service.isAuthenticated()
        setIsAuthenticated(isAuth)

        if (isAuth) {
          // Get user info
          // In a real app, you would fetch user details here
          setUser({ username: "admin" })
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [service])

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      const success = await service.login(username, password)

      if (success) {
        setIsAuthenticated(true)
        setUser({ username })
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    service.logout()
    setIsAuthenticated(false)
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
