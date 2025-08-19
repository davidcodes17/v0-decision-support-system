"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Package, Search, RefreshCw } from "lucide-react"
import { getProducts, getSales } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  id: number
  name: string
  category: string
  opening_quantity: number
  opening_stock: number
  opening_available_stock: number
  current_quantity: number
  quantity_sold_today: number
  quantity_sold_yesterday: number
  reorder_level: number
  price: number
}

export function InventoryTable() {
  const { toast } = useToast()
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    setLoading(true)
    try {
      const [products, sales] = await Promise.all([getProducts(), getSales()])

      // Get today's and yesterday's dates
      const today = new Date().toISOString().split("T")[0]
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

      const inventoryItems: InventoryItem[] = products.map((product: any) => {
        // Calculate sales for today and yesterday
        const todaySales = sales
          .filter((sale: any) => sale.product_id === product.id && sale.sale_date.startsWith(today))
          .reduce((sum: number, sale: any) => sum + sale.quantity, 0)

        const yesterdaySales = sales
          .filter((sale: any) => sale.product_id === product.id && sale.sale_date.startsWith(yesterday))
          .reduce((sum: number, sale: any) => sum + sale.quantity, 0)

        // Calculate opening quantities (simulated - in real app this would come from daily stock records)
        const opening_quantity = product.stock_quantity + todaySales + yesterdaySales
        const opening_stock = opening_quantity * Number.parseFloat(product.cost_price)
        const opening_available_stock = product.stock_quantity

        return {
          id: product.id,
          name: product.name,
          category: product.category,
          opening_quantity,
          opening_stock,
          opening_available_stock,
          current_quantity: product.stock_quantity,
          quantity_sold_today: todaySales,
          quantity_sold_yesterday: yesterdaySales,
          reorder_level: product.reorder_level,
          price: Number.parseFloat(product.price),
        }
      })

      setInventoryData(inventoryItems)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inventory data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredData = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStockStatus = (currentQty: number, reorderLevel: number) => {
    if (currentQty === 0) return { status: "Out of Stock", variant: "destructive" as const }
    if (currentQty <= reorderLevel) return { status: "Low Stock", variant: "destructive" as const }
    if (currentQty <= reorderLevel * 1.5) return { status: "Medium", variant: "secondary" as const }
    return { status: "Good", variant: "default" as const }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading inventory data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stock Levels</h2>
        <Button onClick={loadInventoryData} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-500">Total Items: {filteredData.length}</div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Opening Qty</TableHead>
                  <TableHead className="text-center">Opening Stock (₦)</TableHead>
                  <TableHead className="text-center">Available Stock</TableHead>
                  <TableHead className="text-center">Current Qty</TableHead>
                  <TableHead className="text-center">Sold Today</TableHead>
                  <TableHead className="text-center">Sold Yesterday</TableHead>
                  <TableHead className="text-center">Reorder Level</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => {
                  const stockStatus = getStockStatus(item.current_quantity, item.reorder_level)
                  return (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-blue-600" />
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-center font-mono">{item.opening_quantity.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-mono">₦{item.opening_stock.toLocaleString()}</TableCell>
                      <TableCell className="text-center font-mono">
                        {item.opening_available_stock.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center font-mono font-semibold">
                        {item.current_quantity.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center font-mono text-green-600">
                        {item.quantity_sold_today.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center font-mono text-blue-600">
                        {item.quantity_sold_yesterday.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center font-mono">{item.reorder_level.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Badge variant={stockStatus.variant}>{stockStatus.status}</Badge>
                          {item.current_quantity <= item.reorder_level && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No products found matching your search." : "No inventory data available."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
