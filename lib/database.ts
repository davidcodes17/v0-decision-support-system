import { supabase } from "./supabase"

// Products
export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function addProduct(product: Omit<any, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("products").insert([product]).select()

  if (error) throw error
  return data[0]
}

// Sales
export async function getSales(startDate?: string, endDate?: string) {
  let query = supabase
    .from("sales")
    .select(`
      *,
      products(name, category),
      customers(name, customer_type)
    `)
    .order("sale_date", { ascending: false })

  if (startDate) {
    query = query.gte("sale_date", startDate)
  }
  if (endDate) {
    query = query.lte("sale_date", endDate)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function addSale(sale: Omit<any, "id" | "created_at">) {
  const { data, error } = await supabase.from("sales").insert([sale]).select()

  if (error) throw error
  return data[0]
}

// Customers
export async function getCustomers() {
  const { data, error } = await supabase.from("customers").select("*").order("total_spent", { ascending: false })

  if (error) throw error
  return data
}

export async function addCustomer(customer: Omit<any, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("customers").insert([customer]).select()

  if (error) throw error
  return data[0]
}

// Suppliers
export async function getSuppliers() {
  const { data, error } = await supabase.from("suppliers").select("*").order("reliability_score", { ascending: false })

  if (error) throw error
  return data
}

export async function addSupplier(supplier: Omit<any, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("suppliers").insert([supplier]).select()

  if (error) throw error
  return data[0]
}

// Analytics functions
export async function getSalesAnalytics(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from("sales")
    .select(`
      total_amount,
      quantity,
      sale_date,
      products(name, category),
      customers(customer_type)
    `)
    .gte("sale_date", startDate)
    .lte("sale_date", endDate)

  if (error) throw error
  return data
}

export async function getTopProducts(limit = 10) {
  const { data, error } = await supabase
    .from("sales")
    .select(`
      product_id,
      products(name, category, price),
      quantity,
      total_amount
    `)
    .order("total_amount", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getInventoryStatus() {
  const { data, error } = await supabase.from("products").select("*").order("stock_quantity", { ascending: true })

  if (error) throw error
  return data
}
