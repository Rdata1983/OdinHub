import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for saved token on component mount
    const savedToken = localStorage.getItem("authToken")
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const login = (newToken: string) => {
    setToken(newToken)
    localStorage.setItem("authToken", newToken)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem("authToken")
  }

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

