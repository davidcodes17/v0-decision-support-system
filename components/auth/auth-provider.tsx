"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase, type AuthState } from "@/lib/auth"

const AuthContext = createContext<
  AuthState & {
    signOut: () => Promise<void>
  }
>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Get initial session with faster timeout
    const getInitialSession = async () => {
      try {
        // Check for demo user first (fastest)
        const demoUser = localStorage.getItem("demo_user")
        if (demoUser && mounted) {
          const parsedUser = JSON.parse(demoUser)
          setUser(parsedUser)
          setLoading(false)
          return
        }

        // Check Supabase session with timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Session timeout")), 3000), // 3 second timeout
        )

        try {
          const {
            data: { session },
          } = (await Promise.race([sessionPromise, timeoutPromise])) as any
          if (mounted) {
            setUser(session?.user ?? null)
          }
        } catch (error) {
          console.warn("Session check timed out, proceeding without auth")
          if (mounted) {
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Error getting session:", error)
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === "SIGNED_OUT") {
        localStorage.removeItem("demo_user")
        setUser(null)
      } else if (event === "SIGNED_IN" && session) {
        setUser(session.user)
      }
      setLoading(false)
    })

    // Listen for demo user changes
    const handleStorageChange = (e: StorageEvent) => {
      if (!mounted) return

      if (e.key === "demo_user") {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue))
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      mounted = false
      subscription.unsubscribe()
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const signOut = async () => {
    localStorage.removeItem("demo_user")
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
    setUser(null)
  }

  const value = {
    user,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
