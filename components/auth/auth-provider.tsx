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
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Check for demo user first
        const demoUser = localStorage.getItem("demo_user")
        if (demoUser) {
          setUser(JSON.parse(demoUser))
          setLoading(false)
          return
        }

        // Check Supabase session
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("demo_user")
        setUser(null)
      } else {
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    // Listen for demo user changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "demo_user") {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue))
        } else {
          setUser(null)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const signOut = async () => {
    localStorage.removeItem("demo_user")
    await supabase.auth.signOut()
    setUser(null)
  }

  const value = {
    user,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
