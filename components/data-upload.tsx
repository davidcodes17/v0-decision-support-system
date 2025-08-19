"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Upload, Plus } from "lucide-react"
import { addProduct, addCustomer, addSupplier, addSale } from "@/lib/database"

export function DataUpload() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const product = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      price: Number.parseFloat(formData.get("price") as string),
      cost_price: Number.parseFloat(formData.get("cost_price") as string),
      stock_quantity: Number.parseInt(formData.get("stock_quantity") as string),
      reorder_level: Number.parseInt(formData.get("reorder_level") as string),
      supplier_id: formData.get("supplier_id") ? Number.parseInt(formData.get("supplier_id") as string) : null,
    }

    try {
      await addProduct(product)
      toast({
        title: "Success",
        description: "Product added successfully!",
      })
      e.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const customer = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      address: (formData.get("address") as string) || null,
      customer_type: formData.get("customer_type") as string,
      total_spent: 0,
    }

    try {
      await addCustomer(customer)
      toast({
        title: "Success",
        description: "Customer added successfully!",
      })
      e.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSupplierSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const supplier = {
      name: formData.get("name") as string,
      contact_person: (formData.get("contact_person") as string) || null,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      address: (formData.get("address") as string) || null,
      cost_rating: formData.get("cost_rating") as string,
      partnership_type: formData.get("partnership_type") as string,
    }

    try {
      await addSupplier(supplier)
      toast({
        title: "Success",
        description: "Supplier added successfully!",
      })
      e.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add supplier. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const sale = {
      customer_id: formData.get("customer_id") ? Number.parseInt(formData.get("customer_id") as string) : null,
      product_id: Number.parseInt(formData.get("product_id") as string),
      quantity: Number.parseInt(formData.get("quantity") as string),
      unit_price: Number.parseFloat(formData.get("unit_price") as string),
      total_amount:
        Number.parseFloat(formData.get("quantity") as string) * Number.parseFloat(formData.get("unit_price") as string),
      sale_date: formData.get("sale_date") as string,
      payment_method: formData.get("payment_method") as string,
      staff_id: (formData.get("staff_id") as string) || null,
    }

    try {
      await addSale(sale)
      toast({
        title: "Success",
        description: "Sale recorded successfully!",
      })
      e.currentTarget.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record sale. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Upload className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Data Management</h2>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add New Product</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grains & Cereals">Grains & Cereals</SelectItem>
                        <SelectItem value="Dairy Products">Dairy Products</SelectItem>
                        <SelectItem value="Beverages">Beverages</SelectItem>
                        <SelectItem value="Household Items">Household Items</SelectItem>
                        <SelectItem value="Snacks">Snacks</SelectItem>
                        <SelectItem value="Fresh Produce">Fresh Produce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Selling Price (₦)</Label>
                    <Input id="price" name="price" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="cost_price">Cost Price (₦)</Label>
                    <Input id="cost_price" name="cost_price" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input id="stock_quantity" name="stock_quantity" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="reorder_level">Reorder Level</Label>
                    <Input id="reorder_level" name="reorder_level" type="number" required />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add New Customer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Customer Name</Label>
                    <Input id="customer_name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="customer_type">Customer Type</Label>
                    <Select name="customer_type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Wholesale">Wholesale</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Email</Label>
                    <Input id="customer_email" name="email" type="email" />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Phone</Label>
                    <Input id="customer_phone" name="phone" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customer_address">Address</Label>
                  <Textarea id="customer_address" name="address" />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Customer"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add New Supplier</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSupplierSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier_name">Supplier Name</Label>
                    <Input id="supplier_name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input id="contact_person" name="contact_person" />
                  </div>
                  <div>
                    <Label htmlFor="supplier_email">Email</Label>
                    <Input id="supplier_email" name="email" type="email" />
                  </div>
                  <div>
                    <Label htmlFor="supplier_phone">Phone</Label>
                    <Input id="supplier_phone" name="phone" />
                  </div>
                  <div>
                    <Label htmlFor="cost_rating">Cost Rating</Label>
                    <Select name="cost_rating" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="partnership_type">Partnership Type</Label>
                    <Select name="partnership_type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Strategic">Strategic</SelectItem>
                        <SelectItem value="Preferred">Preferred</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="supplier_address">Address</Label>
                  <Textarea id="supplier_address" name="address" />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Supplier"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Record New Sale</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product_id">Product ID</Label>
                    <Input id="product_id" name="product_id" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="customer_id">Customer ID (Optional)</Label>
                    <Input id="customer_id" name="customer_id" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" name="quantity" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="unit_price">Unit Price (₦)</Label>
                    <Input id="unit_price" name="unit_price" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="sale_date">Sale Date</Label>
                    <Input id="sale_date" name="sale_date" type="datetime-local" required />
                  </div>
                  <div>
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Select name="payment_method" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                        <SelectItem value="Credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="staff_id">Staff ID</Label>
                    <Input id="staff_id" name="staff_id" />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Recording..." : "Record Sale"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
