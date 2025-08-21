import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Disable URL session detection for faster loading
  },
  global: {
    headers: {
      "cache-control": "no-cache",
    },
  },
})

// Auth types
export interface User {
  id: string
  email: string
  role: "admin" | "manager" | "staff"
  full_name: string
  staff_id?: string
  created_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
}

// Simple demo authentication (for development)
const DEMO_ADMIN = {
  email: "admin@soaringmart.ng",
  password: "admin123",
  id: "demo-admin-123",
  full_name: "System Administrator",
  role: "admin" as const,
}

// Auth functions
export const signUp = async (email: string, password: string, fullName: string, role = "staff") => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  })

  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  // Check for demo admin first (instant login)
  if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
    // Store demo user in localStorage for persistence
    const demoUser = {
      id: DEMO_ADMIN.id,
      email: DEMO_ADMIN.email,
      user_metadata: {
        full_name: DEMO_ADMIN.full_name,
        role: DEMO_ADMIN.role,
      },
      created_at: new Date().toISOString(),
    }

    // Use setTimeout to simulate async but make it instant
    return new Promise((resolve) => {
      localStorage.setItem("demo_user", JSON.stringify(demoUser))
      // Trigger storage event for other tabs
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "demo_user",
          newValue: JSON.stringify(demoUser),
        }),
      )
      resolve({ user: demoUser, session: { user: demoUser } })
    })
  }

  // Try regular Supabase auth with timeout
  const authPromise = supabase.auth.signInWithPassword({
    email,
    password,
  })

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Login timeout - please try again")), 10000),
  )

  const { data, error } = (await Promise.race([authPromise, timeoutPromise])) as any

  if (error) throw error
  return data
}

export const signOut = async () => {
  // Clear demo user
  localStorage.removeItem("demo_user")

  // Sign out from Supabase with timeout
  try {
    const signOutPromise = supabase.auth.signOut()
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Signout timeout")), 5000))

    await Promise.race([signOutPromise, timeoutPromise])
  } catch (error) {
    console.warn("Signout timeout, but local session cleared")
  }
}

export const getCurrentUser = async () => {
  // Check for demo user first
  const demoUser = localStorage.getItem("demo_user")
  if (demoUser) {
    return JSON.parse(demoUser)
  }

  // Get from Supabase with timeout
  try {
    const userPromise = supabase.auth.getUser()
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("User fetch timeout")), 5000))

    const {
      data: { user },
      error,
    } = (await Promise.race([userPromise, timeoutPromise])) as any
    if (error) throw error
    return user
  } catch (error) {
    console.warn("User fetch timeout")
    return null
  }
}

export const updateUserProfile = async (updates: any) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  })

  if (error) throw error
  return data
}
