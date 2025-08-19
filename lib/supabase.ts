import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: number
  name: string
  category: string
  price: number
  cost_price: number
  stock_quantity: number
  reorder_level: number
  supplier_id?: number
  created_at: string
  updated_at: string
}

export interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  customer_type: string
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: number
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  cost_rating: string
  partnership_type: string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: number
  customer_id?: number
  product_id: number
  quantity: number
  unit_price: number
  total_amount: number
  sale_date: string
  payment_method: string
  staff_id?: string
  created_at: string
}

export interface InventoryMovement {
  id: number
  product_id: number
  movement_type: string // Changed from "IN" | "OUT" to string to fix parse error
  quantity: number
  reference_type: string
  reference_id?: number
  notes?: string
  movement_date: string
  created_at: string
}
