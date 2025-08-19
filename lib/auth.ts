import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  // Check for demo admin first
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
    localStorage.setItem("demo_user", JSON.stringify(demoUser))
    return { user: demoUser, session: { user: demoUser } }
  }

  // Try regular Supabase auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  // Clear demo user
  localStorage.removeItem("demo_user")

  // Sign out from Supabase
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  // Check for demo user first
  const demoUser = localStorage.getItem("demo_user")
  if (demoUser) {
    return JSON.parse(demoUser)
  }

  // Get from Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const updateUserProfile = async (updates: any) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  })

  if (error) throw error
  return data
}
