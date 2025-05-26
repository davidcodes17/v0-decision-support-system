"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Star,
  Building2,
  Truck,
  Upload,
  FileText,
} from "lucide-react"
import { DataUpload } from "@/components/data-upload"
import { ReportGenerator } from "@/components/report-generator"
import { getSales, getProducts, getCustomers, getSuppliers } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

export default function SoaringMartDSS() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalSales: 0,
    activeCustomers: 0,
    inventoryValue: 0,
    products: [],
    customers: [],
    suppliers: [],
    sales: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [products, customers, suppliers, sales] = await Promise.all([
        getProducts(),
        getCustomers(),
        getSuppliers(),
        getSales(),
      ])

      const totalRevenue = sales.reduce((sum: number, sale: any) => sum + Number.parseFloat(sale.total_amount), 0)
      const totalSales = sales.length
      const activeCustomers = customers.length
      const inventoryValue = products.reduce(
        (sum: number, product: any) => sum + Number.parseFloat(product.price) * product.stock_quantity,
        0,
      )

      setDashboardData({
        totalRevenue,
        totalSales,
        activeCustomers,
        inventoryValue,
        products,
        customers,
        suppliers,
        sales,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Sample data for charts (you can replace with real data processing)
  const salesData = [
    { month: "Jan", sales: 45000, forecast: 42000 },
    { month: "Feb", sales: 52000, forecast: 48000 },
    { month: "Mar", sales: 48000, forecast: 50000 },
    { month: "Apr", sales: 61000, forecast: 55000 },
    { month: "May", sales: 55000, forecast: 58000 },
    { month: "Jun", sales: 67000, forecast: 62000 },
  ]

  const customerSegments = [
    { name: "Regular Customers", value: 45, color: "#8884d8" },
    { name: "Occasional Buyers", value: 30, color: "#82ca9d" },
    { name: "New Customers", value: 15, color: "#ffc658" },
    { name: "VIP Customers", value: 10, color: "#ff7300" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Soaring Mart DSS</h1>
                  <p className="text-sm text-gray-500">Redemption City, Ogun State</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("reports")}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button size="sm" onClick={() => setActiveTab("upload")}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦{dashboardData.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Live data from database
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalSales.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Transactions recorded
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.activeCustomers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Registered customers
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦{dashboardData.inventoryValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600 flex items-center">
                      <Package className="h-3 w-3 mr-1" />
                      Current stock value
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, ""]} />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="forecast" stroke="#82ca9d" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerSegments}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {customerSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Analysis</h2>
              <Button onClick={loadDashboardData}>Refresh Data</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Products in Database ({dashboardData.products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.products.slice(0, 10).map((product: any, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{Number.parseFloat(product.price).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
                      </div>
                    </div>
                  ))}
                  {dashboardData.products.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No products found. Use the Upload Data tab to add products.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Data Tab */}
          <TabsContent value="upload">
            <DataUpload />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ReportGenerator />
          </TabsContent>

          {/* Other existing tabs remain the same... */}
          <TabsContent value="customers" className="space-y-6">
            <h2 className="text-2xl font-bold">Customer Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>Registered Customers ({dashboardData.customers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.customers.slice(0, 10).map((customer: any, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-gray-500">{customer.customer_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{Number.parseFloat(customer.total_spent).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total Spent</p>
                      </div>
                    </div>
                  ))}
                  {dashboardData.customers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No customers found. Use the Upload Data tab to add customers.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <h2 className="text-2xl font-bold">Inventory Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.products.map((product: any, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Package className="h-5 w-5 text-gray-600" />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-500">Reorder at {product.reorder_level}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">{product.stock_quantity} units</span>
                        <Badge variant={product.stock_quantity <= product.reorder_level ? "destructive" : "default"}>
                          {product.stock_quantity <= product.reorder_level ? "Low Stock" : "Good"}
                        </Badge>
                        {product.stock_quantity <= product.reorder_level && (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                  {dashboardData.products.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No products found. Use the Upload Data tab to add products.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <h2 className="text-2xl font-bold">Supplier Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>Registered Suppliers ({dashboardData.suppliers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.suppliers.map((supplier: any, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Truck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <p className="text-sm text-gray-500">{supplier.contact_person}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Reliability</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{supplier.reliability_score}%</span>
                          </div>
                        </div>
                        <Badge variant={supplier.partnership_type === "Strategic" ? "default" : "outline"}>
                          {supplier.partnership_type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {dashboardData.suppliers.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No suppliers found. Use the Upload Data tab to add suppliers.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <h2 className="text-2xl font-bold">Sales Forecasting</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, ""]} />
                      <Area type="monotone" dataKey="forecast" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Data Integration</h4>
                      <p className="text-sm text-blue-700">
                        Your database now has {dashboardData.products.length} products and {dashboardData.sales.length}{" "}
                        sales records.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">Customer Growth</h4>
                      <p className="text-sm text-green-700">
                        {dashboardData.customers.length} customers registered. Focus on retention strategies.
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900">Inventory Alerts</h4>
                      <p className="text-sm text-yellow-700">
                        Monitor stock levels and set up automatic reorder alerts.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
