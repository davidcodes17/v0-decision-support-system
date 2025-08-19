"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Truck, Phone, MapPin, Package, History, RefreshCw } from "lucide-react"
import { getSuppliers, getProducts } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

interface SupplierData {
  id: number
  name: string
  phone: string
  address: string
  goods_supplied: string[]
  quantity_supplied: number
  partnership_type: string
  contact_person: string
  email: string
  cost_rating: string
}

interface SupplierHistory {
  date: string
  product: string
  quantity: number
  amount: number
  status: string
}

export function SupplierManagement() {
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<SupplierData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(null)
  const [supplierHistory, setSupplierHistory] = useState<SupplierHistory[]>([])

  useEffect(() => {
    loadSupplierData()
  }, [])

  const loadSupplierData = async () => {
    setLoading(true)
    try {
      const [suppliersData, productsData] = await Promise.all([getSuppliers(), getProducts()])

      const enrichedSuppliers: SupplierData[] = suppliersData.map((supplier: any) => {
        // Get products supplied by this supplier
        const suppliedProducts = productsData.filter((product: any) => product.supplier_id === supplier.id)
        const goods_supplied = suppliedProducts.map((product: any) => product.name)
        const quantity_supplied = suppliedProducts.reduce(
          (sum: number, product: any) => sum + product.stock_quantity,
          0,
        )

        return {
          id: supplier.id,
          name: supplier.name,
          phone: supplier.phone || "N/A",
          address: supplier.address || "N/A",
          goods_supplied,
          quantity_supplied,
          partnership_type: supplier.partnership_type || "Regular",
          contact_person: supplier.contact_person || "N/A",
          email: supplier.email || "N/A",
          cost_rating: supplier.cost_rating || "Medium",
        }
      })

      setSuppliers(enrichedSuppliers)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load supplier data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSupplierHistory = (supplier: SupplierData) => {
    // Generate realistic supplier history data based on supplier
    const products = [
      "Rice (50kg bag)",
      "Beans (50kg bag)",
      "Garri (50kg bag)",
      "Rice (25kg bag)",
      "Wheat Flour (50kg)",
      "Maize (50kg bag)",
      "Yam Flour (25kg)",
      "Plantain Flour (10kg)",
      "Palm Oil (25L)",
      "Groundnut Oil (20L)",
    ]

    const mockHistory: SupplierHistory[] = Array.from({ length: 8 }, (_, i) => {
      const date = new Date(Date.now() - (i + 1) * 5 * 24 * 60 * 60 * 1000) // Every 5 days
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 150) + 20 // 20-170 units
      const unitPrice = Math.floor(Math.random() * 50000) + 10000 // ₦10k-60k per unit
      const amount = quantity * unitPrice
      const status = Math.random() > 0.1 ? "Delivered" : "Pending"

      return {
        date: date.toISOString().split("T")[0],
        product,
        quantity,
        amount,
        status,
      }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setSupplierHistory(mockHistory)
    setSelectedSupplier(supplier)
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.goods_supplied.some((good) => good.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getPartnershipBadge = (type: string) => {
    switch (type) {
      case "Strategic":
        return <Badge variant="default">Strategic</Badge>
      case "Preferred":
        return <Badge variant="secondary">Preferred</Badge>
      case "Regular":
        return <Badge variant="outline">Regular</Badge>
      default:
        return <Badge variant="outline">Regular</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading supplier data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier Management</h2>
        <Button onClick={loadSupplierData} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-500">Total Suppliers: {filteredSuppliers.length}</div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Goods Supplied</TableHead>
                  <TableHead className="text-center">Quantity Supplied</TableHead>
                  <TableHead className="text-center">Partnership</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Truck className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{supplier.name}</div>
                          <div className="text-sm text-gray-500">{supplier.contact_person}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{supplier.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="truncate max-w-[200px]" title={supplier.address}>
                          {supplier.address}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {supplier.goods_supplied.length > 0 ? (
                          <>
                            {supplier.goods_supplied.slice(0, 2).map((good, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {good}
                              </Badge>
                            ))}
                            {supplier.goods_supplied.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{supplier.goods_supplied.length - 2} more
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">No products assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {supplier.quantity_supplied.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">{getPartnershipBadge(supplier.partnership_type)}</TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => loadSupplierHistory(supplier)}>
                            <History className="h-4 w-4 mr-1" />
                            History
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <Truck className="h-5 w-5" />
                              <span>{selectedSupplier?.name} - Supply History</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Supplier Details */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-sm text-gray-600">Contact Person</p>
                                <p className="font-semibold">{selectedSupplier?.contact_person}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Phone Number</p>
                                <p className="font-semibold">{selectedSupplier?.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold">{selectedSupplier?.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Partnership Type</p>
                                <div>{getPartnershipBadge(selectedSupplier?.partnership_type || "Regular")}</div>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-gray-600">Address</p>
                                <p className="font-semibold">{selectedSupplier?.address}</p>
                              </div>
                            </div>

                            {/* Supply History Table */}
                            <div>
                              <h4 className="font-semibold mb-3">Complete Supply History</h4>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Product</TableHead>
                                      <TableHead className="text-center">Quantity</TableHead>
                                      <TableHead className="text-center">Amount (₦)</TableHead>
                                      <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {supplierHistory.map((record, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                          <div className="flex items-center space-x-2">
                                            <Package className="h-4 w-4 text-blue-600" />
                                            <span>{record.product}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-center font-mono">
                                          {record.quantity.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center font-mono">
                                          ₦{record.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <Badge variant={record.status === "Delivered" ? "default" : "secondary"}>
                                            {record.status}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              {/* Summary */}
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                  <div>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="font-semibold text-lg">{supplierHistory.length}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Total Value</p>
                                    <p className="font-semibold text-lg">
                                      ₦
                                      {supplierHistory.reduce((sum, record) => sum + record.amount, 0).toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Delivery Rate</p>
                                    <p className="font-semibold text-lg">
                                      {Math.round(
                                        (supplierHistory.filter((r) => r.status === "Delivered").length /
                                          supplierHistory.length) *
                                          100,
                                      )}
                                      %
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredSuppliers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No suppliers found matching your search." : "No supplier data available."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
